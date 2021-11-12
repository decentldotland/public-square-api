import { arweave } from "./utils/arweave/arweave.js";
import { _validateAddress } from "./utils/arweave/address.js";
import { _decodePostsData } from "./utils/arweave/arweave.js";
import {
  postQuerySchema,
  postsPerAddressQuerySchema,
  arweaveSavesQuerySchema,
  gqlTemplate,
} from "./utils/arweave/gql.js";

export async function getPostsTransactions() {
  try {
    const query = postQuerySchema;
    const transactions = await gqlTemplate(query);

    return transactions;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

export async function getPostsOf(address) {
  try {
    _validateAddress(address);
    const query = postsPerAddressQuerySchema(address);
    const transactions = await gqlTemplate(query);
    const feed = await _decodePostsData(transactions, address);

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

export async function getFeed() {
  const feed = [];

  try {
    const postsTxs = await getPostsTransactions();
    const feed = await _decodePostsData(postsTxs, false);

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

export async function getArweaveSaves() {
  try {
    const savesArray = [];
    const saves = await gqlTemplate(arweaveSavesQuerySchema);

    for (let tx of saves) {
      const txStatus = (await arweave.transactions.getStatus(tx)).status;

      if (txStatus !== 200) {
        continue;
      }
      const tagsMap = new Map();
      const txObject = await arweave.transactions.get(tx);
      const tags = txObject.get("tags");

      for (let tag of tags) {
        const key = tag.get("name", { decode: true, string: true });
        const value = tag.get("value", { decode: true, string: true });
        tagsMap.set(key, value);
      }

      savesArray.push({
        txid: tx,
        url: tagsMap.has("page:url")
          ? tagsMap.get("page:url")
          : "https://arweave.net",
        title: tagsMap.has("page:title")
          ? tagsMap.get("page:title")
          : undefined,
        timestamp: tagsMap.has("page:timestamp")
          ? tagsMap.get("page:timestamp")
          : 1984,
      });
    }

    return savesArray;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

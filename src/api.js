import { arweave } from "./utils/arweave/arweave.js";
import { _validateAddress } from "./utils/arweave/address.js";
import {
  postQuerySchema,
  postsPerAddressQuerySchema,
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
    return transactions;
  } catch (error) {
    console.log(error.name);
    process.exit(1);
  }
}

export async function getFeed() {
  const feed = {};

  try {
    const postsTxs = await getPostsTransactions();

    for (let tx of postsTxs) {
      const txData = await arweave.transactions.getData(tx, {
        decode: true,
        string: true,
      });
      feed[tx] = txData;
    }
    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

getFeed();

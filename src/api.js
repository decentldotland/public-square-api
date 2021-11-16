import { arweave } from "./utils/arweave/arweave.js";
import { _validateAddress } from "./utils/arweave/address.js";
import { _decodePostsData } from "./utils/arweave/arweave.js";
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
    const feed = await _decodePostsData(transactions);

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
    const feed = await _decodePostsData(postsTxs);

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}



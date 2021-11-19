import { arweave } from "./utils/arweave/arweave.js";
import { _validateAddress, isParsable } from "./utils/arweave/address.js";
import { _decodePostsData } from "./utils/arweave/arweave.js";
import { createPost } from "./utils/arweave/arconnect.js";
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
    const poster = _validateAddress(address);
    const query = postsPerAddressQuerySchema(poster);
    const transactions = await gqlTemplate(query);
    const feed = await _decodePostsData(transactions);

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
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

export async function post(text, media) {
  try {
    const postTxObj = await createPost({
      text: text,
      media: media,
    });
    return postTxObj;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}

export async function getLazyFeed() {
  try {
    const feed = [];
    const posts = await getPostsTransactions();

    for (let post of posts) {
      const base64urlTag = post.tags[8]["value"];
      const encodedContent = base64url.decode(base64urlTag);

      if (isParsable(encodedContent)) {
        feed.push({
          pid: post.id,
          poster: post.owner,
          timestamp: post.timestamp,
          data: JSON.parse(encodedContent),
        });
      }
    }

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}

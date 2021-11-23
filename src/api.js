import { arweave } from "./utils/arweave/arweave.js";
import { _validateAddress, isParsable } from "./utils/arweave/address.js";
import { _decodePostsData } from "./utils/arweave/arweave.js";
import { createPost, createReply } from "./utils/arweave/arconnect.js";
import {
  postQuerySchema,
  postsPerAddressQuerySchema,
  repliesOfPostQuerySchema,
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

async function getPostRepliesTxs(post_id) {
  try {
    _validateAddress(post_id, false);
    const query = repliesOfPostQuerySchema(post_id);
    const transactions = await gqlTemplate(query);

    return transactions;
  } catch (error) {
    console.log(`${error.name} : ${error.value}`);
  }
}

export async function getPostsOf(address) {
  try {
    const poster = _validateAddress(address, true);
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
      text,
      media,
    });
    return postTxObj;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}

export async function reply(text, media, post_id) {
  try {
    const replyTxObj = await createReply({
      text,
      media,
      post_id,
    });
    return replyTxObj;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }


export async function getLazyFeed() {
  try {
    const feed = [];
    const posts = await getPostsTransactions();

    for (let post of posts) {
      const base64urlTag = post.tags.find(tag => tag.name === "lazyAccess")
      const encodedContent = base64url.decode(base64urlTag["value"]);

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

export async function getLazyReplies(post_id) {
  try {
    const feed = [];
    const replies = await getPostRepliesTxs(post_id);

    for (let reply of replies) {
      const base64urlTag = reply.tags.find((tag) => tag.name === "lazyAccess");
      const encodedContent = base64url.decode(base64urlTag["value"]);

      if (isParsable(encodedContent)) {
        feed.push({
          rid: reply.id,
          poster: reply.owner,
          timestamp: reply.timestamp,
          data: JSON.parse(encodedContent),
        });
      }
    }

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
  }
}


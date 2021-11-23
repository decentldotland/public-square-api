import { TOKENIZATION_CONTRACT } from "../constants/contracts.js";
import axios from "axios";

export const postQuerySchema = {
  query: `query {
  transactions(
    tags: [
        { name: "Contract-Src", values: "${TOKENIZATION_CONTRACT}"},
        { name: "App-Name", values: "PublicSquare"},
        { name: "Type", values: "post"},
        { name: "Version", values: "testnet-v4"},
        { name: "Content-Type", values: "application/json"},
        { name: "App-Name", values: "SmartWeaveContract"}

        ]
    first: 1000000
  ) {
    edges {
      node {
        id
        owner { address }
        block { timestamp }
        tags  { name value }
      }
    }
  }
}
`,
};


export function postsPerAddressQuerySchema(address) {
  const schema = {
    query: `query {
  transactions(
    owners:["${address}"]
    tags: [
        { name: "Contract-Src", values: "${TOKENIZATION_CONTRACT}"},
        { name: "App-Name", values: "PublicSquare"},
        { name: "Type", values: "post"},
        { name: "Version", values: "testnet-v4"},
        { name: "Content-Type", values: "application/json"},
        { name: "App-Name", values: "SmartWeaveContract"}

        ]
    first: 1000000
  ) {
    edges {
      node {
        id
        owner { address }
        block { timestamp }
        tags  { name value }
      }
    }
  }
}
`,
  };

  return schema;
}

export function repliesOfPostQuerySchema(post_id) {
  const schema = {
    query: `query {
  transactions(
    tags: [
        { name: "App-Name", values: "PublicSquare"},
        { name: "Type", values: "reply"},
        { name: "reply-to", values: "${post_id}"}
        { name: "Version", values: "testnet-v4"},
        { name: "Content-Type", values: "application/json"},
        ]
    first: 1000000
  ) {
    edges {
      node {
        id
        owner { address }
        block { timestamp }
        tags  { name value }
      }
    }
  }
}
`,
  };

  return schema;
}

export async function gqlTemplate(query) {
  const response = await axios.post("https://arweave.net/graphql", query, {
    headers: { "Content-Type": "application/json" },
  });

  const transactionIds = [];

  const res_arr = response.data.data.transactions.edges;

  for (let element of res_arr) {
    const tx = element["node"]


    transactionIds.push({
      id: tx.id,
      owner: tx.owner.address,
      // pending transactions do not have block value
      timestamp: tx.block ? tx.block.timestamp : Date.now(),
      tags: tx.tags ? tx.tags : [],
    });
  }
  
  return transactionIds;
}


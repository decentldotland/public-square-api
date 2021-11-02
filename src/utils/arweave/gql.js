import { TOKENIZATION_CONTRACT } from "../constants/contracts.js";
import fetch from "node-fetch";

export const postQuerySchema = {
  query: `query {
  transactions(
    tags: [
        { name: "Contract-Src", values: "${TOKENIZATION_CONTRACT}"},
        { name: "App-Name", values: "PublicSquare"},
        { name: "Type", values: "post"},
        { name: "Version", values: "1"},
        { name: "Content-Type", values: "text/plain"},
        { name: "App-Name", values: "SmartWeaveContract"}

        ]
    first: 1000000
  ) {
    edges {
      node {
        id
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
        { name: "Version", values: "1"},
        { name: "Content-Type", values: "text/plain"},
        { name: "App-Name", values: "SmartWeaveContract"}

        ]
    first: 1000000
  ) {
    edges {
      node {
        id
      }
    }
  }
}
`,
  };

  return schema;
}

export async function gqlTemplate(query) {
  const response = await fetch("https://arweave.net/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(query),
  });

  const json = await response.json();
  const transactionIds = [];

  const res_arr = json["data"]["transactions"]["edges"];

  for (let element in Object.values(res_arr)) {
    transactionIds.push(res_arr[element]["node"]["id"]);
  }

  return transactionIds;
}

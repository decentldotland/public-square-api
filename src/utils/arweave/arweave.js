import Arweave from "arweave";
const utf8decoder = new TextDecoder();

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

export async function _decodePostsData(postsTransactions) {
  const feed = [];

  try {
    for (let tx of postsTransactions) {
      const txData = await arweave.transactions.getData(tx.id, {
        decode: true,
        string: true,
      });

      feed.push({
        pid: tx.id,
        poster: tx.owner,
        timestamp: tx.timestamp,
        data: JSON.parse(txData),
      });
    }

    return feed;
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

export function generateState(address) {
  const initState = `{"issuer": "${address}","owner": "${address}","name": "PS Post","ticker": "PSP","description": "a post as NFT via decent.land","thumbnail": "","balances": {"${address}": 1}}`;
  return initState;
}



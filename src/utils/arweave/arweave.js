import Arweave from "arweave"

export const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
  timeout: 20000,
  logging: false,
});

export async function _decodePostsData(postsTransactions, knownOwner) {
  const feed = [];

  try {
    for (let tx of postsTransactions) {
      let poster = void 0;
      const txObject = await arweave.transactions.get(tx);
      const txData = await arweave.transactions.getData(tx, {
        decode: true,
        string: true,
      });

      if (!knownOwner) {
        const owner = txObject["owner"];
        poster = await arweave.wallets.ownerToAddress(owner);
      } else {
        poster = knownOwner;
      }

      feed.push({
        id: tx,
        poster: poster,
        data: txData,
      });
    }

    return feed;
  } catch (error) {
    console.log(`${error.name}: ${error.message}`);
    process.exit(1);
  }
}

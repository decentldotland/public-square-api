import { arweave, generateState } from "./arweave.js";
import { TOKENIZATION_CONTRACT } from "../constants/contracts.js";

async function connect() {
  if (!window.arweaveWallet) {
    throw new Error("arconnect not found");
  }

  await window.arweaveWallet.connect([
    "ACCESS_ADDRESS",
    "SIGNATURE",
    "SIGN_TRANSACTION",
  ]);
}

function _validateText(text) {
  if (typeof text !== "string") {
    throw new Error("invalid text type");
  }

  const trimmed = text.trim();

  if (trimmed.length <= 0 || trimmed.length > 280) {
    throw new Error("text too long/short")
  }
}

export async function getArAddress() {
  if (
    !window.arweaveWallet ||
    (await window.arweaveWallet.getPermissions()).length === 0
  ) {
    await connect();
  }

  return await window.arweaveWallet.getActiveAddress();
}

export async function createPost({ text = "hello world", media = [] } = {}) {
  _validateText(text);

  let poster = await getArAddress();

  if (!poster) {
    poster = await getArAddress();
  } else {
    const content = {
      text: text,
      media: media,
    };
    const tx = await arweave.createTransaction({
      data: JSON.stringify(content),
    });
    const state = generateState(poster);

    tx.addTag("Contract-Src", TOKENIZATION_CONTRACT);
    tx.addTag("App-Name", "PublicSquare");
    tx.addTag("Version", "1");
    tx.addTag("Type", "post");
    tx.addTag("Content-Type", "application/json");
    tx.addTag("Init-State", state);
    tx.addTag("App-Name", "SmartWeaveContract");
    tx.addTag("App-Version", "0.3.0");

    await arweave.transactions.sign(tx);
    await arweave.transactions.post(tx);

    return tx;
  }
}

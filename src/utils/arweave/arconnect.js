import { arweave, generateState } from "./arweave.js";
import { TOKENIZATION_CONTRACT } from "../constants/contracts.js";
import base64url from "base64url";

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
  try {
    _validateText(text);

    if (media.length > 3) {
      throw new Error("media count too large");
    }

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
      const base64urlTagValue = base64url(JSON.stringify(content));

      tx.addTag("Contract-Src", TOKENIZATION_CONTRACT);
      tx.addTag("App-Name", "PublicSquare");
      tx.addTag("Version", "testnet-v4");
      tx.addTag("Type", "post");
      tx.addTag("Content-Type", "application/json");
      tx.addTag("Init-State", state);
      tx.addTag("App-Name", "SmartWeaveContract");
      tx.addTag("App-Version", "0.3.0");
      tx.addTag("lazyAccess", base64urlTagValue);

      await arweave.transactions.sign(tx);
      await arweave.transactions.post(tx);

      return tx;
    }
  } catch (error) {
    console.log(`${error.name} : ${error.description}`);
  }
}

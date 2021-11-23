import { arweave } from "./arweave.js";
import { InvalidArweaveAddress } from "../errors/invalidAddress.js";
import { FALLBACK_FEED_ADDRESS } from "../constants/contracts.js";


export function _validateAddress(address, fallbackFeed) {
  const validity = /[a-z0-9_-]{43}/i.test(address);

  if (!validity && fallbackFeed) {
    // throw new InvalidArweaveAddress(`address: ${address} is not valid`)
    // return a default feed of an automated publisher
    return FALLBACK_FEED_ADDRESS;
  }

  if (!validity && !fallbackFeed) {
    throw new InvalidArweaveAddress(`invalid address: "${address}"`)
  }

  return address;
}

export function isParsable(string) {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }
  return true;
}

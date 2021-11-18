import { arweave } from "./arweave.js";
import { InvalidArweaveAddress } from "../errors/invalidAddress.js";


export function _validateAddress(address) {
  const validity = /[a-z0-9_-]{43}/i.test(address);

  if (!validity) {
    // throw new InvalidArweaveAddress(`address: ${address} is not valid`)
    // return a default feed of an automated publisher
    return "vZY2XY1RD9HIfWi8ift-1_DnHLDadZMWrufSh-_rKF0";
  }

  return address;
}

import { Address } from "viem";
import { SKILLBOARD_ABI } from "./abi";

export const SKILLBOARD_ADDRESS = (process.env.NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS ||
  "0x839Ea7614CD798f1Cf31e3397635CD7Ed0b3B4A1") as Address;

export { SKILLBOARD_ABI };

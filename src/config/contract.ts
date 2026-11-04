import { Address } from "viem";
import { SKILLBOARD_ABI } from "./abi";

export const SKILLBOARD_ADDRESS = (process.env.NEXT_PUBLIC_SKILLBOARD_CONTRACT_ADDRESS ||
  "0x0000000000000000000000000000000000000000") as Address;

export { SKILLBOARD_ABI };


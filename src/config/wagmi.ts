import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet } from "./chain";

export const config = createConfig({
  chains: [botchainMainnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
  },
  ssr: true,
});

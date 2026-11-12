import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet, botchainTestnet } from "./chain";

export const config = createConfig({
  chains: [botchainMainnet, botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http(process.env.NEXT_PUBLIC_BOTCHAIN_RPC_URL || "https://rpc.botchain.ai"),
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});

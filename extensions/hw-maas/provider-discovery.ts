// Huawei Cloud MAAS provider discovery module.
import type { ProviderPlugin } from "openclaw/plugin-sdk/provider-model-shared";
import { buildHwMaasProvider, buildHwMaasTokenPlanProvider } from "./provider-catalog.js";

const hwMaasProviderDiscovery: ProviderPlugin[] = [
  {
    id: "hw-maas",
    label: "Huawei Cloud MaaS",
    docsPath: "/providers/hw-maas",
    auth: [],
    staticCatalog: {
      order: "simple",
      run: async () => ({
        provider: buildHwMaasProvider(),
      }),
    },
  },
  {
    id: "hw-maas-token-plan",
    label: "Huawei Cloud MaaS Token Plan",
    docsPath: "/providers/hw-maas",
    auth: [],
    staticCatalog: {
      order: "simple",
      run: async () => ({
        provider: buildHwMaasTokenPlanProvider(),
      }),
    },
  },
];

export default hwMaasProviderDiscovery;

// Huawei Cloud MAAS provider module implements model/runtime integration.
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelProviderConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };

export const HW_MAAS_PROVIDER_ID = "hw-maas";
export const HW_MAAS_TOKEN_PLAN_PROVIDER_ID = "hw-maas-token-plan";
export const HW_MAAS_DEFAULT_MODEL_ID = "deepseek-v4-flash";
export const HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_ID = "deepseek-v4-flash";

export function buildHwMaasProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: HW_MAAS_PROVIDER_ID,
    catalog: manifest.modelCatalog.providers[HW_MAAS_PROVIDER_ID],
  });
}

export function buildHwMaasTokenPlanProvider(): ModelProviderConfig {
  return buildManifestModelProviderConfig({
    providerId: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
    catalog: manifest.modelCatalog.providers[HW_MAAS_TOKEN_PLAN_PROVIDER_ID],
  });
}

// Huawei Cloud MAAS plugin module implements models behavior.
import { buildManifestModelProviderConfig } from "openclaw/plugin-sdk/provider-catalog-shared";
import type { ModelDefinitionConfig } from "openclaw/plugin-sdk/provider-model-shared";
import manifest from "./openclaw.plugin.json" with { type: "json" };
import { HW_MAAS_PROVIDER_ID, HW_MAAS_TOKEN_PLAN_PROVIDER_ID } from "./provider-catalog.js";

const HW_MAAS_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: HW_MAAS_PROVIDER_ID,
  catalog: manifest.modelCatalog.providers[HW_MAAS_PROVIDER_ID],
});

const HW_MAAS_TOKEN_PLAN_MANIFEST_PROVIDER = buildManifestModelProviderConfig({
  providerId: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
  catalog: manifest.modelCatalog.providers[HW_MAAS_TOKEN_PLAN_PROVIDER_ID],
});

export const HW_MAAS_BASE_URL = HW_MAAS_MANIFEST_PROVIDER.baseUrl;
export const HW_MAAS_TOKEN_PLAN_BASE_URL = HW_MAAS_TOKEN_PLAN_MANIFEST_PROVIDER.baseUrl;

export const HW_MAAS_MODEL_CATALOG: ModelDefinitionConfig[] = HW_MAAS_MANIFEST_PROVIDER.models;
export const HW_MAAS_TOKEN_PLAN_MODEL_CATALOG: ModelDefinitionConfig[] =
  HW_MAAS_TOKEN_PLAN_MANIFEST_PROVIDER.models;

export function buildHwMaasModelDefinition(entry: ModelDefinitionConfig): ModelDefinitionConfig {
  return {
    ...entry,
    input: [...entry.input],
  };
}

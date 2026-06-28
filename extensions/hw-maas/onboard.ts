// Huawei Cloud MAAS setup module handles plugin onboarding behavior.
import {
  createDefaultModelPresetAppliers,
  type OpenClawConfig,
} from "openclaw/plugin-sdk/provider-onboard";
import {
  buildHwMaasProvider,
  buildHwMaasTokenPlanProvider,
  HW_MAAS_DEFAULT_MODEL_ID,
  HW_MAAS_PROVIDER_ID,
  HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_ID,
  HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
} from "./provider-catalog.js";

export const HW_MAAS_DEFAULT_MODEL_REF = `${HW_MAAS_PROVIDER_ID}/${HW_MAAS_DEFAULT_MODEL_ID}`;
export const HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF = `${HW_MAAS_TOKEN_PLAN_PROVIDER_ID}/${HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_ID}`;

const hwMaasPresetAppliers = createDefaultModelPresetAppliers({
  primaryModelRef: HW_MAAS_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig) => {
    const defaultProvider = buildHwMaasProvider();
    return {
      providerId: HW_MAAS_PROVIDER_ID,
      api: defaultProvider.api ?? "openai-completions",
      baseUrl: defaultProvider.baseUrl,
      defaultModels: defaultProvider.models ?? [],
      defaultModelId: HW_MAAS_DEFAULT_MODEL_ID,
      aliases: [{ modelRef: HW_MAAS_DEFAULT_MODEL_REF, alias: "Huawei MaaS" }],
    };
  },
});

const hwMaasTokenPlanPresetAppliers = createDefaultModelPresetAppliers({
  primaryModelRef: HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF,
  resolveParams: (_cfg: OpenClawConfig) => {
    const defaultProvider = buildHwMaasTokenPlanProvider();
    return {
      providerId: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
      api: defaultProvider.api ?? "openai-completions",
      baseUrl: defaultProvider.baseUrl,
      defaultModels: defaultProvider.models ?? [],
      defaultModelId: HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_ID,
      aliases: [
        { modelRef: HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF, alias: "Huawei MaaS Token Plan" },
      ],
    };
  },
});

export function applyHwMaasConfig(cfg: OpenClawConfig): OpenClawConfig {
  return hwMaasPresetAppliers.applyConfig(cfg);
}

export function applyHwMaasTokenPlanConfig(cfg: OpenClawConfig): OpenClawConfig {
  return hwMaasTokenPlanPresetAppliers.applyConfig(cfg);
}

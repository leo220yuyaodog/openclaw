// Huawei Cloud MAAS plugin entrypoint registers its OpenClaw integration.
import { definePluginEntry } from "openclaw/plugin-sdk/plugin-entry";
import type { ProviderCatalogContext } from "openclaw/plugin-sdk/plugin-entry";
import { createProviderApiKeyAuthMethod } from "openclaw/plugin-sdk/provider-auth-api-key";
import {
  buildProviderReplayFamilyHooks,
  applyModelCompatPatch,
  type ProviderRuntimeModel,
} from "openclaw/plugin-sdk/provider-model-shared";
import { ensureModelAllowlistEntry } from "openclaw/plugin-sdk/provider-onboard";
import {
  buildHwMaasProvider,
  buildHwMaasTokenPlanProvider,
  HW_MAAS_PROVIDER_ID,
  HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
} from "./provider-catalog.js";

const HW_MAAS_DEFAULT_MODEL_REF = `${HW_MAAS_PROVIDER_ID}/deepseek-v4-flash`;
const HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF = `${HW_MAAS_TOKEN_PLAN_PROVIDER_ID}/deepseek-v4-flash`;

const HW_MAAS_PROVIDER_HOOKS = {
  ...buildProviderReplayFamilyHooks({
    family: "openai-compatible",
    dropReasoningFromHistory: false,
  }),
  normalizeResolvedModel: ({ model }: { model: ProviderRuntimeModel }) =>
    applyModelCompatPatch(model, { omitEmptyArrayItems: true }),
};

function resolveHwMaasCatalog(ctx: ProviderCatalogContext) {
  const apiKey = ctx.resolveProviderApiKey(HW_MAAS_PROVIDER_ID).apiKey;
  if (!apiKey) return null;
  return {
    providers: {
      [HW_MAAS_PROVIDER_ID]: { ...buildHwMaasProvider(), apiKey },
    },
  };
}

function resolveHwMaasTokenPlanCatalog(ctx: ProviderCatalogContext) {
  const apiKey = ctx.resolveProviderApiKey(HW_MAAS_TOKEN_PLAN_PROVIDER_ID).apiKey;
  if (!apiKey) return null;
  return {
    providers: {
      [HW_MAAS_TOKEN_PLAN_PROVIDER_ID]: { ...buildHwMaasTokenPlanProvider(), apiKey },
    },
  };
}

export default definePluginEntry({
  id: "hw-maas",
  name: "Huawei Cloud MaaS Provider",
  description: "Bundled Huawei Cloud MaaS provider plugin",
  register(api) {
    api.registerProvider({
      id: HW_MAAS_PROVIDER_ID,
      label: "Huawei Cloud MaaS",
      docsPath: "/providers/hw-maas",
      aliases: ["hw-maas-token-plan"],
      envVars: ["HUAWEI_MAAS_API_KEY"],
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: HW_MAAS_PROVIDER_ID,
          methodId: "api-key",
          label: "Huawei Cloud MaaS API key",
          hint: "API key",
          optionKey: "huaweiMaasApiKey",
          flagName: "--huawei-maas-api-key",
          envVar: "HUAWEI_MAAS_API_KEY",
          promptMessage: "Enter Huawei Cloud MAAS API key",
          defaultModel: HW_MAAS_DEFAULT_MODEL_REF,
          expectedProviders: [HW_MAAS_PROVIDER_ID, HW_MAAS_TOKEN_PLAN_PROVIDER_ID],
          applyConfig: (cfg) =>
            ensureModelAllowlistEntry({
              cfg,
              modelRef: HW_MAAS_DEFAULT_MODEL_REF,
            }),
          wizard: {
            choiceId: "hw-maas-api-key",
            choiceLabel: "Huawei Cloud MaaS API key",
            groupId: "hw-maas",
            groupLabel: "Huawei Cloud MaaS",
            groupHint: "API key",
          },
        }),
      ],
      catalog: {
        order: "paired",
        run: async (ctx) => resolveHwMaasCatalog(ctx),
      },
      augmentModelCatalog: () => {
        const models = buildHwMaasProvider().models.map((entry) => ({
          provider: HW_MAAS_PROVIDER_ID,
          id: entry.id,
          name: entry.name,
          reasoning: entry.reasoning,
          input: [...entry.input],
          contextWindow: entry.contextWindow,
        }));
        return models;
      },
      ...HW_MAAS_PROVIDER_HOOKS,
    });

    api.registerProvider({
      id: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
      label: "Huawei Cloud MaaS Token Plan",
      docsPath: "/providers/hw-maas",
      auth: [
        createProviderApiKeyAuthMethod({
          providerId: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
          methodId: "api-key",
          label: "Huawei Cloud MaaS Token Plan API key",
          hint: "Token Plan",
          optionKey: "huaweiMaasApiKey",
          flagName: "--huawei-maas-api-key",
          envVar: "HUAWEI_MAAS_API_KEY",
          promptMessage: "Enter Huawei Cloud MAAS Token Plan API key",
          defaultModel: HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF,
          expectedProviders: [HW_MAAS_TOKEN_PLAN_PROVIDER_ID],
          applyConfig: (cfg) =>
            ensureModelAllowlistEntry({
              cfg,
              modelRef: HW_MAAS_TOKEN_PLAN_DEFAULT_MODEL_REF,
            }),
          wizard: {
            choiceId: "hw-maas-token-plan-api-key",
            choiceLabel: "Huawei Cloud MaaS Token Plan API key",
            groupId: "hw-maas",
            groupLabel: "Huawei Cloud MaaS",
            groupHint: "API key / Token Plan",
          },
        }),
      ],
      catalog: {
        order: "paired",
        run: async (ctx) => resolveHwMaasTokenPlanCatalog(ctx),
      },
      augmentModelCatalog: () => {
        const models = buildHwMaasTokenPlanProvider().models.map((entry) => ({
          provider: HW_MAAS_TOKEN_PLAN_PROVIDER_ID,
          id: entry.id,
          name: entry.name,
          reasoning: entry.reasoning,
          input: [...entry.input],
          contextWindow: entry.contextWindow,
        }));
        return models;
      },
      ...HW_MAAS_PROVIDER_HOOKS,
    });
  },
});

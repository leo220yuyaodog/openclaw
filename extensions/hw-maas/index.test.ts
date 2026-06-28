// Huawei Cloud MAAS tests cover index plugin behavior.
import fs from "node:fs";
import { registerSingleProviderPlugin } from "openclaw/plugin-sdk/plugin-test-runtime";
import { describe, expect, it } from "vitest";
import plugin from "./index.js";

type HwMaasManifest = {
  modelCatalog?: {
    providers?: Record<
      string,
      {
        baseUrl?: string;
        api?: string;
        models?: Array<{
          id: string;
          name: string;
          contextWindow: number;
          maxTokens: number;
        }>;
      }
    >;
  };
  setup?: {
    providers?: Array<{
      id?: string;
      envVars?: string[];
    }>;
  };
  providerAuthChoices?: Array<{
    provider?: string;
    method?: string;
    choiceId?: string;
    groupId?: string;
    groupLabel?: string;
  }>;
  providerAuthAliases?: Record<string, string>;
};

function readManifest(): HwMaasManifest {
  return JSON.parse(
    fs.readFileSync(new URL("./openclaw.plugin.json", import.meta.url), "utf8"),
  ) as HwMaasManifest;
}

describe("hw-maas provider plugin", () => {
  it("declares two providers in the manifest", () => {
    const manifest = readManifest();
    const providerIds = Object.keys(manifest.modelCatalog?.providers ?? {});
    expect(providerIds).toContain("hw-maas");
    expect(providerIds).toContain("hw-maas-token-plan");
  });

  it("sets correct base URLs for both providers", () => {
    const providers = readManifest().modelCatalog?.providers ?? {};
    expect(providers["hw-maas"]?.baseUrl).toBe("https://api.modelarts-maas.com/v2");
    expect(providers["hw-maas-token-plan"]?.baseUrl).toBe("https://api.modelarts-maas.com/plan/v2");
  });

  it("exposes the correct API type", () => {
    const providers = readManifest().modelCatalog?.providers ?? {};
    expect(providers["hw-maas"]?.api).toBe("openai-completions");
    expect(providers["hw-maas-token-plan"]?.api).toBe("openai-completions");
  });

  it("has 5 models for each provider", () => {
    const providers = readManifest().modelCatalog?.providers ?? {};
    expect(providers["hw-maas"]?.models?.length).toBe(5);
    expect(providers["hw-maas-token-plan"]?.models?.length).toBe(5);
  });

  it("declares all Token Plan models", () => {
    const models = readManifest().modelCatalog?.providers?.["hw-maas-token-plan"]?.models ?? [];
    const modelIds = models.map((m) => m.id).toSorted();
    expect(modelIds).toEqual([
      "deepseek-v3.2",
      "deepseek-v4-flash",
      "glm-5",
      "glm-5.1",
      "kimi-k2.6",
    ]);
  });

  it("configures setup env vars correctly", () => {
    const manifest = readManifest();
    const hwMaasSetup = manifest.setup?.providers?.find((p) => p.id === "hw-maas");
    const tokenPlanSetup = manifest.setup?.providers?.find((p) => p.id === "hw-maas-token-plan");

    expect(hwMaasSetup?.envVars).toEqual(["HUAWEI_MAAS_API_KEY"]);
    expect(tokenPlanSetup?.envVars).toEqual(["HUAWEI_MAAS_API_KEY"]);
  });

  it("declares token plan as auth alias for hw-maas", () => {
    expect(readManifest().providerAuthAliases).toEqual({
      "hw-maas-token-plan": "hw-maas",
    });
  });

  it("declares two auth choices for onboarding", () => {
    const authChoices = readManifest().providerAuthChoices ?? [];
    expect(authChoices.length).toBe(2);

    const paygChoice = authChoices.find((c) => c.provider === "hw-maas");
    expect(paygChoice?.choiceId).toBe("hw-maas-api-key");
    expect(paygChoice?.groupId).toBe("hw-maas");

    const tokenPlanChoice = authChoices.find((c) => c.provider === "hw-maas-token-plan");
    expect(tokenPlanChoice?.choiceId).toBe("hw-maas-token-plan-api-key");
    expect(tokenPlanChoice?.groupId).toBe("hw-maas");
  });

  it("registers hw-maas plugin and makes models discoverable", async () => {
    const provider = await registerSingleProviderPlugin(plugin);

    expect(provider).toBeDefined();
    expect(provider.id).toBe("hw-maas");
    expect(provider.label).toBe("Huawei Cloud MaaS");
    expect(provider.envVars).toContain("HUAWEI_MAAS_API_KEY");
  });

  it("augments model catalog with correct provider entries", async () => {
    const provider = await registerSingleProviderPlugin(plugin);
    const entries = await provider.augmentModelCatalog?.({
      env: process.env,
      entries: [],
    } as never);

    expect(entries).toBeDefined();
    expect(entries?.length).toBe(5);
    expect(entries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ provider: "hw-maas", id: "deepseek-v4-flash" }),
        expect.objectContaining({ provider: "hw-maas", id: "glm-5.1" }),
      ]),
    );
  });
});

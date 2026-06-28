---
summary: "Huawei Cloud MaaS setup (pay-as-you-go and Token Plan models)"
title: "Huawei Cloud MAAS"
read_when:
  - You want to use Huawei Cloud MaaS with OpenClaw
  - You need the Huawei Cloud MAAS API key setup
  - You want Token Plan or pay-as-you-go MAAS models
---

Huawei Cloud MaaS (Model as a Service) provides access to popular
foundation models through two billing modes. OpenClaw includes a bundled plugin
with both provider presets:

- **Pay-as-you-go** — deploy inference endpoints and pay per call (`hw-maas`)
- **Token Plan** — subscribe to a monthly plan for fixed pricing
  (`hw-maas-token-plan`)

| Property       | Value                                                                                                                  |
| -------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Provider ids   | `hw-maas` (pay-as-you-go), `hw-maas-token-plan` (Token Plan)                                                           |
| Plugin         | bundled, `enabledByDefault: true`                                                                                      |
| Model auth     | `HUAWEI_MAAS_API_KEY`                                                                                                  |
| Onboarding     | `--auth-choice hw-maas-api-key` or `--auth-choice hw-maas-token-plan-api-key`                                          |
| Direct CLI     | `--huawei-maas-api-key <key>`                                                                                          |
| API            | OpenAI-compatible (`openai-completions`)                                                                               |
| Base URLs      | Pay-as-you-go: configurable, default `api.modelarts-maas.com/v2`; Token Plan: `https://api.modelarts-maas.com/plan/v2` |
| Default models | `hw-maas/deepseek-v4-flash`, `hw-maas-token-plan/deepseek-v4-flash`                                                    |
| Region         | 西南-贵阳一 (cn-southwest-2)                                                                                           |

## Getting started

<Steps>
  <Step title="Get an API key">
    Go to the [Huawei Cloud MaaS console](https://console.huaweicloud.com/modelarts/maas)
    and create an API key.

    - **Token Plan**: Subscribe to a [Token Plan](https://support.huaweicloud.com/Token-plan-maas/tokenplan-maas-0001.html)
      first, then use the API key with the Token Plan endpoint.
    - **Pay-as-you-go**: Deploy an inference endpoint from the
      [console](https://console.huaweicloud.com/modelarts/maas), then generate an
      API key for endpoint access.

  </Step>

  <Step title="Run onboarding">
    Token Plan:

    ```bash
    openclaw onboard --auth-choice hw-maas-token-plan-api-key
    ```

    Pay-as-you-go:

    ```bash
    openclaw onboard --auth-choice hw-maas-api-key
    ```

    Or pass the key directly:

    ```bash
    openclaw onboard --huawei-maas-api-key=<your-key>
    ```

  </Step>

  <Step title="Set a default model">
    ```json5
    {
      agents: {
        defaults: {
          model: { primary: "hw-maas-token-plan/deepseek-v4-flash" },
        },
      },
    }
    ```
  </Step>

  <Step title="Verify models are available">
    ```bash
    openclaw models list --provider hw-maas-token-plan
    ```
  </Step>
</Steps>

## Pay-as-you-go catalog

| Model ref                   | Input | Context   | Max output | Notes         |
| --------------------------- | ----- | --------- | ---------- | ------------- |
| `hw-maas/deepseek-v4-flash` | text  | 1,024,000 | 64,000     | Default model |
| `hw-maas/deepseek-v3.2`     | text  | 128,000   | 32,000     |               |
| `hw-maas/glm-5.1`           | text  | 192,000   | 64,000     |               |
| `hw-maas/glm-5`             | text  | 192,000   | 64,000     |               |
| `hw-maas/kimi-k2.6`         | text  | 256,000   | 32,000     |               |

<Tip>
Pay-as-you-go requires deploying an inference endpoint first and configuring
`baseUrl` to match your endpoint URL. Pricing depends on your deployed endpoint.
</Tip>

## Token Plan catalog

| Model ref                              | Input | Context   | Max output | Notes         |
| -------------------------------------- | ----- | --------- | ---------- | ------------- |
| `hw-maas-token-plan/deepseek-v4-flash` | text  | 1,024,000 | 64,000     | Default model |
| `hw-maas-token-plan/deepseek-v3.2`     | text  | 128,000   | 32,000     |               |
| `hw-maas-token-plan/glm-5.1`           | text  | 192,000   | 64,000     |               |
| `hw-maas-token-plan/glm-5`             | text  | 192,000   | 64,000     |               |
| `hw-maas-token-plan/kimi-k2.6`         | text  | 256,000   | 32,000     |               |

## Configuration

### Token Plan

```json5
{
  env: { HUAWEI_MAAS_API_KEY: "your-api-key" },
  agents: { defaults: { model: { primary: "hw-maas-token-plan/deepseek-v4-flash" } } },
  models: {
    mode: "merge",
    providers: {
      "hw-maas-token-plan": {
        baseUrl: "https://api.modelarts-maas.com/plan/v2",
        api: "openai-completions",
        apiKey: "HUAWEI_MAAS_API_KEY",
        models: [
          {
            id: "deepseek-v4-flash",
            name: "DeepSeek-V4-Flash",
            input: ["text"],
            contextWindow: 1024000,
            maxTokens: 64000,
          },
          {
            id: "deepseek-v3.2",
            name: "DeepSeek-V3.2",
            input: ["text"],
            contextWindow: 128000,
            maxTokens: 32000,
          },
          {
            id: "glm-5.1",
            name: "GLM-5.1",
            input: ["text"],
            contextWindow: 192000,
            maxTokens: 64000,
          },
          {
            id: "glm-5",
            name: "GLM-5",
            input: ["text"],
            contextWindow: 192000,
            maxTokens: 64000,
          },
          {
            id: "kimi-k2.6",
            name: "Kimi-K2.6",
            input: ["text"],
            contextWindow: 256000,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```

### Pay-as-you-go

For pay-as-you-go, deploy an inference endpoint from the
[Huawei Cloud console](https://console.huaweicloud.com/modelarts/maas) first.
The `baseUrl` must match your deployed endpoint URL.

```json5
{
  env: { HUAWEI_MAAS_API_KEY: "your-api-key" },
  agents: { defaults: { model: { primary: "hw-maas/deepseek-v4-flash" } } },
  models: {
    mode: "merge",
    providers: {
      "hw-maas": {
        baseUrl: "https://your-endpoint.region.myhuaweicloud.com/v1/your-endpoint-id",
        api: "openai-completions",
        apiKey: "HUAWEI_MAAS_API_KEY",
        models: [
          {
            id: "deepseek-v4-flash",
            name: "DeepSeek-V4-Flash",
            input: ["text"],
            contextWindow: 1024000,
            maxTokens: 64000,
          },
          {
            id: "deepseek-v3.2",
            name: "DeepSeek-V3.2",
            input: ["text"],
            contextWindow: 128000,
            maxTokens: 32000,
          },
        ],
      },
    },
  },
}
```

> **Note:** The pay-as-you-go provider (`hw-maas`) requires you to configure
> `baseUrl` to match your deployed endpoint URL. The default base URL
> `https://api.modelarts-maas.com/v2` is a generic entry point.

## Switching models

Switch models in a running session:

```bash
/model hw-maas-token-plan/kimi-k2.6
```

Or set a permanent default:

```json5
{
  agents: {
    defaults: {
      model: { primary: "hw-maas-token-plan/kimi-k2.6" },
    },
  },
}
```

## Prerequisites

1. **Token Plan**: Subscribe to the [MaaS Token Plan](https://support.huaweicloud.com/Token-plan-maas/tokenplan-maas-0001.html)
   on Huawei Cloud.
2. **Pay-as-you-go**: Deploy an inference endpoint from the
   [ModelArts console](https://console.huaweicloud.com/modelarts/maas).
3. Generate an [API key](https://support.huaweicloud.com/model-call-maas/model-call-049.html)
   in the Huawei Cloud console.
4. The service is available in the **西南-贵阳一** (cn-southwest-2) region.

<AccordionGroup>
  <Accordion title="Troubleshooting">
    - If models do not appear, confirm `HUAWEI_MAAS_API_KEY` is set in your environment or config.
    - For Token Plan, confirm you have an active subscription before generating the API key.
    - For pay-as-you-go, confirm the endpoint is deployed and the `baseUrl` points to your endpoint's inference URL.
    - When the Gateway runs as a daemon, ensure the key is available to that process (for example in `~/.openclaw/.env` or via `env.shellEnv`).

    <Warning>
    Keys set only in your interactive shell are not visible to daemon-managed gateway processes. Use `~/.openclaw/.env` or `env.shellEnv` config for persistent availability.
    </Warning>

  </Accordion>
</AccordionGroup>

## Further reading

- [Huawei Cloud MaaS Token Plan documentation](https://support.huaweicloud.com/Token-plan-maas/tokenplan-maas-0004.html)
- [Huawei Cloud MaaS API billing documentation](https://support.huaweicloud.com/model-call-maas/maas-modelarts-0908.html)
- [Huawei Cloud MaaS console](https://console.huaweicloud.com/modelarts/maas)

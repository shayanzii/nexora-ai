import type {
  ChatCompletion,
  ChatCompletionChunk,
  ChatCompletionCreateParamsNonStreaming,
  ChatCompletionCreateParamsStreaming,
  ChatCompletionMessageParam,
} from "openai/resources/chat/completions";

import type { LLMRequest } from "../../types/llm-request";
import type {
  LLMFinishReason,
  LLMResponse,
  LLMStreamChunk,
  TokenUsage,
} from "../../types/llm-response";
import { OPENAI_PROVIDER_ID, normalizeOpenAIModelId } from "./OpenAIModels";

export type OpenAIChatCompletionParams =
  | ChatCompletionCreateParamsNonStreaming
  | ChatCompletionCreateParamsStreaming;

/** Maps canonical LLM request options to an OpenAI chat completion payload. */
export function mapLLMRequestToOpenAI(
  request: LLMRequest,
  stream: boolean,
): OpenAIChatCompletionParams {
  const model = normalizeOpenAIModelId(request.model);
  const options = request.options;

  const base = {
    model,
    messages: mapMessagesToOpenAI(request.messages),
    temperature: options?.temperature,
    top_p: options?.topP,
    max_tokens: options?.maxTokens,
    stop: options?.stopSequences ? [...options.stopSequences] : undefined,
    seed: options?.seed,
    response_format:
      options?.responseFormat === "json"
        ? ({ type: "json_object" } as const)
        : undefined,
  };

  if (stream) {
    return {
      ...base,
      stream: true,
    } satisfies ChatCompletionCreateParamsStreaming;
  }

  return base satisfies ChatCompletionCreateParamsNonStreaming;
}

/** Maps an OpenAI chat completion to the canonical LLM response shape. */
export function mapOpenAIResponseToLLM(
  completion: ChatCompletion,
  request: LLMRequest,
): LLMResponse {
  const choice = completion.choices[0];
  const content = choice?.message?.content ?? "";

  return {
    id: completion.id,
    provider: OPENAI_PROVIDER_ID,
    model: completion.model,
    content: typeof content === "string" ? content : "",
    finishReason: mapOpenAIFinishReason(choice?.finish_reason),
    usage: mapOpenAIUsageToTokenUsage(completion.usage),
    metadata: {
      requestId: request.id,
      systemFingerprint: completion.system_fingerprint,
    },
  };
}

/** Maps an OpenAI stream chunk to the canonical stream chunk shape. */
export function mapOpenAIChunkToLLMStreamChunk(
  chunk: ChatCompletionChunk,
  fallbackId: string,
): LLMStreamChunk {
  const choice = chunk.choices[0];
  const delta = choice?.delta?.content ?? "";
  const finishReason = choice?.finish_reason
    ? mapOpenAIFinishReason(choice.finish_reason)
    : undefined;
  const done = choice?.finish_reason != null;

  return {
    id: chunk.id ?? fallbackId,
    delta,
    done,
    finishReason,
    usage: chunk.usage ? mapOpenAIUsageToTokenUsage(chunk.usage) : undefined,
  };
}

function mapMessagesToOpenAI(
  messages: LLMRequest["messages"],
): ChatCompletionMessageParam[] {
  return messages.map((message) => {
    switch (message.role) {
      case "system":
        return { role: "system", content: message.content };
      case "user":
        return { role: "user", content: message.content };
      case "assistant":
        return { role: "assistant", content: message.content };
      case "tool":
        return {
          role: "tool",
          content: message.content,
          tool_call_id: message.toolCallId ?? "unknown",
        };
      default: {
        const exhaustive: never = message.role;
        return exhaustive;
      }
    }
  });
}

function mapOpenAIUsageToTokenUsage(
  usage: ChatCompletion["usage"] | ChatCompletionChunk["usage"],
): TokenUsage {
  return {
    promptTokens: usage?.prompt_tokens ?? 0,
    completionTokens: usage?.completion_tokens ?? 0,
    totalTokens: usage?.total_tokens ?? 0,
  };
}

function mapOpenAIFinishReason(
  reason: ChatCompletion.Choice["finish_reason"] | null | undefined,
): LLMFinishReason {
  switch (reason) {
    case "stop":
      return "stop";
    case "length":
      return "length";
    case "content_filter":
      return "content_filter";
    case "tool_calls":
      return "tool_calls";
    default:
      return "unknown";
  }
}

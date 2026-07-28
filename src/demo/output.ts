/**
 * Pure fallback helpers for /demo/chat. Keep this separate from chat.ts so
 * unit tests can cover semantics without importing worker-only modules.
 */
import type { DemoFrame } from "./frames.ts";
import { hashPrefix, preview } from "../observability.ts";

export type DemoUsage = {
  cacheReadTokens: number | undefined;
  cacheWriteTokens: number | undefined;
  inputTokens: number | undefined;
  outputTokens: number | undefined;
  reasoningTokens: number | undefined;
  totalTokens: number | undefined;
};
export type DemoStopReasonClass =
  | "complete"
  | "budget-exhausted"
  | "missing-final-text"
  | "provider-error"
  | "aborted"
  | "fallback"
  | "other";

export type DemoFinalTextTelemetry = {
  hadFinalText: boolean;
  answerChars: number;
  answerPreview: string | null;
  finalTextChars: number;
  finalPreview: string | null;
  endedWithToolCalls: boolean;
  missingFinalText: boolean;
  finalNeededButMissing: boolean;
  budgetExhausted: boolean;
  stopReasonClass: DemoStopReasonClass;
};
export type DemoInputTelemetry = {
  latestUserHash: string | null;
  latestUserChars: number;
  latestUserPreview: string | null;
  historyMessages: number;
  historyChars: number;
  userMessages: number;
  subjectHash: string;
};
export type DemoProviderErrorTelemetry = {
  providerErrorName: string;
  providerErrorStatus: number | null;
  providerErrorReason: string | null;
  providerErrorProvider: string;
  providerErrorModel: string;
  providerErrorAttempt: number;
  providerErrorMessagePreview: string | null;
};
export type DemoTerminalProviderErrorTelemetry = DemoProviderErrorTelemetry & {
  providerErrorTerminal: boolean;
};

const DEMO_FINAL_PREVIEW_CHARS = 180;
const DEMO_INPUT_PREVIEW_CHARS = 180;
const DEMO_PROVIDER_ERROR_PREVIEW_CHARS = 300;

export function isMeaningfulDemoOutput(frame: DemoFrame): boolean {
  switch (frame.type) {
    case "token":
      return frame.text.length > 0;
    case "tool-start":
    case "tool-result":
      return true;
    default:
      return false;
  }
}

function addOptional(a: number | undefined, b: number | undefined): number | undefined {
  if (a === undefined) return b;
  if (b === undefined) return a;
  return a + b;
}

export function sumDemoUsage(reports: DemoUsage[]): DemoUsage | undefined {
  if (reports.length === 0) return undefined;
  return reports.reduce<DemoUsage>(
    (sum, usage) => ({
      cacheReadTokens: addOptional(sum.cacheReadTokens, usage.cacheReadTokens),
      cacheWriteTokens: addOptional(sum.cacheWriteTokens, usage.cacheWriteTokens),
      inputTokens: addOptional(sum.inputTokens, usage.inputTokens),
      outputTokens: addOptional(sum.outputTokens, usage.outputTokens),
      reasoningTokens: addOptional(sum.reasoningTokens, usage.reasoningTokens),
      totalTokens: addOptional(sum.totalTokens, usage.totalTokens)
    }),
    {
      cacheReadTokens: undefined,
      cacheWriteTokens: undefined,
      inputTokens: undefined,
      outputTokens: undefined,
      reasoningTokens: undefined,
      totalTokens: undefined
    }
  );
}

export function demoFinalTextTelemetry(finalText: string, finishReason: string): DemoFinalTextTelemetry {
  const hadFinalText = finalText.trim().length > 0;
  const answerPreview = hadFinalText ? preview(sanitizeDemoPreviewText(finalText), DEMO_FINAL_PREVIEW_CHARS) : null;
  const endedWithToolCalls = finishReason === "tool-calls";
  const missingFinalText = !hadFinalText;
  const budgetExhausted = endedWithToolCalls || finishReason === "length";
  return {
    hadFinalText,
    answerChars: finalText.length,
    answerPreview,
    finalTextChars: finalText.length,
    finalPreview: answerPreview,
    endedWithToolCalls,
    missingFinalText,
    finalNeededButMissing: missingFinalText && finishReason !== "empty-fallback",
    budgetExhausted,
    stopReasonClass: classifyDemoStopReason(finishReason, hadFinalText)
  };
}

export async function demoInputTelemetry(
  messages: { role: "user" | "assistant"; content: string }[],
  subject: string
): Promise<DemoInputTelemetry> {
  const latestUser = [...messages].reverse().find((message) => message.role === "user")?.content ?? null;
  return {
    latestUserHash: latestUser === null ? null : await hashPrefix(latestUser),
    latestUserChars: latestUser?.length ?? 0,
    latestUserPreview:
      latestUser === null ? null : preview(sanitizeDemoPreviewText(latestUser), DEMO_INPUT_PREVIEW_CHARS),
    historyMessages: messages.length,
    historyChars: messages.reduce((sum, message) => sum + message.content.length, 0),
    userMessages: messages.filter((message) => message.role === "user").length,
    subjectHash: await hashPrefix(subject)
  };
}

export function demoProviderErrorTelemetry(
  error: unknown,
  message: string,
  model: string,
  attempt: number
): DemoProviderErrorTelemetry {
  const errorRecord =
    typeof error === "object" && error !== null
      ? (error as { name?: unknown; reason?: unknown })
      : undefined;
  const name = typeof errorRecord?.name === "string" ? errorRecord.name : typeof error;
  const reason = errorRecord?.reason;
  const sanitizedMessage = sanitizeDemoPreviewText(message);
  return {
    providerErrorName: preview(sanitizeDemoPreviewText(name), 80),
    providerErrorStatus: providerErrorStatus(error),
    providerErrorReason:
      typeof reason === "string" ? preview(sanitizeDemoPreviewText(reason), 80) : null,
    providerErrorProvider: preview(
      sanitizeDemoPreviewText(model.startsWith("@") ? "workers-ai" : (model.split("/", 1)[0] || "unknown")),
      80
    ),
    providerErrorModel: preview(sanitizeDemoPreviewText(model), 160),
    providerErrorAttempt: attempt,
    providerErrorMessagePreview:
      sanitizedMessage.length > 0 ? preview(sanitizedMessage, DEMO_PROVIDER_ERROR_PREVIEW_CHARS) : null
  };
}

export function demoTerminalProviderErrorTelemetry(
  telemetry: DemoProviderErrorTelemetry | undefined,
  stopReasonClass: DemoStopReasonClass,
  hadFinalText: boolean,
  turnAborted: boolean
): DemoTerminalProviderErrorTelemetry | undefined {
  if (!telemetry || (stopReasonClass !== "provider-error" && hadFinalText)) return undefined;
  return {
    ...telemetry,
    providerErrorTerminal: !turnAborted && stopReasonClass !== "aborted"
  };
}

function providerErrorStatus(error: unknown): number | null {
  const seen = new Set<object>();
  let inspected = 0;
  const visit = (current: unknown): number | null => {
    if (typeof current !== "object" || current === null || seen.has(current) || inspected >= 6) {
      return null;
    }
    seen.add(current);
    inspected += 1;
    const record = current as {
      statusCode?: unknown;
      lastError?: unknown;
      errors?: unknown;
      cause?: unknown;
    };
    if (
      typeof record.statusCode === "number" &&
      Number.isInteger(record.statusCode) &&
      record.statusCode >= 100 &&
      record.statusCode <= 599
    ) {
      return record.statusCode;
    }
    for (const nested of Array.isArray(record.errors) ? record.errors.slice(0, 3) : []) {
      const status = visit(nested);
      if (status !== null) return status;
    }
    return visit(record.lastError) ?? visit(record.cause);
  };
  // One retry wrapper, three attempts, and two nested cause wrappers.
  return visit(error);
}

function classifyDemoStopReason(finishReason: string, hadFinalText: boolean): DemoStopReasonClass {
  if (finishReason === "stop") return hadFinalText ? "complete" : "missing-final-text";
  if (finishReason === "tool-calls" || finishReason === "length") return "budget-exhausted";
  if (finishReason === "abort") return "aborted";
  if (finishReason === "error" || finishReason === "exception") return "provider-error";
  if (finishReason === "empty-fallback") return "fallback";
  return hadFinalText ? "complete" : "other";
}

function sanitizeDemoPreviewText(text: string): string {
  return text
    .replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, "[redacted-email]")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[redacted-ip]")
    .replace(
      /\b(authorization)\s*[:=]\s*(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}\b/gi,
      "$1: $2 [redacted-secret]"
    )
    .replace(/\b(authorization)\s*[:=]\s*(?!(?:Bearer|Basic)\b)["']?[^"'\s,;]{4,}/gi, "$1=[redacted-secret]")
    .replace(/\b(?:Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}\b/gi, (match) => {
      const [scheme] = match.split(/\s+/, 1);
      return `${scheme} [redacted-secret]`;
    })
    .replace(/\bS[A-Z2-7]{55}\b/g, "[redacted-stellar-secret]")
    .replace(/\b(?:sk|pk|rk|xox[baprs]|gh[pousr]|glpat|AKIA)[A-Za-z0-9_=-]{8,}\b/g, "[redacted-secret]")
    .replace(
      /\b(secret|token|api[_-]?key|password|cookie)\s*[:=]\s*["']?[^"'\s,;]{4,}/gi,
      "$1=[redacted-secret]"
    )
    .replace(/\s+/g, " ")
    .trim();
}

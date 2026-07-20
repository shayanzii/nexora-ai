import { EXPECTED_RESPONSE_TIME } from "@/lib/contact/response-time";

type ExpectedResponseTimeProps = {
  className?: string;
  variant?: "inline" | "card";
};

export function ExpectedResponseTime({
  className = "",
  variant = "inline",
}: ExpectedResponseTimeProps) {
  if (variant === "card") {
    return (
      <p
        className={`nexora-surface inline-flex flex-wrap items-center gap-x-2 rounded-2xl px-4 py-3 text-sm ${className}`}
      >
        <span className="text-nexora-muted">Expected response time:</span>
        <span className="font-medium text-nexora-text">{EXPECTED_RESPONSE_TIME}</span>
      </p>
    );
  }

  return (
    <p className={`text-sm text-nexora-muted ${className}`}>
      <span className="text-nexora-muted">Expected response time:</span>{" "}
      <span className="font-medium text-nexora-text">{EXPECTED_RESPONSE_TIME}</span>
    </p>
  );
}

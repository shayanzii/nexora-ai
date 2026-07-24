import { NextResponse } from "next/server";

import { processBrainRequest } from "@/src/brain/services/brain-service";

export const runtime = "nodejs";

function jsonError(message: string, status: number, details?: string[]) {
  return NextResponse.json(
    { success: false, error: message, details },
    { status },
  );
}

export async function POST(request: Request) {
  try {
    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400);
    }

    const result = await processBrainRequest(body);

    const executionFailed = Boolean(result.execution && result.execution.status === "failed");
    const proposalFailed = Boolean(
      typeof body === "object" &&
        body !== null &&
        (body as Record<string, unknown>).includeProposal === true &&
        !result.proposal,
    );
    const strategicFailed = Boolean(
      typeof body === "object" &&
        body !== null &&
        (body as Record<string, unknown>).includeStrategicAnalysis === true &&
        !result.strategicAnalysis,
    );

    if (!result.success || !result.plan) {
      return jsonError(
        executionFailed
          ? "Plan created but execution failed."
          : proposalFailed
            ? "Plan created but proposal generation failed."
            : strategicFailed
              ? "Plan created but strategic analysis failed."
              : "Failed to generate execution plan.",
        executionFailed || proposalFailed || strategicFailed ? 422 : 400,
        result.errors,
      );
    }

    return NextResponse.json({
      success: true,
      plan: result.plan,
      ...(result.execution ? { execution: result.execution } : {}),
      ...(result.proposal ? { proposal: result.proposal } : {}),
      ...(result.strategicAnalysis ? { strategicAnalysis: result.strategicAnalysis } : {}),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error.";
    return jsonError(message, 500);
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    service: "Nexora Brain",
    version: "0.3.0",
    description: "Multi-agent orchestration engine for project planning, execution, and proposals.",
    usage: {
      method: "POST",
      body: {
        industry: "HVAC",
        goal: "Generate leads",
        budget: 3000,
        services: ["website", "chatbot"],
        execute: false,
        includeProposal: true,
        includeStrategicAnalysis: false,
      },
      notes: {
        execute:
          "Optional boolean. When true, runs the runtime engine after planning and includes execution in the response.",
        includeProposal:
          "Optional boolean. When true, runs the Sales Department proposal engine and includes a structured Proposal object.",
        includeStrategicAnalysis:
          "Optional boolean. When true, runs the Strategic Reasoner and includes strategicAnalysis in the response.",
      },
    },
  });
}

import { NextResponse } from "next/server";
import { sendLeadNotificationEmails } from "@/lib/email/send-lead-emails";
import { leadFormToInsert, leadRowToSubmission } from "@/lib/leads/map-lead";
import type { LeadFormData } from "@/lib/leads/types";
import { hasLeadFormErrors, validateLeadForm } from "@/lib/leads/validation";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { LeadInsert } from "@/lib/supabase/database.types";

export const runtime = "nodejs";

type LeadRequestBody = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  budget?: unknown;
  projectDescription?: unknown;
};

type SupabaseErrorShape = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

function getEnvDiagnostics() {
  return {
    hasSupabaseUrl: Boolean(getSupabaseUrl()),
    hasServiceRoleKey: Boolean(getSupabaseServiceRoleKey()),
  };
}

function logLeadFailure(
  reason: string,
  context: Record<string, unknown> = {},
) {
  console.error("[/api/leads]", reason, {
    ...getEnvDiagnostics(),
    ...context,
  });
}

function jsonError(
  message: string,
  status: number,
  extra: Record<string, unknown> = {},
) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

function parseLeadBody(body: LeadRequestBody): LeadFormData {
  return {
    fullName: typeof body.fullName === "string" ? body.fullName : "",
    email: typeof body.email === "string" ? body.email : "",
    company: typeof body.company === "string" ? body.company : "",
    budget: typeof body.budget === "string" ? body.budget : "",
    projectDescription:
      typeof body.projectDescription === "string" ? body.projectDescription : "",
  };
}

function logSupabaseInsertFailure(
  error: SupabaseErrorShape,
  insertPayload: LeadInsert,
) {
  logLeadFailure("Supabase insert failed", {
    message: error.message,
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
    insertPayload,
  });
}

export async function POST(request: Request) {
  const env = getEnvDiagnostics();
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    logLeadFailure("Supabase client not configured", env);
    return jsonError(
      "Lead storage is not configured. Set Supabase environment variables.",
      503,
      env,
    );
  }

  let body: LeadRequestBody;

  try {
    body = await request.json();
  } catch (parseError) {
    logLeadFailure("Invalid JSON body", {
      ...env,
      parseError:
        parseError instanceof Error ? parseError.message : String(parseError),
    });
    return jsonError("Invalid JSON body.", 400);
  }

  const formData = parseLeadBody(body);
  const errors = validateLeadForm(formData);

  if (hasLeadFormErrors(errors)) {
    logLeadFailure("Validation failed", { ...env, errors, formData });
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
  }

  const insertPayload = leadFormToInsert(formData);

  const { data, error } = await supabase
    .from("leads")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    logSupabaseInsertFailure(error, insertPayload);

    if (error.code === "42P01") {
      return jsonError(
        error.message,
        503,
        {
          code: error.code,
          details: error.details ?? null,
          hint: error.hint ?? null,
        },
      );
    }

    return jsonError(error.message, 502, {
      code: error.code ?? null,
      details: error.details ?? null,
      hint: error.hint ?? null,
    });
  }

  const submission = leadRowToSubmission(data);

  try {
    await sendLeadNotificationEmails({
      id: submission.id,
      fullName: submission.fullName,
      email: submission.email,
      company: submission.company,
      budget: submission.budget,
      projectDescription: submission.projectDescription,
      submittedAt: submission.submittedAt,
    });
  } catch (emailError) {
    logLeadFailure("Lead notification emails failed unexpectedly", {
      leadId: submission.id,
      emailError:
        emailError instanceof Error ? emailError.message : String(emailError),
    });
  }

  return NextResponse.json({ lead: submission }, { status: 201 });
}

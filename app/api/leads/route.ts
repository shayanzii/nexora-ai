import { NextResponse } from "next/server";
import { leadFormToInsert, leadRowToSubmission } from "@/lib/leads/map-lead";
import type { LeadFormData } from "@/lib/leads/types";
import { hasLeadFormErrors, validateLeadForm } from "@/lib/leads/validation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabaseServiceRoleKey, getSupabaseUrl } from "@/lib/supabase/env";

export const runtime = "nodejs";

type LeadRequestBody = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  budget?: unknown;
  projectDescription?: unknown;
};

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
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

export async function POST(request: Request) {
  const supabase = createSupabaseServerClient();

  if (!supabase) {
    return jsonError(
      "Lead storage is not configured. Set Supabase environment variables.",
      503,
    );
  }

  let body: LeadRequestBody;

  try {
    body = await request.json();
  } catch {
    return jsonError("Invalid JSON body.", 400);
  }

  const formData = parseLeadBody(body);
  const errors = validateLeadForm(formData);

  if (hasLeadFormErrors(errors)) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
  }

  const insertPayload = leadFormToInsert(formData);

  const { data, error } = await supabase
    .from("leads")
    .insert(insertPayload)
    .select("*")
    .single();

  if (error) {
    console.error("[/api/leads] Supabase insert failed", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
      insertPayload,
      supabaseUrl: getSupabaseUrl(),
      hasServiceRoleKey: Boolean(getSupabaseServiceRoleKey()),
    });

    if (error.code === "42P01") {
      return jsonError(
        "Leads table not found. Run the Supabase migration in supabase/migrations.",
        503,
      );
    }

    return jsonError(error.message, 502);
  }

  return NextResponse.json(
    { lead: leadRowToSubmission(data) },
    { status: 201 },
  );
}

import { NextResponse } from "next/server";
import { isLeadStatus } from "@/lib/admin/lead-status";
import { requireAdminAuth } from "@/lib/admin/require-admin-auth";
import {
  hasLeadFormErrors,
  validateAdminLeadUpdate,
  validateLeadStatusUpdate,
} from "@/lib/admin/validate-admin-lead";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

type LeadPatchBody = {
  fullName?: unknown;
  email?: unknown;
  company?: unknown;
  budget?: unknown;
  projectDescription?: unknown;
  status?: unknown;
};

function isStatusOnlyPatch(body: LeadPatchBody): boolean {
  return (
    body.status !== undefined &&
    body.fullName === undefined &&
    body.email === undefined &&
    body.company === undefined &&
    body.budget === undefined &&
    body.projectDescription === undefined
  );
}

function parseLeadPatchBody(body: LeadPatchBody) {
  return {
    fullName: typeof body.fullName === "string" ? body.fullName : "",
    email: typeof body.email === "string" ? body.email : "",
    company: typeof body.company === "string" ? body.company : "",
    budget: typeof body.budget === "string" ? body.budget : "",
    projectDescription:
      typeof body.projectDescription === "string" ? body.projectDescription : "",
    status: typeof body.status === "string" ? body.status : "",
  };
}

export async function PATCH(request: Request, context: RouteContext) {
  const auth = await requireAdminAuth();
  if (!("user" in auth)) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;

  let body: LeadPatchBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (isStatusOnlyPatch(body)) {
    const statusError = validateLeadStatusUpdate(body.status);
    if (statusError) {
      return NextResponse.json({ error: statusError }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("leads")
      .update({ status: body.status as string })
      .eq("id", id)
      .select("id, status")
      .maybeSingle();

    if (error) {
      console.error("[PATCH /api/admin/leads/:id] status update failed", error);
      return NextResponse.json({ error: error.message }, { status: 502 });
    }

    if (!data) {
      return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    }

    return NextResponse.json({ lead: data });
  }

  const formData = parseLeadPatchBody(body);
  const errors = validateAdminLeadUpdate(formData);

  if (hasLeadFormErrors(errors)) {
    return NextResponse.json({ error: "Validation failed.", errors }, { status: 400 });
  }

  const nextStatus = formData.status ? formData.status : undefined;
  if (nextStatus && !isLeadStatus(nextStatus)) {
    return NextResponse.json({ error: "Invalid lead status." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      company: formData.company.trim() || null,
      budget: formData.budget.trim() || null,
      project_description: formData.projectDescription.trim(),
      ...(nextStatus ? { status: nextStatus } : {}),
    })
    .eq("id", id)
    .select("id, full_name, email, company, budget, status, project_description, created_at")
    .maybeSingle();

  if (error) {
    console.error("[PATCH /api/admin/leads/:id] update failed", error);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  if (!data) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ lead: data });
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdminAuth();
  if (!("user" in auth)) {
    return NextResponse.json({ error: auth.message }, { status: auth.status });
  }

  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const { id } = await context.params;

  const { data, error } = await supabase
    .from("leads")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("[DELETE /api/admin/leads/:id] delete failed", error);
    return NextResponse.json({ error: error.message }, { status: 502 });
  }

  if (!data) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}

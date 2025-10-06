import { NextResponse } from "next/server";
import { createRouteClient } from "@/lib/supabaseServer";

function getToken(req: Request) {
  const authHeader = req.headers.get("authorization");
  return authHeader?.replace("Bearer ", "");
}

async function getUserFromRequest(req: Request) {
  const supabase = createRouteClient(getToken(req));
  const { data: { user }, error } = await supabase.auth.getUser();
  return { supabase, user, error };
}

export async function GET(req: Request) {
  const { supabase, user, error } = await getUserFromRequest(req);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error: err } = await supabase
    .from("brand_guides")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ guide: data });
}

export async function POST(req: Request) {
  const { supabase, user, error } = await getUserFromRequest(req);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error: err } = await supabase
    .from("brand_guides")
    .insert([{ ...body, user_id: user.id }])
    .select()
    .single();

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ guide: data });
}

export async function PATCH(req: Request) {
  const { supabase, user, error } = await getUserFromRequest(req);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { data, error: err } = await supabase
    .from("brand_guides")
    .update(body)
    .eq("user_id", user.id)
    .select()
    .single();

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ guide: data });
}

export async function DELETE(req: Request) {
  const { supabase, user, error } = await getUserFromRequest(req);
  if (error || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error: err } = await supabase
    .from("brand_guides")
    .delete()
    .eq("user_id", user.id);

  if (err) return NextResponse.json({ error: err.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

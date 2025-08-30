// app/api/brand/profile/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("user_id");

    if (!userId) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Get brand profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("brand_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    // Get brand guide linked to this profile
    const { data: guide, error: guideError } = await supabaseAdmin
      .from("brand_guides")
      .select("*")
      .eq("profile_id", profile.id)
      .maybeSingle();

    if (guideError) {
      return NextResponse.json({ error: guideError.message }, { status: 500 });
    }

    return NextResponse.json({
      profile,
      guide,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

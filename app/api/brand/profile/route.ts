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

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { user_id, profile_updates, guide_updates } = body;

    if (!user_id) {
      return NextResponse.json({ error: "Missing user_id" }, { status: 400 });
    }

    // Update profile
    let updatedProfile = null;
    if (profile_updates) {
      const { data, error } = await supabaseAdmin
        .from("brand_profiles")
        .update(profile_updates)
        .eq("user_id", user_id)
        .select()
        .single();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      updatedProfile = data;
    }

    // Update guide
    let updatedGuide = null;
    if (guide_updates && updatedProfile) {
      const { data, error } = await supabaseAdmin
        .from("brand_guides")
        .update(guide_updates)
        .eq("profile_id", updatedProfile.id)
        .select()
        .maybeSingle();

      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      updatedGuide = data;
    }

    return NextResponse.json({
      ok: true,
      profile: updatedProfile,
      guide: updatedGuide,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

// app/api/brand/wizard/route.ts
import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // body must include user_id (from client after auth), display_name, mission, etc.
    const insert = {
      user_id: body.user_id,
      display_name: body.display_name,
      bio: body.bio ?? null,
      tone: body.tone ?? null,
      mission: body.mission ?? null,
      vision: body.vision ?? null,
      values_json: body.values ?? {},
      colors: body.colors ?? {},
      fonts: body.fonts ?? {},
      positioning: body.positioning ?? null,
      tagline: body.tagline ?? null
    };

    const { data, error } = await supabaseAdmin.from('brand_profiles').insert([insert]).select().single();

    if (error) return NextResponse.json({ error }, { status: 500 });
    // optionally create a brand_guide row
    await supabaseAdmin.from('brand_guides').insert([{ user_id: insert.user_id, profile_id: data.id, html: body.html ?? null }]);
    return NextResponse.json({ ok: true, profile: data });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const API_BASE = "http://localhost:3000/api"; // your Next.js API

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function callApi(
  endpoint: string,
  method: string,
  token: string,
  body?: any
) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json();
  console.log(`${method} ${endpoint} →`, json);
  return json;
}

async function main() {
  // 1. Login test user
  const { data, error } = await supabase.auth.signInWithPassword({
    email: "test@example.com", // 👈 change to your test user
    password: "password123",   // 👈 change to your test user
  });

  if (error || !data.session) {
    console.error("❌ Login failed:", error?.message);
    return;
  }

  const token = data.session.access_token;
  console.log("✅ Logged in as:", data.user.email);

  // ==== brand_profiles CRUD ====
  console.log("\n--- Testing brand_profiles ---");
  await callApi("/brand/profile", "POST", token, {
    display_name: "My Test Brand",
    mission: "Make fun games",
  });

  await callApi("/brand/profile", "GET", token);

  await callApi("/brand/profile", "PATCH", token, {
    tagline_or_slogan: "Play. Laugh. Repeat.",
  });

  await callApi("/brand/profile", "DELETE", token);

  // ==== brand_guides CRUD ====
  console.log("\n--- Testing brand_guides ---");
  await callApi("/brand/wizard", "POST", token, {
    html: "<h1>Brand Guide</h1><p>Fun content</p>",
  });

  await callApi("/brand/wizard", "GET", token);

  await callApi("/brand/wizard", "PATCH", token, {
    html: "<h1>Updated Guide</h1><p>Even more fun</p>",
  });

  await callApi("/brand/wizard", "DELETE", token);
}

main();

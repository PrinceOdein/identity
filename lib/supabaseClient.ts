// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !anon) throw new Error('Missing SUPABASE env vars');

export const supabase = createClient(url, anon);

export const supabaseBrowser = createBrowserClient(url, anon);

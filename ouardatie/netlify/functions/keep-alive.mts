import type { Config } from "@netlify/functions";
import { createClient } from "@supabase/supabase-js";

async function sendSupabaseHeartbeat(): Promise<{ success: boolean; error?: string }> {
  const supabaseUrl = Netlify.env.get("VITE_SUPABASE_URL");
  const supabaseAnonKey = Netlify.env.get("VITE_SUPABASE_ANON_KEY");

  if (!supabaseUrl || !supabaseAnonKey) {
    return { success: false, error: "Missing Supabase environment variables" };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { error } = await supabase.rpc("heartbeat");

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export default async (req: Request) => {
  const { next_run } = await req.json();
  const timestamp = new Date().toISOString();

  console.log(`Keep-alive ping executed at ${timestamp}`);
  console.log(`Next scheduled run: ${next_run}`);

  // Send heartbeat to Supabase to prevent database auto-pause
  const heartbeatResult = await sendSupabaseHeartbeat();

  if (heartbeatResult.success) {
    console.log("Supabase heartbeat sent successfully");
  } else {
    console.error(`Supabase heartbeat failed: ${heartbeatResult.error}`);
  }

  return new Response(
    JSON.stringify({
      status: "ok",
      timestamp,
      supabaseHeartbeat: heartbeatResult,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
};

export const config: Config = {
  // Run every 5 minutes to keep functions warm and Supabase active
  schedule: "*/5 * * * *",
};

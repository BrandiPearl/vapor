/**
 * Create an admin user in Supabase Auth.
 *
 * Usage:
 *   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='strong-password' npm run admin:create
 */
import { config } from "dotenv";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

config({ path: resolve(process.cwd(), ".env.local") });

async function main() {
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!email || !password) {
    throw new Error("Set ADMIN_EMAIL and ADMIN_PASSWORD in the environment");
  }
  if (!url || !key) {
    throw new Error("Missing Supabase URL / service role key");
  }
  if (password.length < 8) {
    throw new Error("ADMIN_PASSWORD must be at least 8 characters");
  }

  const supabase = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (error) {
    if (error.message.toLowerCase().includes("already")) {
      console.log(`User already exists: ${email}`);
      console.log("You can sign in at /admin/login");
      return;
    }
    throw error;
  }

  console.log(`Created admin user: ${data.user?.email}`);
  console.log("Sign in at http://localhost:3000/admin/login");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

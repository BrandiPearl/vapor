"use client";

import { useState } from "react";

export default function AccountPage() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <div className="container-site max-w-lg py-14">
      <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight text-brand">
        My account
      </h1>
      <div className="mt-6 flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setMode("login")}
          className={`px-4 py-2 text-sm font-semibold ${
            mode === "login"
              ? "border-b-2 border-accent text-brand"
              : "text-muted"
          }`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => setMode("register")}
          className={`px-4 py-2 text-sm font-semibold ${
            mode === "register"
              ? "border-b-2 border-accent text-brand"
              : "text-muted"
          }`}
        >
          Register
        </button>
      </div>

      <form
        className="mt-8 space-y-4 border border-border bg-surface p-6"
        onSubmit={(e) => e.preventDefault()}
      >
        {mode === "register" && (
          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Full name</span>
            <input
              required
              className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
            />
          </label>
        )}
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Email address</span>
          <input
            required
            type="email"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Password</span>
          <input
            required
            type="password"
            className="w-full rounded-md border border-border bg-background px-3 py-2.5 outline-none focus:border-accent"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded-md bg-brand px-4 py-3 text-sm font-bold uppercase tracking-wider text-white transition hover:bg-brand-soft"
        >
          {mode === "login" ? "Log in" : "Create account"}
        </button>
        <p className="text-center text-xs text-muted">
          Account auth will connect to Supabase in the next phase.
        </p>
      </form>
    </div>
  );
}

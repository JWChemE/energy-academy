"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/auth-context";
import { supabase } from "@/lib/supabase";
import { INDUSTRIES, JOB_ROLES, TOPICS, COMMS_STREAMS, type CommsKey } from "@/lib/profileOptions";
import { availableCourses } from "@/lib/curriculumClient";

export default function ProfilePage() {
  const { user, session, loading, signOut, refreshUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/auth");
  }, [loading, user, router]);

  if (loading || !user) {
    return <div className="mx-auto max-w-3xl px-4 py-16 text-center text-slate-500">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Your profile</h1>
        <p className="mt-1 text-sm text-slate-500">{user.email}</p>
      </div>

      <DetailsSection />
      <CommsSection />
      <PasswordSection />
      <ProgressSection />
      <DangerSection />

      <button
        onClick={async () => {
          await signOut();
          router.push("/");
        }}
        className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        Sign out
      </button>
    </div>
  );

  // ---- Your details (name + segmentation) ----
  function DetailsSection() {
    const [name, setName] = useState(user!.full_name ?? "");
    const [industry, setIndustry] = useState(user!.industry ?? "");
    const [jobRole, setJobRole] = useState(user!.job_role ?? "");
    const [interests, setInterests] = useState<string[]>(user!.interests ?? []);
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    function toggleTopic(t: string) {
      setInterests((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
      setStatus("idle");
    }

    async function save() {
      setStatus("saving");
      const { error } = await supabase.rpc("update_my_profile", {
        p_full_name: name,
        p_industry: industry,
        p_job_role: jobRole,
        p_interests: interests,
      });
      if (error) {
        setStatus("error");
        return;
      }
      await refreshUser();
      setStatus("saved");
    }

    return (
      <Card title="Your details" hint="We use the optional fields below to send you more relevant content — only if you've opted in. They're never required.">
        <Field label="Name">
          <input
            value={name}
            onChange={(e) => { setName(e.target.value); setStatus("idle"); }}
            className="input"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Industry / sector (optional)">
            <select value={industry} onChange={(e) => { setIndustry(e.target.value); setStatus("idle"); }} className="input">
              <option value="">Prefer not to say</option>
              {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </Field>
          <Field label="Job role (optional)">
            <select value={jobRole} onChange={(e) => { setJobRole(e.target.value); setStatus("idle"); }} className="input">
              <option value="">Prefer not to say</option>
              {JOB_ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Topics you're interested in (optional)">
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const on = interests.includes(t);
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => toggleTopic(t)}
                  className={`rounded-full border px-3 py-1 text-sm transition ${
                    on ? "border-brand-400 bg-brand-50 text-brand-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {on ? "✓ " : ""}{t}
                </button>
              );
            })}
          </div>
        </Field>
        <SaveRow status={status} onSave={save} />
      </Card>
    );
  }

  // ---- Communication preferences ----
  function CommsSection() {
    const [prefs, setPrefs] = useState<Record<CommsKey, boolean>>({
      comms_updates: !!user!.comms_updates,
      comms_newsletter: !!user!.comms_newsletter,
      comms_consulting: !!user!.comms_consulting,
      comms_events: !!user!.comms_events,
    });
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

    async function save() {
      setStatus("saving");
      const { error } = await supabase.rpc("update_my_comms", {
        p_updates: prefs.comms_updates,
        p_newsletter: prefs.comms_newsletter,
        p_consulting: prefs.comms_consulting,
        p_events: prefs.comms_events,
        p_source: "profile",
      });
      if (error) { setStatus("error"); return; }
      await refreshUser();
      setStatus("saved");
    }

    return (
      <Card
        title="Email preferences"
        hint="Choose what you'd like to hear about. We only email you with your consent, and you can change or stop any of these at any time."
      >
        <div className="divide-y divide-slate-100">
          {COMMS_STREAMS.map((s) => (
            <label key={s.key} className="flex cursor-pointer items-start justify-between gap-4 py-3">
              <span>
                <span className="block text-sm font-medium text-slate-800">{s.label}</span>
                <span className="block text-xs text-slate-500">{s.description}</span>
              </span>
              <Toggle
                checked={prefs[s.key]}
                onChange={(v) => { setPrefs((p) => ({ ...p, [s.key]: v })); setStatus("idle"); }}
              />
            </label>
          ))}
        </div>
        <SaveRow status={status} onSave={save} label="Save preferences" />
      </Card>
    );
  }

  // ---- Change password ----
  function PasswordSection() {
    const [pw, setPw] = useState("");
    const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
    const [msg, setMsg] = useState("");

    async function save() {
      if (pw.length < 8) { setStatus("error"); setMsg("Use at least 8 characters."); return; }
      setStatus("saving");
      const { error } = await supabase.auth.updateUser({ password: pw });
      if (error) { setStatus("error"); setMsg(error.message); return; }
      setPw("");
      setStatus("saved");
      setMsg("");
    }

    return (
      <Card title="Change password">
        <Field label="New password">
          <input type="password" value={pw} onChange={(e) => { setPw(e.target.value); setStatus("idle"); }} className="input" placeholder="At least 8 characters" />
        </Field>
        {status === "error" && msg && <p className="text-sm text-red-600">{msg}</p>}
        <SaveRow status={status} onSave={save} label="Update password" savedLabel="Password updated" />
      </Card>
    );
  }

  // ---- Reset progress ----
  function ProgressSection() {
    const courses = availableCourses();
    const [scope, setScope] = useState("all");
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [done, setDone] = useState(false);

    async function reset() {
      setBusy(true);
      const { error } = await supabase.rpc("reset_my_progress", {
        p_course_slug: scope === "all" ? null : scope,
      });
      setBusy(false);
      setConfirming(false);
      if (!error) setDone(true);
    }

    return (
      <Card title="Reset progress" hint="Clear your completions and quiz results so you can start fresh. This can't be undone.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <Field label="Which?">
            <select value={scope} onChange={(e) => { setScope(e.target.value); setDone(false); }} className="input">
              <option value="all">All courses</option>
              {courses.map(({ course }) => (
                <option key={course.slug} value={course.slug}>{course.title}</option>
              ))}
            </select>
          </Field>
          {confirming ? (
            <div className="flex gap-2">
              <button onClick={reset} disabled={busy} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {busy ? "Resetting…" : "Yes, reset"}
              </button>
              <button onClick={() => setConfirming(false)} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => { setConfirming(true); setDone(false); }} className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Reset
            </button>
          )}
        </div>
        {done && <p className="mt-2 text-sm text-emerald-700">Progress reset.</p>}
      </Card>
    );
  }

  // ---- Delete account ----
  function DangerSection() {
    const [confirming, setConfirming] = useState(false);
    const [busy, setBusy] = useState(false);
    const [err, setErr] = useState("");

    async function del() {
      if (!session?.access_token) return;
      setBusy(true);
      setErr("");
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (!res.ok) {
        setBusy(false);
        setErr("Couldn't delete your account. Please try again or contact us.");
        return;
      }
      await signOut();
      router.push("/");
    }

    return (
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-5">
        <h2 className="text-sm font-bold text-red-800">Delete account</h2>
        <p className="mt-1 text-sm text-slate-600">
          Permanently delete your account and all your data (profile, progress, quiz results and
          communication preferences). This cannot be undone.
        </p>
        {err && <p className="mt-2 text-sm text-red-600">{err}</p>}
        <div className="mt-3">
          {confirming ? (
            <div className="flex flex-wrap gap-2">
              <button onClick={del} disabled={busy} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                {busy ? "Deleting…" : "Permanently delete my account"}
              </button>
              <button onClick={() => setConfirming(false)} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
                Cancel
              </button>
            </div>
          ) : (
            <button onClick={() => setConfirming(true)} className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50">
              Delete my account
            </button>
          )}
        </div>
      </div>
    );
  }
}

// ---- small presentational helpers ----

function Card({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="text-base font-bold text-slate-900">{title}</h2>
      {hint && <p className="mt-1 text-sm text-slate-500">{hint}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      role="switch"
      aria-checked={checked}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${checked ? "bg-brand-600" : "bg-slate-300"}`}
    >
      <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
    </button>
  );
}

function SaveRow({
  status,
  onSave,
  label = "Save changes",
  savedLabel = "Saved",
}: {
  status: "idle" | "saving" | "saved" | "error";
  onSave: () => void;
  label?: string;
  savedLabel?: string;
}) {
  return (
    <div className="flex items-center gap-3 pt-1">
      <button
        onClick={onSave}
        disabled={status === "saving"}
        className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        {status === "saving" ? "Saving…" : label}
      </button>
      {status === "saved" && <span className="text-sm text-emerald-700">✓ {savedLabel}</span>}
      {status === "error" && <span className="text-sm text-red-600">Something went wrong.</span>}
    </div>
  );
}

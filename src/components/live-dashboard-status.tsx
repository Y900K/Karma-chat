"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { DatabaseZap, RefreshCw } from "lucide-react";
import styles from "./live-dashboard-status.module.css";

export type DashboardScope = "learner" | "institute" | "employer" | "government" | "admin";

type DashboardPayload = {
  source: "live" | "demo";
  scope: DashboardScope;
  refreshedAt: string;
  data: { metrics?: Record<string, number | string | null>; identity?: { displayName?: string }; organization?: { name?: string } | null };
};

const labels: Record<string, string> = {
  readiness: "Readiness",
  completedLessons: "Lessons completed",
  verifiedEvidence: "Verified evidence",
  pendingEvidence: "Evidence pending",
  applications: "Applications",
  unreadNotifications: "Unread alerts",
  cohorts: "Active cohorts",
  learners: "Learners in snapshots",
  openSupportActions: "Support actions",
  openRoles: "Published roles",
  vacancies: "Declared openings",
  offers: "Offer / hired",
  snapshots: "Metric snapshots",
  openCases: "Open cases",
  criticalCases: "Critical cases",
  approvedModels: "Approved models",
  publishedResources: "Approved resources",
  brokenResources: "Broken resources",
  reviewsDue: "Reviews due",
  partnerCasesOpen: "Partner checks",
  enabledFlags: "Enabled flags",
  productionPrompts: "Production prompts",
};

export default function LiveDashboardStatus({ scope }: { scope: DashboardScope }) {
  const [payload, setPayload] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/dashboard?scope=${scope}`, { cache: "no-store" });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Live data could not be loaded");
      setPayload(body);
      setError("");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Live data could not be loaded");
    } finally {
      setLoading(false);
    }
  }, [scope]);

  useEffect(() => {
    const initial = window.setTimeout(() => void load(), 0);
    const timer = window.setInterval(() => void load(), 30_000);
    const onVisible = () => document.visibilityState === "visible" && void load();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.clearTimeout(initial);
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  const metrics = useMemo(() => Object.entries(payload?.data.metrics ?? {}), [payload]);
  const name = payload?.data.identity?.displayName ?? payload?.data.organization?.name ?? `${scope[0].toUpperCase()}${scope.slice(1)} workspace`;

  return (
    <section className={styles.panel} aria-live="polite" aria-label="Live dashboard data status">
      {loading && !payload ? (
        <div className={styles.skeleton} aria-label="Loading live dashboard data" />
      ) : (
        <>
          <div className={styles.head}>
            <div className={styles.identity}>
              <span className={styles.icon}><DatabaseZap size={18} /></span>
              <div><b>{name}</b><span>Role-scoped data from the current authenticated account</span></div>
            </div>
            <div className={styles.actions}>
              <span className={`${styles.badge} ${error ? styles.error : payload?.source === "demo" ? styles.demo : ""}`}>
                <i className={styles.dot} />{error ? "Unavailable" : payload?.source === "demo" ? "Local demo" : "Live Supabase"}
              </span>
              <button className={styles.refresh} onClick={() => void load()} disabled={loading} aria-label="Refresh live dashboard data">
                <RefreshCw size={17} className={loading ? "spin" : ""} />
              </button>
            </div>
          </div>
          {error ? <p className={styles.notice}>{error}. Operational values are hidden until the live source recovers.</p> : null}
          {!error && metrics.length ? <div className={styles.metrics}>{metrics.map(([key, value]) => <div className={styles.metric} key={key}><b>{value ?? "—"}{key === "readiness" && value !== null ? "/100" : ""}</b><span>{labels[key] ?? key}</span></div>)}</div> : null}
          {!error && !metrics.length ? <p className={styles.empty}>No verified operational records are available for this workspace yet.</p> : null}
          <p className={styles.notice}>{payload?.refreshedAt ? `Refreshed ${new Date(payload.refreshedAt).toLocaleTimeString()}. ` : ""}Only role-authorized live records are shown during the external pilot.</p>
        </>
      )}
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Search } from "lucide-react";
import "./workspace-utilities.css";

export function WorkspaceSearch({
  placeholder,
  targets,
}: {
  placeholder: string;
  targets: Record<string, string>;
}) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const suggestions = value.trim()
    ? Object.entries(targets)
        .filter(([keywords]) =>
          keywords
            .split("|")
            .some(
              (keyword) =>
                keyword.includes(value.trim().toLowerCase()) ||
                value.trim().toLowerCase().includes(keyword),
            ),
        )
        .filter((entry, index, all) =>
          all.findIndex((candidate) => candidate[1] === entry[1]) === index,
        )
        .slice(0, 4)
    : [];
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const query = value.trim().toLowerCase();
    const match = Object.entries(targets).find(([keywords]) =>
      keywords.split("|").some((keyword) => query.includes(keyword)),
    );
    const target = document.getElementById(
      match?.[1] ?? Object.values(targets)[0],
    );
    if (!target) return;
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    router.push(`${window.location.pathname}${window.location.search}#${target.id}`);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  };
  return (
    <form className="workspace-search-form" onSubmit={submit}>
      <label>
        <Search />
        <input
          aria-label="Workspace search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
        />
      </label>
      {value.trim() ? (
        <div className="workspace-search-results" aria-live="polite">
          {suggestions.length ? suggestions.map(([keywords, target]) => (
            <a href={`#${target}`} key={target} onClick={() => setValue("")}>
              Open {keywords.split("|")[0]} section
            </a>
          )) : <span>No matching workspace section. Try a role, learner, job, evidence or report keyword.</span>}
        </div>
      ) : null}
      <button className="workspace-search-submit" type="submit">
        Search workspace
      </button>
    </form>
  );
}

export function useWorkspaceLanguage() {
  const [lang, setLang] = useState<"en" | "hi">("en");
  useEffect(() => {
    void fetch("/api/preferences", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : null))
      .then((body) => {
        if (body?.language === "hi" || body?.language === "en")
          setLang(body.language);
      })
      .catch(() => undefined);
  }, []);
  const toggleLanguage = () => {
    const previous = lang,
      next = lang === "en" ? "hi" : "en";
    setLang(next);
    document.documentElement.lang = next;
    void fetch("/api/preferences", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ language: next }),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Preference could not be saved");
      })
      .catch(() => {
        setLang(previous);
        document.documentElement.lang = previous;
      });
  };
  return { lang, toggleLanguage };
}

export function WorkspaceHeaderLink({
  href,
  label,
  children,
  className = "",
}: {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      className={`workspace-header-link ${className}`}
      href={href}
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export function WorkspaceSignOut() {
  return (
    <form className="workspace-signout" action="/auth/signout" method="post">
      <button type="submit">
        <LogOut />
        <span>Sign out</span>
      </button>
    </form>
  );
}

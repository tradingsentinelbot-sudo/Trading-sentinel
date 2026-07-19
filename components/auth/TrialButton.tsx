"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function TrialButton() {
  const [state, setState] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [detail, setDetail] = useState<string | null>(null);

  const handleClick = async () => {
    setState("loading");
    setDetail(null);
    try {
      const res = await fetch("/api/trial/start", { method: "POST" });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.detail ?? body?.error ?? "trial_failed");
      setState("ok");
    } catch (err) {
      setState("error");
      setDetail(err instanceof Error ? err.message : "trial_failed");
    }
  };

  if (state === "ok") {
    return <p className="text-[14px] text-emerald-400">Free Trial avviata.</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" onClick={handleClick} disabled={state === "loading"}>
        {state === "loading" ? "Attendere…" : "Avvia Free Trial di 72 ore"}
      </Button>
      {state === "error" && (
        <p className="text-[13px] text-amber-300">
          Integrazione con il backend non ancora collegata ({detail}).
        </p>
      )}
    </div>
  );
}

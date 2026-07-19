"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

export function CheckoutButton({ plan, label }: { plan: "basic" | "pro"; label: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const body = await res.json();
      if (!res.ok || !body.url) {
        throw new Error(body?.error ?? "checkout_failed");
      }
      window.location.href = body.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "checkout_failed");
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button variant="primary" onClick={handleClick} disabled={loading}>
        {loading ? "Attendere…" : label}
      </Button>
      {error && (
        <p className="text-[13px] text-red-400">
          Checkout non disponibile ({error}). Verifica la configurazione Stripe.
        </p>
      )}
    </div>
  );
}

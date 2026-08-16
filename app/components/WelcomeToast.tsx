"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Toast } from "@/app/components/Toast";

export function WelcomeToast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (searchParams.get("welcome") !== "1") return;

    const isNewAccount = searchParams.get("new") === "1";
    setMessage(isNewAccount ? "Account created! Welcome to DevFlow." : "Successfully signed in! Welcome back!");

    // Strip the params so refresh/back-navigation doesn't replay the toast
    const params = new URLSearchParams(searchParams.toString());
    params.delete("welcome");
    params.delete("new");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount only

  if (!message) return null;

  return <Toast message={message} onDismiss={() => setMessage(null)} />;
}
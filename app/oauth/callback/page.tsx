// app/s/callback/page.tsx
"use client";

import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";

export default function SSOCallback() {
  return <AuthenticateWithRedirectCallback />;
}
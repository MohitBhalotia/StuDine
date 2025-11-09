"use client";

import { authClient } from "@/lib/auth-client";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  // This component ensures the auth client is initialized
  // Better-auth doesn't require a provider, but this can be used
  // to add any client-side auth logic if needed
  return <>{children}</>;
}





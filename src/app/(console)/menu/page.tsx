"use client";

import StudentMenu from "./StudentMenu";
import AdminMenu from "./AdminMenu";
import { Loader2 } from "lucide-react";
import { User } from "@/lib/auth";
import { useEffect, useState } from "react";
import { createAuthClient } from "better-auth/react";

const { useSession } = createAuthClient();

export default function Page() {
  const[user,setUser]=useState<User|null>()
  const { data: session, isPending } = useSession();
  useEffect(() => {
    if (session?.user && !isPending) {
      const user = session.user as User;
      setUser(user)
    }
  }, [session, isPending]);

  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role === "admin") {
    return <AdminMenu />;
  }

  return <StudentMenu />;
}

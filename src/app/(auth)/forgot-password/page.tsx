"use client";
import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axios.post("/api/auth/forgot-password", { email,redirectTo: "/reset-password" });
      toast.success("Email sent successfully");
    } catch (error) {
      toast.error(`An error occurred. Please try again. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen rounded-3xl flex flex-col gap-4 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mt-10">
          <Link href="/" className="flex items-center gap-2 font-medium z-10">
            <Image src="/logo.png" alt="StuDine" width={200} height={100} />
          </Link>
        </div>
      </div>

        <div className="max-w-md mx-auto z-10 border-2 border-gray-200 bg-card p-4 rounded-md shadow-md">
          <ForgotPasswordForm />
        </div>
    </div>
  );
}

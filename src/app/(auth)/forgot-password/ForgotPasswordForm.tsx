"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await authClient.requestPasswordReset({ email,redirectTo: "/reset-password" });
      if (error) {
        toast.error(error.message || "Something went wrong");
      } else {
        toast.success("Password reset link sent successfully!");
      }
    } catch (err: any) {
      toast.error("Unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="mb-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold">
          Reset your password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>

        <form className="space-y-6 mt-6 px-4" onSubmit={onSubmit}>
          <div>
            <Label
              htmlFor="email"
              className="block text-sm font-medium text-muted-foreground"
            >
              Email address
            </Label>
            <div className="mt-2">
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex gap-2 justify-center p-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.replace("/login")}
              disabled={isLoading}
            >
              Back to login
            </Button>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

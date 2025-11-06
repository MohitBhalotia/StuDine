import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { registerSchema } from "@/models/registerSchema";
import { authClient } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      roomNo: "",
      phoneNo: "",
      terms: false,
    },
  });
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setError(null);
    setLoading(true);
    const { error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      roomNo: data.roomNo,
      phoneNo: data.phoneNo,
      callbackURL: "/login",
    });
    if (error) {
      toast.error(error.message || "Something went wrong");
      setError(error.message || "Something went wrong");
    } else {
      toast.success("Account created successfully");
    }
    setLoading(false);
  };

  return (
    <Form {...form}>
      <div className="flex  flex-col items-center gap-2 text-center py-2 ">
        <h1 className="text-2xl font-bold ">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details to create an account
        </p>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 ">
        {error && <p className="text-destructive text-lg text-center mt-4 font-semibold">{error}</p>}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="John Doe"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="name"
                  autoCorrect="off"
                  disabled={loading}
                  className="h-11"
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  disabled={loading}
                  className="h-11"
                />
              </FormControl>
              <FormDescription className="text-xs text-muted-foreground">
                <p className="text-muted-foreground">
                  We will send a verification link to your email
                </p>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Password</FormLabel>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                    className="h-11 pr-10"
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="confirmPassword"
          control={form.control}
          render={({ field }) => {
            const password = form.watch("password");
            return (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    placeholder="••••••••"
                    disabled={loading}
                    className="h-11 pr-10"
                  />
                </FormControl>
                <FormMessage>
                  {password !== field.value && "Passwords do not match"}
                </FormMessage>
              </FormItem>
            );
          }}
        />
        <FormField
          name="roomNo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="123"
                  disabled={loading}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="phoneNo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  placeholder="1234567890"
                  disabled={loading}
                  className="h-11"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="terms"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center gap-2 ml-2 ">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={loading}
                  />
                </FormControl>
                <FormLabel>
                  I accept the{" "}
                  <Link href="/terms" className="underline underline-offset-4">
                    Terms and Conditions
                  </Link>
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <span>Create Account</span>
          )}
        </Button>
      </form>
      
    </Form>
  );
}

"use client";
import Link from "next/link";
import { RegisterForm } from "./RegisterForm";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex gap-2 flex-col items-center justify-center bg-background">
      <div className="flex justify-center items-center mt-10">
        <Link href="/" className="flex items-center gap-2 font-medium z-10">
          <Image src="/logo.png" alt="StuDine" width={200} height={100} />
        </Link>
      </div>
      <div className="flex flex-col  my-10 gap-4  w-full max-w-md items-center justify-center ">
        <div className="w-full z-10 border-2 border-gray-200 bg-card p-4 rounded-md shadow-md">
          <RegisterForm />
        </div>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline underline-offset-4">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}

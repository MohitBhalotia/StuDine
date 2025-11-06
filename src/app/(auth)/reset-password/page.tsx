"use client";
import Image from "next/image";

import Link from "next/link";
import ResetPasswordForm from "./resetPasswordForm";

export default function ResetPassword() {
  return (
    <div className="min-h-screen rounded-3xl flex  flex-col gap-4 justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center items-center mt-10">
          <Link href="/" className="flex items-center gap-2 font-medium z-10">
            <Image src="/logo.png" alt="StuDine" width={200} height={100} />
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto z-10 border-2 border-gray-200 bg-card p-4 rounded-md shadow-md">
        <ResetPasswordForm />
      </div>
    </div>
  );
}

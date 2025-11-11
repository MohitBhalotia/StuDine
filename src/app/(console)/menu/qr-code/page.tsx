"use client";
import { QRCode } from "@/components/kibo-ui/qr-code";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const QrCodeContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    return <div>No ID found</div>;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="flex flex-col items-center justify-center  ">
      <h1 className="text-2xl font-bold my-10">QR Code</h1>
      <div className="p-4 border dark:bg-white rounded-2xl h-[500px] w-[500px]">
        <QRCode data={`${baseUrl}/orders/new?menuId=${id}`} />
      </div>
    </div>
  );
};

export default function QrCodePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin h-12 w-12 text-blue-500">
            <Loader2 className="h-12 w-12 text-blue-500" />
          </div>
        </div>
      }
    >
      <QrCodeContent />
    </Suspense>
  );
}

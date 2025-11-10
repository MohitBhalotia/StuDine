"use client";
import { QRCode } from "@/components/kibo-ui/qr-code";
import { useSearchParams } from "next/navigation";

const QrCodePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  if (!id) {
    return <div>No ID found</div>;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="flex flex-col items-center justify-center h-[600px]">
      <h1 className="text-2xl font-bold mb-10">QR Code</h1>
      <QRCode data={`${baseUrl}/orders/new?menuId=${id}`} />
    </div>
  );
};

export default QrCodePage;

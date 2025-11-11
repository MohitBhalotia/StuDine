"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { IDetectedBarcode, Scanner } from "@yudiel/react-qr-scanner";

import { QrCode } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

const QrDialog = ({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const router = useRouter();
  const handleScan = (result: IDetectedBarcode[]) => {
    console.log(result)
    router.push(result[0].rawValue);
    setOpen(false);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>Scan QR</DialogTitle>
      </DialogHeader>
      <Scanner onScan={handleScan}/>
      <Button variant="outline" className="mt-3 px-3 py-1 rounded">
        Scan
      </Button>
    </DialogContent>
  );
};

const QrBubble = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="h-17 w-17 rounded-full p-3 bg-primary fixed right-10 bottom-10 z-40 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-xl">
          <QrCode className="h-6 w-6 text-white " />
        </div>
      </DialogTrigger>

      <QrDialog setOpen={setOpen} />
    </Dialog>
  );
};

export default QrBubble;

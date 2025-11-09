// import { Inter } from "next/font/google";
// import SidebarWrapper from "@/src/components/SidebarWrapper";
import QrBubble from "@/components/QrBubble";
import SidebarWrapper from "@/components/SidebarWrapper";
// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Console | StuDine",
  description: "StuDine is a platform for creating and managing Mess food",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
      <div className="flex overflow-x-hidden">
        <SidebarWrapper>{children}</SidebarWrapper>
        <QrBubble />
      </div>
  );
}

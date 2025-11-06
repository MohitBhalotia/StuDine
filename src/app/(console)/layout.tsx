// import { Inter } from "next/font/google";
// import SidebarWrapper from "@/src/components/SidebarWrapper";
import SidebarWrapper from "@/components/SidebarWrapper";

// const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Console | Quick Voice",
  description:
    "Quick Voice is a platform for creating and managing AI voice agents",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex overflow-x-hidden">
      <SidebarWrapper>{children}</SidebarWrapper>
    </div>
  );
}
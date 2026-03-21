import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({ variable: "--font-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImpactOS AI — MIS Blueprint in 30 Minutes",
  description:
    "Design a complete nonprofit Management Information System using the MAP Framework. Model → Align → Power with AI.",
  keywords: [
    "nonprofit MIS",
    "management information system",
    "MAP framework",
    "EdZola",
    "ImpactOS",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#080e0c] text-white`}
      >
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}

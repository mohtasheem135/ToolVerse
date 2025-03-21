import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ToolVerse",
  description: "A Repository of Tools for Everyone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-full m-0`}
      >
        <SidebarProvider>
          <div className="flex w-full">
            <AppSidebar />
            <main className="flex-1 w-full">
              <div className="w-full flex items-center h-[70px] bg-[#000099]">
                <SidebarTrigger className="w-[40px] h-[40px] ml-3" />
                <Link href="/">
                  <p className="text-[25px] text-white ml-5 cursor-pointer">
                    ToolVerse
                  </p>
                </Link>
              </div>
              {children}
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}

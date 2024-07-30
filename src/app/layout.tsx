import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "../../auth";
import toast, { Toaster } from "react-hot-toast";
import clsx from "clsx";
import Head from "next/head";
import { markAbsentUsers } from "../../action/autoAbsent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | WHOAMI",
    default: "WHOAMI",
  },
  description: "The official Next.js Learn Dashboard built with App Router.",
  icons: "favicon.ico",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body className={inter.className}>
          <main className="">{children}</main>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}

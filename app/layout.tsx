"use client";
import "./globals.css";
import type { Metadata } from "next";

import { SessionProvider } from "next-auth/react";



export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body >
        <SessionProvider session={session}>
          {children}
          </SessionProvider>
      </body>
    </html>
  );
}

"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import {NextUIProvider} from "@nextui-org/react";

export default function RootLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session: any;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
      <NextUIProvider>
        <SessionProvider session={session}>
          {children}
          </SessionProvider>
      </NextUIProvider>
      </body>
    </html>
  );
}

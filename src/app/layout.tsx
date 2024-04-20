"use client";
import { AppProgressBar as ProgressBar } from "next-nprogress-bar";
import { Inter } from "next/font/google";
import "./globals.css";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { Toaster } from "sonner";
import Navbar from "./_components/Navbar";
const inter = Inter({ subsets: ["latin"] });

const convex = new ConvexReactClient(
  process.env.NEXT_PUBLIC_CONVEX_URL as string
);
export const dynamic = "force-dynamic";
export const revalidate = 0;
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      {/* <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          > */}
      <body className={inter.className}>
        <ClerkProvider>
          <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
            {children}
            <ProgressBar
              height="4px"
              options={{ showSpinner: false }}
              shallowRouting
            />
            <Toaster />
          </ConvexProviderWithClerk>
        </ClerkProvider>
      </body>
      {/* </ThemeProvider> */}
    </html>
  );
}

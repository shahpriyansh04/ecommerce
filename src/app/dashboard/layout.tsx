import React from "react";
import Sidebar from "./_components/Sidebar";
import Navbar from "./_components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h- screen w-full flex-col bg-muted/40">
      <Sidebar />
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Navbar />
      </div>
      {children}
    </div>
  );
}

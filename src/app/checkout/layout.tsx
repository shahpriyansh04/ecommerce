import React from "react";
import Navbar from "../_components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <div className="px-16 py-4">
        <Navbar />
      </div>{" "}
      <hr />
      <div className="px-16 py-12 ">{children}</div>
    </div>
  );
}

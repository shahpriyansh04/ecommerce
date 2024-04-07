"use client";
import { UserButton, auth } from "@clerk/nextjs";
import { api } from "../../../convex/_generated/api";
import { useQuery } from "convex/react";

export default function Home() {
  try {
    const messages = useQuery(api.message.getTaskList);
    console.log(messages);
  } catch (error) {
    console.log(error);
  }

  return (
    <div className="h-screen flex items-center justify-center gap-12">
      <p>Dashboard</p>
      <UserButton afterSignOutUrl="/login" />
    </div>
  );
}

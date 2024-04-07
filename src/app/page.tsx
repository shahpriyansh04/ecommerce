"use client";
import { SignInButton, UserButton, auth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { user } = useUser();
  const messages = useQuery(api.message.getTaskList);

  return (
    <div className="h-screen flex items-center justify-center gap-12">
      {user ? <UserButton afterSignOutUrl="/login" /> : <SignInButton />}
    </div>
  );
}

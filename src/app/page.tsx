"use client";
import { SignInButton, UserButton, auth, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Home() {
  const { user } = useUser();

  return (
    <div className="h-screen flex items-center justify-center gap-12">
      {user ? <UserButton afterSignOutUrl="/login" /> : <SignInButton />}
    </div>
  );
}

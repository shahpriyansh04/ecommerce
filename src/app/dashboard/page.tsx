import { UserButton, auth } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="h-screen flex items-center justify-center gap-12">
      <p>Dashboard</p>
      <UserButton afterSignOutUrl="/login" />
    </div>
  );
}

import { SignInButton, UserButton, auth } from "@clerk/nextjs";

export default async function Home() {
  const { userId } = auth();
  console.log(userId);

  return (
    <div className="h-screen flex items-center justify-center gap-12">
      {userId ? <UserButton afterSignOutUrl="/login" /> : <SignInButton />}
    </div>
  );
}

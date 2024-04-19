/**
 * v0 by Vercel.
 * @see https://v0.dev/t/Oob46Q2LmqX
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Input } from "@/components/ui/input";
import { SignInButton, UserButton, auth, currentUser } from "@clerk/nextjs";
import { Microscope, Search, ShoppingBag, User } from "lucide-react";
import Link from "next/link";

export default async function Navbar() {
  const user = await currentUser();

  return (
    <header className="bg-white ">
      <div className="mx-auto  flex items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mr-10">
            ACME
          </h1>
          <nav className="hidden md:flex space-x-10">
            <Link
              className="text-base font-medium text-gray-500 hover:text-gray-900"
              href="#"
            >
              All
            </Link>
            <Link
              className="text-base font-medium text-gray-500 hover:text-gray-900"
              href="#"
            >
              Clothing
            </Link>
            <Link
              className="text-base font-medium text-gray-500 hover:text-gray-900"
              href="#"
            >
              Electronics
            </Link>
            <Link
              className="text-base font-medium text-gray-500 hover:text-gray-900"
              href="#"
            >
              Accessories
            </Link>
          </nav>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex border-2 rounded">
            <Search className="text-gray-600 w-5 h-5 my-2.5 ml-3" />
            <Input
              className="px-4 py-2 w-80 border-none outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Search for products..."
              type="text"
            />
          </div>
          <div className="relative mx-6">
            <ShoppingBag className=" text-gray-600 w-6 h-6 " />
            <span className="ml-1 text-gray-900 font-semibold absolute -bottom-2 text-sm right-0 bg-white rounded-full">
              3
            </span>
          </div>
          {user ? <UserButton /> : <SignInButton />}
        </div>
      </div>
    </header>
  );
}

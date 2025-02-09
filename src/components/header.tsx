"use client";

import { Button } from "@/components/ui/button";
import clsx from "clsx"; // For conditional class handling
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const { status } = useSession();
  const pathname = usePathname();

  const isAuthenticated = status === "authenticated";

  const handleSignOut = () => {
    signOut();
  };

  const getLinkClass = (path: string) =>
    clsx("text-base", {
      "text-black-500 font-semibold": pathname === path,
      "text-gray-600": pathname !== path,
    });

  return (
    <header className="fixed top-0 left-0 bg-white w-full shadow">
      <div className="container h-14 flex justify-between items-center">
        <div>
          <Link href={"/"}>
            <h2 className="text-2xl">Logo</h2>
          </Link>
        </div>
        <nav>
          {!isAuthenticated && (
            <ul className="flex items-center gap-4">
              <li>
                <Button variant={"outline"} asChild>
                  <Link
                    href="/auth/login"
                    className={getLinkClass("/auth/login")}
                  >
                    Login
                  </Link>
                </Button>
              </li>
              <li>
                <Button asChild>
                  <Link
                    href="/auth/sign-up"
                    className={getLinkClass("/auth/sign-up")}
                  >
                    Sign Up
                  </Link>
                </Button>
              </li>
            </ul>
          )}

          {isAuthenticated && (
            <ul className="flex items-center gap-4">
              <li>
                <Button variant="link" asChild>
                  <Link href="/ac" className={getLinkClass("/ac")}>
                    Account
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant="link" asChild>
                  <Link
                    href="/ac/workspaces"
                    className={getLinkClass("/ac/workspaces")}
                  >
                    Workspaces
                  </Link>
                </Button>
              </li>
              <li>
                <Button variant={"outline"} onClick={handleSignOut}>
                  Sign Out
                </Button>
              </li>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

"use client";

import Image from "next/image";
import { Quote, User } from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { clientLogout } from "@/app/(server)/actions/auth-actions";
import { useUrlFilters } from "@/hooks/use-url-filters";
import { SearchInput } from "../ui/search-input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface NavBarProps {
  session?: Session;
}

export function NavBar({ session }: NavBarProps) {
  const { name, setParams } = useUrlFilters();
  const [localSearch, setLocalSearch] = useState<string>(name || "");
  const debouncedSearch = useDebounce(localSearch);

  useEffect(() => {
    if (debouncedSearch.trim() === "") {
      setParams("name", ""); // This ensures the parameter gets removed
    } else {
      setParams("name", debouncedSearch);
    }
  }, [debouncedSearch]);

  return (
    <div>
      <div className="flex justify-between p-3 items-center border-b px-32">
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              priority
              style={{ objectFit: "contain" }}
            />
          </Link>
        </div>
        <div className="flex gap-4 items-center">
          <SearchInput
            value={(localSearch as string) || ""}
            onChange={(e) => setLocalSearch(e.target.value || "")}
            placeholder="Search..."
            className="rounded-full "
          />
          <div className="p-2 border bg-sidebar rounded-full">
            <Quote className="h-5 w-5 text-muted-foreground" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <div className="p-2 border bg-sidebar rounded-full">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {session ? (
                <>
                  <DropdownMenuLabel>{session?.user?.name}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {session && session?.user?.role == "ADMIN" && (
                    <>
                      <DropdownMenuItem>
                        <Link href="/admin">Admin Dashbaord</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={async () => await clientLogout("/")}
                  >
                    Logout
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <DropdownMenuItem>Login</DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <Link href="/register">
                    <DropdownMenuItem>Register</DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex justify-start bg-sidebar p-4 items-center border-b px-32">
        <ul className="flex flex-row gap-4 text-sm font-medium">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/categories">Categories</Link>
          </li>
          <li>
            <Link href="/about-us">About Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

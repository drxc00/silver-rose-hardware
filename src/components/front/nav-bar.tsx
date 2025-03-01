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
import { QuotationWithRelations } from "@/app/types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserQuotation } from "./user-quotation";
import { useQuotation } from "../providers/quotation-provider";
import { motion, useAnimation } from "motion/react";

interface NavBarProps {
  session?: Session;
  userQuotation?: QuotationWithRelations;
}

export function NavBar({ session }: NavBarProps) {
  const { name, setParams, removeParams } = useUrlFilters();
  const [localSearch, setLocalSearch] = useState<string>(name || "");
  const { quotation: optimisticQuotation } = useQuotation();
  const controls = useAnimation(); // Animation controls
  const debouncedSearch = useDebounce(localSearch);

  // Update the search params when the debounced search value changes
  // Before implementing a remove Params options, the page gets redirected to
  // the products page all the time, so we need to remove the name param if the search is empty
  // There may be better alternatives but for now this works.
  useEffect(() => {
    if (debouncedSearch.trim() !== "") {
      setParams("name", debouncedSearch);
    } else {
      removeParams("name");
    }
  }, [debouncedSearch, setParams, removeParams]);

  // Use effect for the quotation animation
  useEffect(() => {
    controls.start({ scale: [1, 1.2, 1], transition: { duration: 0.3 } });
  }, [optimisticQuotation, controls]); // Re-run effect when itemCount changes

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
            className="rounded-full w-96"
          />
          <Sheet>
            <SheetTrigger asChild>
              <motion.button
                className="relative rounded-full border bg-sidebar p-2 hover:bg-sidebar/90"
                animate={controls}
              >
                <Quote className="h-5 w-5 text-muted-foreground" />
                {optimisticQuotation?.quotation?.QuotationItem?.length > 0 && (
                  <motion.span
                    className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {optimisticQuotation?.quotation?.QuotationItem?.length}
                  </motion.span>
                )}
              </motion.button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader className="space-y-4">
                <SheetTitle className="text-xl">
                  Quotation (
                  {optimisticQuotation?.quotation?.QuotationItem?.length}{" "}
                  {optimisticQuotation?.quotation?.QuotationItem?.length === 1
                    ? "item"
                    : "items"}
                  )
                </SheetTitle>
              </SheetHeader>
              {optimisticQuotation && <UserQuotation />}
            </SheetContent>
          </Sheet>
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
            <Link href="/products">Products</Link>
          </li>
          <li>
            <Link href="/about-us">About Us</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

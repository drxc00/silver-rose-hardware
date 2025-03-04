"use client";

import Image from "next/image";
import { List, Quote, User } from "lucide-react";
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
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserQuotation } from "./user-quotation";
import { useQuotation } from "../providers/quotation-provider";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface NavBarProps {
  session?: Session;
  userQuotation?: QuotationWithRelations;
}

export function NavBar({ session }: NavBarProps) {
  const { name, setParams, removeParams } = useUrlFilters();
  const [localSearch, setLocalSearch] = useState<string>(name || "");
  const { quotation: optimisticQuotation } = useQuotation();
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

  return (
    <div>
      <div className="flex justify-between p-3 items-center border-b px-10 md:px-10 lg:px-32">
        <div>
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Logo"
              width={150}
              height={150}
              priority
              style={{ objectFit: "contain" }}
              loading="eager"
            />
          </Link>
        </div>
        <div className="hidden md:flex gap-4 items-center">
          <SearchInput
            value={(localSearch as string) || ""}
            onChange={(e) => setLocalSearch(e.target.value || "")}
            placeholder="Search..."
            className="rounded-full w-96"
          />
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative rounded-full border bg-sidebar p-2 hover:bg-sidebar/90">
                <Quote className="h-5 w-5 text-muted-foreground" />
                {optimisticQuotation?.quotation?.QuotationItem?.length > 0 && (
                  <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
                    {optimisticQuotation?.quotation?.QuotationItem?.length}
                  </span>
                )}
              </button>
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
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">
                <List className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-xl font-bold">
                  Silver Rose Hardware
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Navigation
                  </h3>
                  <nav className="flex flex-col space-y-3">
                    <SheetClose asChild>
                      <Link
                        href="/"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        Home
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/categories"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        Categories
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/products"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        Products
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/about-us"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        About Us
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/quotation"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        <div className="flex items-center justify-between w-full gap-4">
                          <span>Quotation</span>
                          <Badge>
                            {
                              optimisticQuotation?.quotation?.QuotationItem
                                ?.length
                            }
                          </Badge>
                        </div>
                      </Link>
                    </SheetClose>
                  </nav>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground">
                    Account
                  </h3>
                  <div className="flex flex-col space-y-3">
                    {session ? (
                      <>
                        <p className="text-base font-medium">
                          {session?.user?.name}
                        </p>
                        {session && session?.user?.role === "ADMIN" && (
                          <SheetClose asChild>
                            <Link
                              href="/admin"
                              className="flex items-center py-2 text-base"
                            >
                              Admin Dashboard
                            </Link>
                          </SheetClose>
                        )}
                        <SheetClose asChild>
                          <Link
                            href="/profile"
                            className="flex items-center py-2 text-base"
                          >
                            Profile
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Button
                            variant="ghost"
                            className="justify-start p-0 text-base font-normal h-auto"
                            onClick={async () => await clientLogout("/")}
                          >
                            Logout
                          </Button>
                        </SheetClose>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                          <Link
                            href="/login"
                            className="flex items-center py-2 text-base"
                          >
                            Login
                          </Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link
                            href="/register"
                            className="flex items-center py-2 text-base"
                          >
                            Register
                          </Link>
                        </SheetClose>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      <div className="flex md:justify-start justify-center bg-sidebar p-4 items-center border-b px-10 md:16 lg:px-32">
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

"use client";

import Image from "next/image";
import {
  LayoutDashboard,
  User,
  List,
  LogIn,
  LogOut,
  PackageOpen,
  Quote,
  Settings,
  UserPlus,
} from "lucide-react";
import Link from "next/link";
import { Session } from "next-auth";
import {
  DropdownMenuItem,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserQuotation } from "./user-quotation";
import { useQuotation } from "../providers/quotation-provider";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
interface NavBarProps {
  session?: Session;
  userQuotation?: QuotationWithRelations;
}

export function NavBar({ session }: NavBarProps) {
  const { name, setParams, removeParams } = useUrlFilters();
  const pathname = usePathname();
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
            className="rounded-lg w-96"
          />
          <Sheet>
            <SheetTrigger asChild>
              <button className="relative rounded-lg border bg-sidebar p-2 hover:bg-sidebar/90">
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
              <SheetDescription>
                View and manage your quotation items
              </SheetDescription>
              {optimisticQuotation && <UserQuotation />}
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="cursor-pointer">
              <div className="flex items-center gap-2 p-2 border rounded-lg bg-sidebar hover:bg-accent transition-colors duration-200">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {session ? (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{session?.user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  {session?.user?.role === "ADMIN" && (
                    <>
                      <Link href="/admin" className="w-full">
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Admin Dashboard</span>
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <Link href="/account" className="w-full">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Account Settings</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-500 gap-2 focus:text-red-500"
                    onClick={async () => await clientLogout("/")}
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <div className="px-2 py-2 text-center">
                    <p className="text-sm font-medium mb-1">Welcome</p>
                    <p className="text-xs text-muted-foreground">
                      Please login to continue
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/login" className="w-full">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <LogIn className="h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/register" className="w-full">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <UserPlus className="h-4 w-4" />
                      <span>Register</span>
                    </DropdownMenuItem>
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
              <SheetHeader>
                <SheetTitle className="text-xl font-bold">
                  Silver Rose Hardware
                </SheetTitle>
              </SheetHeader>
              <SheetDescription className="text-center">
                Get the Best Price for your Hardware Needs
              </SheetDescription>
              <Separator className="my-4" />
              <div className="flex flex-col space-y-6">
                <div className="space-y-2">
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
                        href="/ask"
                        className="flex items-center py-2 text-base font-medium"
                      >
                        SilvieAI
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
                            href="/account"
                            className="flex items-center py-2 text-base"
                          >
                            Account
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
      <div className="flex md:justify-start justify-center bg-sidebar p-4 items-center border-b px-10 md:px-16 lg:px-32">
        <ul className="flex flex-wrap justify-center md:flex-row md:justify-start gap-2 text-sm font-medium">
          <li>
            <Link href="/">
              <Button
                className="rounded-sm"
                size="sm"
                variant={pathname === "/" ? "default" : "ghost"}
              >
                Home
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/categories">
              <Button
                className="rounded-sm"
                size="sm"
                variant={pathname.includes("categories") ? "default" : "ghost"}
              >
                Categories
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <Button
                className="rounded-sm"
                size="sm"
                variant={pathname.includes("/products") ? "default" : "ghost"}
              >
                Products
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/ask">
              <Button
                className="rounded-sm"
                size="sm"
                variant={pathname.includes("ask") ? "default" : "ghost"}
              >
                SilvieAI
              </Button>
            </Link>
          </li>
          <li>
            <Link href="/about-us">
              <Button
                className="rounded-sm"
                size="sm"
                variant={pathname.includes("about-us") ? "default" : "ghost"}
              >
                About Us
              </Button>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

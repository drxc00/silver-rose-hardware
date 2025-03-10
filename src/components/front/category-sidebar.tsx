"use client";

import { useState } from "react";
import { CategoryTree } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight, Menu, X } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function CategorySidebar({
  categories,
}: {
  categories: CategoryTree[];
}) {
  const params = useParams<{ slug: string; subSlug: string }>();
  const [open, setOpen] = useState(false);

  const CategoryNav = () => (
    <nav aria-label="Category navigation" className="space-y-1">
      {categories.map((category) => (
        <Collapsible
          key={category.id}
          open={category.slug === params.slug}
          className="px-2"
        >
          <div className="relative">
            <Link
              href={`/categories/${category.slug}`}
              className={cn(
                "block w-full",
                params.slug === category.slug && "font-medium"
              )}
              onClick={() => setOpen(false)}
            >
              <CollapsibleTrigger
                className={cn(
                  "flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                  params.slug === category.slug && "bg-muted text-primary"
                )}
                aria-expanded={category.slug === params.slug}
              >
                {category.subcategories.length > 0 && (
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      category.slug === params.slug && "rotate-90"
                    )}
                  />
                )}
                <span className="ml-2">{category.name}</span>
              </CollapsibleTrigger>
            </Link>

            <CollapsibleContent className="pl-4 pr-2 py-1">
              {category.subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/categories/${category.slug}/${subcategory.slug}`}
                  className={cn(
                    "flex items-center px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted/50",
                    params.subSlug === subcategory.slug &&
                      "bg-muted text-primary font-medium"
                  )}
                  onClick={() => setOpen(false)}
                >
                  <span className="ml-6">{subcategory.name}</span>
                </Link>
              ))}
            </CollapsibleContent>
          </div>
        </Collapsible>
      ))}
    </nav>
  );

  // Desktop version
  return (
    <>
      {/* Desktop sidebar */}
      <Card className="hidden md:block w-64 lg:w-80 h-full">
        <CardHeader className="px-4 py-3">
          <CardTitle className="text-xl font-semibold">Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-2 pt-0">
          <CategoryNav />
        </CardContent>
      </Card>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" className="w-full md:hidden">
            <Menu className="h-5 w-5" />
            <span>Categories</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full max-w-xs p-0">
          <div className="flex flex-col h-full">
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Categories</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2">
              <CategoryNav />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

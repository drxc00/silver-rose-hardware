"use client";

import { CategoryTree } from "@/app/types";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function CategorySidebar({
  categories,
}: {
  categories: CategoryTree[];
}) {
  const params = useParams<{ slug: string; subSlug: string }>();

  return (
    <Card className="w-80 h-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
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
                    (params.slug === category.slug) && "font-medium"
                  )}
                >
                  <CollapsibleTrigger
                    className={cn(
                      "flex items-center w-full px-4 py-2 text-sm rounded-md transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-ring",
                      (params.slug === category.slug) && "bg-muted text-primary"
                    )}
                    aria-expanded={category.slug === params.slug }
                  >
                    <ChevronRight
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        category.slug === params.slug && "rotate-90",
                        !category.subcategories.length &&
                          "text-muted-foreground"
                      )}
                    />
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
                    >
                      <span className="ml-6">{subcategory.name}</span>
                    </Link>
                  ))}
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))}
        </nav>
      </CardContent>
    </Card>
  );
}

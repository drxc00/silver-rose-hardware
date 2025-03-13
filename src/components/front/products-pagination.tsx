"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useUrlFilters } from "@/hooks/use-url-filters";
interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const { setParams } = useUrlFilters();
  return (
    <nav className="flex gap-2">
      <Button
        variant="outline"
        disabled={currentPage <= 1}
        onClick={() => setParams("page", (currentPage - 1).toString())}
      >
        <ChevronLeft />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? "default" : "outline"}
          onClick={() => setParams("page", page.toString())}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="outline"
        disabled={currentPage >= totalPages}
        onClick={() => setParams("page", (currentPage + 1).toString())}
      >
        <ChevronRight />
      </Button>
    </nav>
  );
}

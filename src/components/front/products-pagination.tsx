import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  return (
    <nav className="flex gap-2">
      <Link href={`?page=${currentPage - 1}`}>
        <Button variant="outline" disabled={currentPage <= 1}>
          <ChevronLeft />
        </Button>
      </Link>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link key={page} href={`?page=${page}`}>
          <Button variant={currentPage === page ? "default" : "outline"}>
            {page}
          </Button>
        </Link>
      ))}
      <Link href={`?page=${currentPage + 1}`}>
        <Button variant="outline" disabled={currentPage >= totalPages}>
          <ChevronRight />
        </Button>
      </Link>
    </nav>
  );
}

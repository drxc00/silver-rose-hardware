"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CategoryError() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">An error occurred</h1>
        <p className="text-gray-600">
          Something went wrong while loading the category. Please try again
          later.
        </p>
        <Link href="/categories">
          <Button>Browse All Categories</Button>
        </Link>
      </div>
    </div>
  );
}

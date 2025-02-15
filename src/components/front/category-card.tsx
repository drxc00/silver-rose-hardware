import { CategoryTree } from "@/app/types";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }: { category: CategoryTree }) {
  return (
    <Link href={`/categories/${category.slug}`}>
      <div className="relative aspect-square overflow-hidden rounded-2xl group">
        <Image
          src={category.image || "/placeholder-category.jpg"}
          alt={`${category.name} category`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
        <h2 className="absolute bottom-6 left-6 text-2xl font-bold text-white">
          {category.name}
        </h2>
      </div>
    </Link>
  );
}

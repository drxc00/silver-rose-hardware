import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

interface UnderPricesCardProps {
  headerText: string;
  image: string;
  href: string;
}

export function UnderPricesCard({
  headerText,
  image,
  href,
}: UnderPricesCardProps) {
  return (
    <div className="h-72 w-full relative aspect-square overflow-hidden rounded-sm group">
      <Image
        src={image || "/placeholder-category.jpg"}
        alt={`${headerText}`}
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="absolute top-10 left-6">
        <h2 className="text-3xl font-bold text-white mb-4">{headerText}</h2>
        <Link href={href}>
          <Button size="lg" className="rounded-sm">View All</Button>
        </Link>
      </div>
    </div>
  );
}

import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";

interface UnderPricesCardProps {
  headerText: string;
  image: string;
}

export function UnderPricesCard({ headerText, image }: UnderPricesCardProps) {
  return (
    <div className="h-72 w-full relative aspect-square overflow-hidden rounded-xl group">
      <Image
        src={image || "/placeholder-category.jpg"}
        alt={`${headerText}`}
        fill
        priority
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
      <div className="absolute top-10 left-6">
        <h2 className="text-3xl font-bold text-white mb-4">{headerText}</h2>
        <Button size="lg">View All</Button>
      </div>
    </div>
  );
}

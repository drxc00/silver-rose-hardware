import { ProductWithRelatedData } from "@/app/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { LayoutGridIcon, StretchHorizontal } from "lucide-react";
import { ProductCard } from "./product-card";

export function ProductsGrid({
  products,
}: {
  products: ProductWithRelatedData[];
}) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">Sort by</span>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select a value" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alphabetical-a-z">
                Alphabetically, A-Z
              </SelectItem>
              <SelectItem value="alphabetical-z-a">
                Alphabetically, Z-A
              </SelectItem>
              <SelectItem value="price-low-to-high">
                Price, low to high
              </SelectItem>
              <SelectItem value="price-high-to-low">
                Price, high to low
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="text-sm text-muted-foreground">View</span>
          <Button variant="ghost">
            <LayoutGridIcon className="w-5 h-5" />
          </Button>
          <Button variant="ghost">
            <StretchHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product as ProductWithRelatedData}
          />
        ))}
      </div>
    </div>
  );
}

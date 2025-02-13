import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Skeleton } from "./ui/skeleton"

interface ProductCardProps {
    id: string;
    name: string;
    image: string;
    category: string;
    price: {
        minPrice: number;
        maxPrice: number;
    }
    variants: string[];
}

export function ProductCard({ id, name, image, category, price, variants }: ProductCardProps) {
    return (
        <Card className="">
            <CardHeader className="p-0">
                <div className="aspect-square overflow-hidden relative">
                    {image !== "" ? (
                        <Image
                            src={image || "/placeholder.svg"}
                            alt={name}
                            width={300}
                            height={300}
                            className="h-full w-full object-cover"
                        />
                    ): (
                        <Skeleton className="w-full object-cover" />
                    )}
                    <Badge variant="secondary" className="absolute top-2 left-2">
                        {category}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-lg truncate">{name}</h3>
                    <p className="text-2xl font-bold text-primary">
                        ₱{price.minPrice.toFixed(2)} - ₱{price.maxPrice.toFixed(2)}
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {variants.map((variant, index) => (
                        <Badge key={index} variant="outline">
                            {variant}
                        </Badge>
                    ))}
                </div>
            </CardContent>
            <CardFooter className="p-4">
                <Button asChild className="w-full">
                    <Link href={`/product/${id}`}>View Details</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}


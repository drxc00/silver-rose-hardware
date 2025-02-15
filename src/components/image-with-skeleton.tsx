"use client";

import { cn } from "@/lib/utils";
import { Skeleton } from "./ui/skeleton";
import Image from "next/image";
import { useState } from "react";

export const ImageWithSkeleton = ({
  src,
  alt,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && (
        <Skeleton
          className={cn("static", className)}
          data-sidebar="menu-skeleton-icon"
        />
      )}
      <Image
        src={src || ""}
        alt={alt}
        height={height}
        width={width}
        className={cn(
          className,
          "transition-opacity duration-100",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
        style={{ width: "auto" }}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};

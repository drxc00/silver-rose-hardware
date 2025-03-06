export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from({ length: 20 }).map((_, index) => (
        <div key={index} className="animate-pulse">
          <div className="bg-muted h-48 rounded-sm- mb-4"></div>
          <div className="mt-4 space-y-2">
            <div className="h-6 bg-muted rounded-sm w-3/4"></div> {/* Title */}
            <div className="h-4 bg-muted rounded-sm w-1/2"></div> {/* Price */}
            <div className="flex gap-2 mt-2">
              {" "}
              {/* Attributes */}
              <div className="h-4 bg-muted rounded-sm w-16"></div>
              <div className="h-4 bg-muted rounded-sm w-12"></div>
            </div>
            <div className="h-10 bg-muted rounded-sm w-full mt-4"></div>{" "}
            {/* Button */}
          </div>
        </div>
      ))}
    </div>
  );
}

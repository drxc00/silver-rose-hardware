import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface DataCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
}

export function DataCard({ title, value, description, icon }: DataCardProps) {
  return (
    <Card className="rounded-sm shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-medium">{title}</h1>
          {icon}
        </div>
        <div className="grid">
          <h1 className="text-2xl font-bold">{value}</h1>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function DataCardSkeleton() {
  return (
    <Card className="rounded-sm shadow-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="grid gap-2 mt-4">
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-3 w-[200px]" />
        </div>
      </CardContent>
    </Card>
  );
}

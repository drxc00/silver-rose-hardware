import { Card, CardContent } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  value: string;
  description?: string;
  icon: React.ReactNode;
}

export function DataCard({ title, value, description, icon }: DataCardProps) {
  return (
    <Card>
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

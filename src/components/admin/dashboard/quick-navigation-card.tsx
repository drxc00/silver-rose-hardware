import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface QuickNavigationCardProps {
  icon: React.ReactNode;
  title: string;
  href: string;
}

export function QuickNavigationCard({
  icon,
  title,
  href,
}: QuickNavigationCardProps) {
  return (
    <Link href={href}>
      <Card className="cursor-pointer hover:scale-105 transition-all rounded-sm shadow-none">
        <CardContent className="p-8 py-10 flex justify-center">
          <div className="flex flex-col gap-2 items-center">
            <span className="text-primary">{icon}</span>
            <div className="flex gap-2">
              <h1 className="text-md font-medium">{title}</h1>
              <ChevronRight />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

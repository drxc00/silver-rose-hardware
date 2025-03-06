import { RelatedProductsSkeleton } from "@/components/front/products/related-products";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkeleton() {
  return (
    <main className="p-6 md:px-10 lg:px-32 flex min-h-screen flex-col justify-start bg-muted">
      <Breadcrumb className="pb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <Skeleton className="w-32 bg-muted-foreground/20 rounded-xl h-6" />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <Skeleton className="w-32 bg-muted-foreground/20 rounded-xl h-6" />
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <section className="w-full pb-8">
        <Card className="rounded-sm shadow-none">
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 items-center gap-6 w-full">
            <Skeleton className="bg-muted-foreground/20 w-full h-[400px]" />
            <div className="flex flex-col gap-4">
              <Skeleton className="bg-muted-foreground/20 w-72 h-12" />
              <Skeleton className="bg-muted-foreground/20 w-20 h-10" />
              <Skeleton className="bg-muted-foreground/20 w-56 h-10" />
              <Skeleton className="bg-muted-foreground/20 w-32 h-10" />
              <Skeleton className="bg-muted-foreground/20 w-full h-12" />
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="w-full flex flex-col gap-4 pb-8">
        <Skeleton className="w-32 bg-muted-foreground/20 rounded-xl h-8" />
        <Skeleton className="w-96 bg-muted-foreground/20 rounded-xl h-6" />
      </section>
      <section>
        <RelatedProductsSkeleton />
      </section>
    </main>
  );
}

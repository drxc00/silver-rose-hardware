import { AccountForm } from "@/components/forms/account-form";
import { Card, CardContent } from "@/components/ui/card";
import authCache from "@/lib/auth-cache";
import { prisma } from "@/lib/prisma";

export default async function AccountPage() {
  const session = await authCache();
  const user = session?.user;
  const databaseUser = await prisma.user.findFirst({
    where: {
      id: user?.id,
    },
  });

  return (
    <main className="mx-auto h-full py-10 px-4">
      <div className="flex flex-col items-center max-w-6xl mx-auto space-y-8 pb-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-center pb-2 flex items-center justify-center gap-2">
            Account Page
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your account details.
          </p>
        </div>
      </div>
      <div className="px-6 md:px-12 lg:px-32">
        <Card className="rounded-sm shadow-none">
          <CardContent className="p-6">
            <AccountForm user={databaseUser!} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

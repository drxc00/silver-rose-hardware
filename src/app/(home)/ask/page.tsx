import AskForm from "@/components/forms/ask-ai-form";

export default async function AskPage() {
  return (
    <main className="mx-auto h-full flex flex-col gap-8 py-10 px-4">
      <div className="flex flex-col items-center max-w-6xl mx-auto space-y-8">
        <div className="text-center max-w-2xl">
          <h1 className="text-3xl font-bold text-center pb-2 flex items-center justify-center gap-2">
            Ask <span className="text-primary">SilvieAI</span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Describe what you are looking for or what you want to build, and{" "}
            <span className="text-primary">Silvie</span>, our AI will recommend
            the best products for your project.
          </p>
        </div>
      </div>
      <div className="w-full max-w-6xl mx-auto">
        <AskForm />
      </div>
    </main>
  );
}

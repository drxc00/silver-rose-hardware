import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-6">
      <div className="max-w-2xl text-center space-y-6">
        <div className="animate-bounce">
          <h1 className="text-9xl font-bold text-primary">404</h1>
        </div>
        <h2 className="text-4xl font-semibold">Oops! Page not found</h2>
        <p className="text-lg text-muted-foreground">
          The page you&apos;re looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
        >
          Go back home
        </Link>
      </div>
    </div>
  );
}

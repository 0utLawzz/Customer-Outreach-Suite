import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-background text-foreground text-center p-4">
      <h1 className="text-6xl font-bold font-mono text-muted-foreground mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2 tracking-tight">System Node Not Found</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        The route you are trying to access does not exist in the current panel configuration.
      </p>
      <Link href="/">
        <Button variant="default" size="lg" className="font-mono uppercase tracking-wider">
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}

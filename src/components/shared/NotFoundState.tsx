import { Compass } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NotFoundState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Compass className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-lg font-semibold">Page not found</p>
        <p className="max-w-sm text-sm text-muted-foreground">The page you're looking for doesn't exist or has moved.</p>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}

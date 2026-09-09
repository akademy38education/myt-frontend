import { Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ForbiddenState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <Lock className="h-10 w-10 text-destructive" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-lg font-semibold">Access denied</p>
        <p className="max-w-sm text-sm text-muted-foreground">Your account does not have permission to view this page.</p>
      </div>
      <Button asChild size="sm" variant="outline">
        <Link to="/">Go home</Link>
      </Button>
    </div>
  );
}

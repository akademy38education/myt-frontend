import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function UnauthorizedState() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <ShieldAlert className="h-10 w-10 text-warning" aria-hidden="true" />
      <div className="space-y-1">
        <p className="text-lg font-semibold">Sign in required</p>
        <p className="max-w-sm text-sm text-muted-foreground">You need to sign in to view this page.</p>
      </div>
      <Button asChild size="sm">
        <Link to="/login">Sign in</Link>
      </Button>
    </div>
  );
}

import { Link } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/utils/cn";

export interface SubjectCardProps {
  icon: LucideIcon;
  name: string;
  tutorCount: number;
  to: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SubjectCard({ icon: Icon, name, tutorCount, to, className, style }: SubjectCardProps) {
  return (
    <Link to={to} className={cn("group block", className)} style={style}>
      <Card className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:shadow-md">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{tutorCount} tutors available</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
        </CardContent>
      </Card>
    </Link>
  );
}

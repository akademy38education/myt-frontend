import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials } from "@/utils/formatters";
import { cn } from "@/utils/cn";

export interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  rating?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function TestimonialCard({ quote, name, role, rating = 5, className, style }: TestimonialCardProps) {
  return (
    <Card className={cn(className)} style={style}>
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex gap-0.5" aria-label={`${rating} out of 5 stars`}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={cn("h-4 w-4", i < rating ? "fill-warning text-warning" : "text-muted")} aria-hidden="true" />
          ))}
        </div>
        <p className="flex-1 text-sm leading-relaxed text-foreground">&ldquo;{quote}&rdquo;</p>
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{name}</p>
            <p className="text-xs text-muted-foreground">{role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

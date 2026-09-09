import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/utils/cn";

export interface PricingCardProps {
  name: string;
  price: string;
  priceSuffix?: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaTo: string;
  highlighted?: boolean;
  className?: string;
}

export function PricingCard({ name, price, priceSuffix, description, features, ctaLabel, ctaTo, highlighted, className }: PricingCardProps) {
  return (
    <Card
      className={cn(
        "relative flex h-full flex-col transition-shadow duration-300 hover:shadow-md",
        highlighted && "border-primary shadow-md ring-1 ring-primary/20",
        className
      )}
    >
      {highlighted && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
          Most popular
        </Badge>
      )}
      <CardContent className="flex h-full flex-col gap-6 p-6">
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight">{price}</span>
          {priceSuffix && <span className="text-sm text-muted-foreground">{priceSuffix}</span>}
        </div>
        <ul className="flex-1 space-y-2.5">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
        <Button asChild variant={highlighted ? "default" : "outline"} className="w-full">
          <Link to={ctaTo}>{ctaLabel}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

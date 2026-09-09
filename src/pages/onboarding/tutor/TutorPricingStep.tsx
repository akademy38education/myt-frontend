import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingStepCard } from "@/features/onboarding/components/OnboardingStepCard";
import { OnboardingStepFooter } from "@/features/onboarding/components/OnboardingStepFooter";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useTutorOnboardingStore } from "@/features/onboarding/tutor/store";
import { tutorStepPath } from "./steps";

const CURRENCIES = ["GBP", "USD", "EUR"];

export function TutorPricingStep() {
  const navigate = useNavigate();
  const { draft, updateDraft } = useTutorOnboardingStore();
  const [hourlyRate, setHourlyRate] = useState(draft.hourlyRate?.toString() ?? "");
  const [currency, setCurrency] = useState(draft.currency ?? "GBP");
  const [trialEnabled, setTrialEnabled] = useState(draft.trialLessonEnabled ?? false);
  const [trialPrice, setTrialPrice] = useState(draft.trialLessonPrice?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const rate = Number(hourlyRate);
    if (!hourlyRate || Number.isNaN(rate) || rate <= 0) {
      setError("Enter your hourly rate.");
      return;
    }
    updateDraft({
      hourlyRate: rate,
      currency,
      trialLessonEnabled: trialEnabled,
      trialLessonPrice: trialEnabled && trialPrice ? Number(trialPrice) : undefined,
    });
    navigate(tutorStepPath("availability"));
  }

  return (
    <OnboardingStepCard title="Set your pricing" description="You can change your rate anytime from your tutor settings.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="flex items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="hourlyRate">Hourly lesson price</Label>
            <Input id="hourlyRate" type="number" min={1} className="w-40" value={hourlyRate} onChange={(e) => setHourlyRate(e.target.value)} aria-invalid={Boolean(error)} />
          </div>
          <div className="space-y-1.5">
            <Label>Currency</Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CURRENCIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}

        <div className="rounded-lg border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Offer a trial lesson</p>
              <p className="text-sm text-muted-foreground">A discounted first lesson often helps new students say yes.</p>
            </div>
            <Switch checked={trialEnabled} onCheckedChange={setTrialEnabled} />
          </div>
          {trialEnabled && (
            <div className="mt-3 max-w-[10rem] space-y-1.5">
              <Label htmlFor="trialPrice">Trial lesson price</Label>
              <Input id="trialPrice" type="number" min={0} value={trialPrice} onChange={(e) => setTrialPrice(e.target.value)} />
            </div>
          )}
        </div>

        <div className="rounded-lg border border-dashed border-border p-4 opacity-70">
          <div className="flex items-center justify-between">
            <p className="font-medium">Group lessons &amp; package pricing</p>
            <Badge variant="muted">Coming soon</Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">You'll be able to price group sessions and multi-lesson packages here in a future update.</p>
        </div>

        <OnboardingStepFooter onBack={() => navigate(tutorStepPath("teaching-style"))} />
      </form>
    </OnboardingStepCard>
  );
}

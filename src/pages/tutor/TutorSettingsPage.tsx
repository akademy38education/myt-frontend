import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useCurrentTutorProfile, useUpdateTutorSettings } from "@/features/tutors";
import type { TutorNotificationPreferences } from "@myt/shared";

const DEFAULT_PREFERENCES: TutorNotificationPreferences = {
  bookingRequests: true,
  lessonReminders: true,
  messages: true,
  reviews: true,
  payouts: true,
  marketing: false,
};

function SettingRow({ label, description, checked, onChange }: { label: string; description: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div>
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function TutorSettingsPage() {
  const { user } = useAuth();
  const { tutorId, data: tutor, isLoading } = useCurrentTutorProfile();
  const updateSettings = useUpdateTutorSettings(tutorId);
  const [preferences, setPreferences] = useState<TutorNotificationPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (tutor?.notificationPreferences) setPreferences(tutor.notificationPreferences);
  }, [tutor]);

  function handleChange(key: keyof TutorNotificationPreferences, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    updateSettings.mutate({ notificationPreferences: next }, { onError: () => toast.error("Couldn't save that setting") });
  }

  if (!tutorId || isLoading) return <LoadingState label="Loading your settings..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account, notifications and payouts." />

      <Tabs defaultValue="account">
        <TabsList className="flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="account">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <Label>Email</Label>
                <p className="mt-1 text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <div>
                <Label>Role</Label>
                <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role.toLowerCase()}</p>
              </div>
              <div>
                <Label>Profile</Label>
                <p className="mt-1 text-sm">
                  <Link to="/tutor/profile" className="text-primary hover:underline">
                    Edit your public profile →
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="divide-y divide-border p-6">
              <SettingRow label="Booking requests" description="New booking requests from students." checked={preferences.bookingRequests} onChange={(v) => handleChange("bookingRequests", v)} />
              <SettingRow label="Lesson reminders" description="Reminders before your upcoming lessons." checked={preferences.lessonReminders} onChange={(v) => handleChange("lessonReminders", v)} />
              <SettingRow label="Messages" description="New messages from students." checked={preferences.messages} onChange={(v) => handleChange("messages", v)} />
              <SettingRow label="Reviews" description="When a student leaves you a review." checked={preferences.reviews} onChange={(v) => handleChange("reviews", v)} />
              <SettingRow label="Payouts" description="When a payout is processed." checked={preferences.payouts} onChange={(v) => handleChange("payouts", v)} />
              <SettingRow label="Marketing" description="Occasional tips and product updates." checked={preferences.marketing} onChange={(v) => handleChange("marketing", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Your weekly schedule and blocked time are managed on the{" "}
                <Link to="/tutor/availability" className="font-medium text-primary hover:underline">
                  Availability
                </Link>{" "}
                page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground">
                Payout history and your current balance are on the{" "}
                <Link to="/tutor/earnings" className="font-medium text-primary hover:underline">
                  Earnings
                </Link>{" "}
                page.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardContent className="space-y-4 p-6">
              <div>
                <p className="text-sm font-medium">Password</p>
                <p className="mt-1 text-sm text-muted-foreground">Reset your password by email.</p>
                <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Check your email for a reset link once this is sent from the Forgot Password page.")}>
                  Send reset link
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

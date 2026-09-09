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
import { useCurrentParentProfile, useChildren, useUpdateParentSettings } from "@/features/parents";
import type { ParentNotificationPreferences } from "@myt/shared";

const DEFAULT_PREFERENCES: ParentNotificationPreferences = {
  lessonReminders: true,
  homeworkReminders: true,
  progressReports: true,
  tutorMessages: true,
  paymentNotifications: true,
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

export function ParentSettingsPage() {
  const { user } = useAuth();
  const { parentId, data: parent, isLoading } = useCurrentParentProfile();
  const { data: children } = useChildren(parentId);
  const updateSettings = useUpdateParentSettings(parentId);
  const [preferences, setPreferences] = useState<ParentNotificationPreferences>(DEFAULT_PREFERENCES);

  useEffect(() => {
    if (parent?.notificationPreferences) setPreferences(parent.notificationPreferences);
  }, [parent]);

  function handleChange(key: keyof ParentNotificationPreferences, value: boolean) {
    const next = { ...preferences, [key]: value };
    setPreferences(next);
    updateSettings.mutate({ notificationPreferences: next }, { onError: () => toast.error("Couldn't save that setting") });
  }

  if (!parentId || isLoading) return <LoadingState label="Loading your settings..." />;

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account, family, and notification preferences." />

      <Tabs defaultValue="account">
        <TabsList className="flex-wrap">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
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
                <Label>Billing email</Label>
                <p className="mt-1 text-sm text-muted-foreground">{parent?.billingEmail ?? "Not set"}</p>
              </div>
              <div>
                <Label>Payments</Label>
                <p className="mt-1 text-sm">
                  <Link to="/parent/payments" className="text-primary hover:underline">
                    Manage payment methods →
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="family">
          <Card>
            <CardContent className="space-y-3 p-6">
              <p className="text-sm text-muted-foreground">{children?.length ?? 0} child{children?.length === 1 ? "" : "ren"} on your account.</p>
              <Link to="/parent/children" className="text-sm font-medium text-primary hover:underline">
                Manage children →
              </Link>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="divide-y divide-border p-6">
              <SettingRow label="Lesson reminders" description="Reminders before your children's upcoming lessons." checked={preferences.lessonReminders} onChange={(v) => handleChange("lessonReminders", v)} />
              <SettingRow label="Homework reminders" description="Reminders when homework is due soon." checked={preferences.homeworkReminders} onChange={(v) => handleChange("homeworkReminders", v)} />
              <SettingRow label="Progress reports" description="New tutor reports and progress updates." checked={preferences.progressReports} onChange={(v) => handleChange("progressReports", v)} />
              <SettingRow label="Tutor messages" description="New messages from your children's tutors." checked={preferences.tutorMessages} onChange={(v) => handleChange("tutorMessages", v)} />
              <SettingRow label="Payments" description="Payment confirmations and issues." checked={preferences.paymentNotifications} onChange={(v) => handleChange("paymentNotifications", v)} />
              <SettingRow label="Marketing" description="Occasional tips and product updates." checked={preferences.marketing} onChange={(v) => handleChange("marketing", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="space-y-3 p-6 text-sm text-muted-foreground">
              <p>You can see your children's lesson history, progress, homework status, tutor reports and payments.</p>
              <p>Tutors can see the learning information you and your child share with them, but never your payment details.</p>
              <p>Your children's private notes to themselves (if any) are never shown to you or to tutors.</p>
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

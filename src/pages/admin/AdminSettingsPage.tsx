import { useEffect, useState } from "react";
import { PERMISSIONS } from "@myt/shared";
import { PageHeader } from "@/components/shared/PageHeader";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePermission } from "@/hooks/usePermission";
import { useAdminSettings, useUpdateAdminSettings } from "@/features/admin-settings";
import type { PlatformSettings, PlatformSettingsInput } from "@/features/admin-settings";
import { useFeatureFlags, useUpdateFeatureFlags } from "@/features/feature-flags";
import { env } from "@/config/env";
import { resetDemoData } from "@/utils/resetDemoData";

function toInput(settings: PlatformSettings): PlatformSettingsInput {
  return {
    general: { ...settings.general },
    booking: { ...settings.booking },
    payment: { ...settings.payment },
    notifications: { ...settings.notifications },
    content: { ...settings.content },
    security: { ...settings.security },
  };
}

/** "aiRecommendations" -> "Ai Recommendations" — flags are flat keys (see shared/types/intelligence.ts), not a fixed schema, so labels are derived rather than hand-authored per flag. */
function formatFlagLabel(key: string): string {
  const spaced = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function FeatureFlagsPanel() {
  const { data, isLoading, isError, refetch } = useFeatureFlags();
  const updateFlag = useUpdateFeatureFlags();
  const canManageFlags = usePermission(PERMISSIONS.SETTINGS_MANAGE);

  if (isLoading) return <LoadingState label="Loading feature flags..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const flagKeys = Object.keys(data).sort();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Flags</CardTitle>
        <CardDescription>Toggle platform features on or off. Each change applies immediately.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {flagKeys.length === 0 && <p className="text-sm text-muted-foreground">No feature flags are configured.</p>}
        {flagKeys.map((key) => (
          <SwitchRow
            key={key}
            id={`flag-${key}`}
            label={formatFlagLabel(key)}
            checked={Boolean(data[key])}
            disabled={!canManageFlags || updateFlag.isPending}
            onChange={(v) => updateFlag.mutate({ [key]: v })}
          />
        ))}
      </CardContent>
    </Card>
  );
}

function SwitchRow({ id, label, hint, checked, disabled, onChange }: { id: string; label: string; hint?: string; checked: boolean; disabled: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border p-3">
      <div>
        <Label htmlFor={id}>{label}</Label>
        {hint && <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>}
      </div>
      <Switch id={id} checked={checked} disabled={disabled} onCheckedChange={onChange} />
    </div>
  );
}

export function AdminSettingsPage() {
  const { data, isLoading, isError, refetch } = useAdminSettings();
  const updateSettings = useUpdateAdminSettings();
  const canManage = usePermission(PERMISSIONS.SETTINGS_MANAGE);

  const [form, setForm] = useState<PlatformSettingsInput | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  useEffect(() => {
    if (data) setForm(toInput(data));
  }, [data]);

  if (isLoading || !form) return <LoadingState label="Loading platform settings..." />;
  if (isError || !data) return <ErrorState onRetry={() => refetch()} />;

  const dirty = JSON.stringify(form) !== JSON.stringify(toInput(data));

  function updateSection<K extends keyof PlatformSettingsInput>(section: K, patch: Partial<PlatformSettingsInput[K]>) {
    setForm((current) => (current ? { ...current, [section]: { ...current[section], ...patch } } : current));
  }

  async function handleConfirmSave() {
    if (!form) return;
    try {
      await updateSettings.mutateAsync(form);
      setConfirmOpen(false);
    } catch {
      // Toast already surfaced by useUpdateAdminSettings's onError.
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Platform settings"
        description={canManage ? "Configuration that applies across the whole platform." : "Read-only — you don't have permission to change platform settings."}
        actions={
          canManage && (
            <Button disabled={!dirty} onClick={() => setConfirmOpen(true)}>
              Save changes
            </Button>
          )
        }
      />

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="booking">Booking</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="feature-flags">Feature Flags</TabsTrigger>
          {env.VITE_USE_MOCK_API && <TabsTrigger value="demo">Demo</TabsTrigger>}
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General</CardTitle>
              <CardDescription>Platform identity and maintenance mode.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="platformName">Platform name</Label>
                <Input
                  id="platformName"
                  value={form.general.platformName}
                  maxLength={100}
                  disabled={!canManage}
                  onChange={(e) => updateSection("general", { platformName: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="supportEmail">Support email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={form.general.supportEmail}
                  disabled={!canManage}
                  onChange={(e) => updateSection("general", { supportEmail: e.target.value })}
                />
              </div>
              <SwitchRow
                id="maintenanceMode"
                label="Maintenance mode"
                hint="Takes the platform offline for non-admin users."
                checked={form.general.maintenanceMode}
                disabled={!canManage}
                onChange={(v) => updateSection("general", { maintenanceMode: v })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="booking">
          <Card>
            <CardHeader>
              <CardTitle>Booking</CardTitle>
              <CardDescription>Rules governing lesson scheduling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="cancellationWindowHours">Cancellation window (hours)</Label>
                  <Input
                    id="cancellationWindowHours"
                    type="number"
                    min={0}
                    max={168}
                    value={form.booking.cancellationWindowHours}
                    disabled={!canManage}
                    onChange={(e) => updateSection("booking", { cancellationWindowHours: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="rescheduleWindowHours">Reschedule window (hours)</Label>
                  <Input
                    id="rescheduleWindowHours"
                    type="number"
                    min={0}
                    max={168}
                    value={form.booking.rescheduleWindowHours}
                    disabled={!canManage}
                    onChange={(e) => updateSection("booking", { rescheduleWindowHours: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="minLessonDurationMinutes">Minimum lesson duration (minutes)</Label>
                  <Input
                    id="minLessonDurationMinutes"
                    type="number"
                    min={15}
                    max={240}
                    value={form.booking.minLessonDurationMinutes}
                    disabled={!canManage}
                    onChange={(e) => updateSection("booking", { minLessonDurationMinutes: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lateFeePercent">Late cancellation fee (%)</Label>
                  <Input
                    id="lateFeePercent"
                    type="number"
                    min={0}
                    max={100}
                    value={form.booking.lateFeePercent}
                    disabled={!canManage}
                    onChange={(e) => updateSection("booking", { lateFeePercent: Number(e.target.value) })}
                  />
                </div>
              </div>
              <SwitchRow
                id="trialLessonEnabled"
                label="Trial lessons enabled"
                hint="Lets tutors offer a discounted first lesson."
                checked={form.booking.trialLessonEnabled}
                disabled={!canManage}
                onChange={(v) => updateSection("booking", { trialLessonEnabled: v })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment</CardTitle>
              <CardDescription>Platform fees and payout scheduling.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="platformFeeRate">Platform fee rate</Label>
                  <Input
                    id="platformFeeRate"
                    type="number"
                    min={0}
                    max={1}
                    step={0.01}
                    value={form.payment.platformFeeRate}
                    disabled={!canManage}
                    onChange={(e) => updateSection("payment", { platformFeeRate: Number(e.target.value) })}
                  />
                  <p className="text-xs text-muted-foreground">Fraction of 1, e.g. 0.15 = 15%.</p>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={form.payment.currency}
                    maxLength={3}
                    disabled={!canManage}
                    onChange={(e) => updateSection("payment", { currency: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="payoutScheduleDays">Payout schedule (days)</Label>
                  <Input
                    id="payoutScheduleDays"
                    type="number"
                    min={1}
                    max={60}
                    value={form.payment.payoutScheduleDays}
                    disabled={!canManage}
                    onChange={(e) => updateSection("payment", { payoutScheduleDays: Number(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Channels available for platform notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow
                id="emailEnabled"
                label="Email notifications"
                checked={form.notifications.emailEnabled}
                disabled={!canManage}
                onChange={(v) => updateSection("notifications", { emailEnabled: v })}
              />
              <SwitchRow
                id="smsEnabled"
                label="SMS notifications"
                checked={form.notifications.smsEnabled}
                disabled={!canManage}
                onChange={(v) => updateSection("notifications", { smsEnabled: v })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
              <CardDescription>Moderation rules for user-generated content.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <SwitchRow
                id="reviewModerationRequired"
                label="Require review moderation"
                hint="New reviews stay hidden until an admin approves them."
                checked={form.content.reviewModerationRequired}
                disabled={!canManage}
                onChange={(v) => updateSection("content", { reviewModerationRequired: v })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>Login and session protections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="maxLoginAttempts">Max login attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min={3}
                    max={20}
                    value={form.security.maxLoginAttempts}
                    disabled={!canManage}
                    onChange={(e) => updateSection("security", { maxLoginAttempts: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sessionTimeoutMinutes">Session timeout (minutes)</Label>
                  <Input
                    id="sessionTimeoutMinutes"
                    type="number"
                    min={5}
                    max={1440}
                    value={form.security.sessionTimeoutMinutes}
                    disabled={!canManage}
                    onChange={(e) => updateSection("security", { sessionTimeoutMinutes: Number(e.target.value) })}
                  />
                </div>
              </div>
              <SwitchRow
                id="requireTutorVerification"
                label="Require tutor verification"
                hint="Tutors must complete verification before appearing in search."
                checked={form.security.requireTutorVerification}
                disabled={!canManage}
                onChange={(v) => updateSection("security", { requireTutorVerification: v })}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feature-flags">
          <FeatureFlagsPanel />
        </TabsContent>

        {env.VITE_USE_MOCK_API && (
          <TabsContent value="demo">
            <Card className="border-destructive/40">
              <CardHeader>
                <CardTitle>Reset demo data</CardTitle>
                <CardDescription>
                  This is a frontend-only demo — everything you see is mock data stored in your browser. Use this to wipe every booking, homework
                  submission, message, and admin action you've made in this demo and start over from the original seed data. This has no effect
                  on a real deployment with a live backend.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="destructive" onClick={() => setResetConfirmOpen(true)}>
                  Reset demo data
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save platform settings?</DialogTitle>
            <DialogDescription>These changes apply to the whole platform immediately and are recorded in the audit log.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={updateSettings.isPending} onClick={handleConfirmSave}>
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {env.VITE_USE_MOCK_API && (
        <Dialog open={resetConfirmOpen} onOpenChange={setResetConfirmOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reset all demo data?</DialogTitle>
              <DialogDescription>
                Every booking, homework submission, message, notification, and admin action made during this demo will be permanently discarded
                and the app will reload with the original seed data. This cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setResetConfirmOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={resetDemoData}>
                Reset demo data
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

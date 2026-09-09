import { toast } from "sonner";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useSettingsStore } from "@/features/settings";

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

export function StudentSettingsPage() {
  const { user } = useAuth();
  const settings = useSettingsStore();

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="Settings" description="Manage your account, notifications and privacy." />

      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
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
                <Label>Role</Label>
                <p className="mt-1 text-sm capitalize text-muted-foreground">{user?.role.toLowerCase()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardContent className="divide-y divide-border p-6">
              <SettingRow label="Email notifications" description="Get emailed about important account activity." checked={settings.emailNotifications} onChange={(v) => settings.setPreference("emailNotifications", v)} />
              <SettingRow label="Lesson reminders" description="Reminders before your upcoming lessons." checked={settings.lessonReminders} onChange={(v) => settings.setPreference("lessonReminders", v)} />
              <SettingRow label="Homework reminders" description="Reminders when homework is due soon." checked={settings.homeworkReminders} onChange={(v) => settings.setPreference("homeworkReminders", v)} />
              <SettingRow label="Marketing emails" description="Occasional tips and product updates." checked={settings.marketingEmails} onChange={(v) => settings.setPreference("marketingEmails", v)} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy">
          <Card>
            <CardContent className="divide-y divide-border p-6">
              <SettingRow
                label="Visible to tutors in search"
                description="Let tutors see a summary of your learning goals when you enquire."
                checked={settings.profileVisibleToTutors}
                onChange={(v) => settings.setPreference("profileVisibleToTutors", v)}
              />
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

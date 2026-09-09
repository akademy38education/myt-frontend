import { useNavigate } from "react-router-dom";
import { Bell, Calendar, ClipboardList, MessageSquare, CreditCard, Trophy, Info } from "lucide-react";
import { NotificationType } from "@myt/shared";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatRelativeToNow } from "@/utils/formatters";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications, useUnreadNotificationCount } from "../hooks/useNotifications";
import { cn } from "@/utils/cn";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  [NotificationType.BOOKING]: Calendar,
  [NotificationType.LESSON]: Calendar,
  [NotificationType.HOMEWORK]: ClipboardList,
  [NotificationType.MESSAGE]: MessageSquare,
  [NotificationType.PAYMENT]: CreditCard,
  [NotificationType.SYSTEM]: Info,
  [NotificationType.ACHIEVEMENT]: Trophy,
};

export function NotificationBell() {
  const navigate = useNavigate();
  const { data: notifications } = useNotifications();
  const { data: unreadCount = 0 } = useUnreadNotificationCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}>
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-destructive" aria-hidden="true" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <p className="font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button className="text-xs font-medium text-primary hover:underline" onClick={() => markAllRead.mutate()}>
              Mark all as read
            </button>
          )}
        </div>
        <div className="max-h-96 overflow-y-auto">
          {!notifications || notifications.length === 0 ? (
            <EmptyState title="No notifications yet" className="border-0 py-10" />
          ) : (
            notifications.map((notification) => {
              const Icon = TYPE_ICON[notification.type];
              return (
                <button
                  key={notification.id}
                  onClick={() => {
                    markRead.mutate(notification.id);
                    if (notification.link) navigate(notification.link);
                  }}
                  className={cn(
                    "flex w-full items-start gap-3 border-b border-border px-4 py-3 text-left text-sm hover:bg-muted/50",
                    !notification.readAt && "bg-primary/5"
                  )}
                >
                  <span className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full", !notification.readAt ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground")}>
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{notification.title}</span>
                    <span className="block text-muted-foreground">{notification.body}</span>
                    <span className="mt-1 block text-xs text-muted-foreground">{formatRelativeToNow(notification.createdAt)}</span>
                  </span>
                  {!notification.readAt && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" aria-hidden="true" />}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

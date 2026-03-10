import { Bell, TrendingDown, Disc, Sparkles, Percent, MessageCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Notification } from '@/types';
import { formatRelativeTime, getNotificationColor } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete?: (id: string) => void;
}

const iconMap = {
  Bell,
  TrendingDown,
  Disc,
  Sparkles,
  Percent,
  MessageCircle,
};

export function NotificationItem({ notification, onMarkAsRead, onDelete }: NotificationItemProps) {
  const Icon = iconMap[getNotificationIcon(notification.type) as keyof typeof iconMap] || Bell;
  const colorClass = getNotificationColor(notification.type);

  return (
    <div
      className={cn(
        'flex items-start gap-3 p-4 rounded-lg transition-colors',
        notification.read ? 'bg-muted/30' : 'bg-primary/5 hover:bg-primary/10'
      )}
    >
      <div className={cn('p-2 rounded-full shrink-0', colorClass)}>
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className={cn('font-medium text-sm', !notification.read && 'text-primary')}>
              {notification.title}
            </p>
            <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
            <p className="text-xs text-muted-foreground mt-2">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {!notification.read && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(notification.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getNotificationIcon(type: string): string {
  const icons: Record<string, string> = {
    price_drop: 'TrendingDown',
    new_release: 'Disc',
    limited_edition: 'Sparkles',
    sale: 'Percent',
    message: 'MessageCircle',
  };
  return icons[type] || 'Bell';
}

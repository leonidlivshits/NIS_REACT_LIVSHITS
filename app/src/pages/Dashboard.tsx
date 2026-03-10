import { useEffect } from 'react';
import {
  Disc,
  TrendingUp,
  DollarSign,
  Package,
  Plus,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui-custom/StatCard';
import { MerchCard } from '@/components/ui-custom/MerchCard';
import { NotificationItem } from '@/components/ui-custom/NotificationItem';
import { useAppStore } from '@/stores/appStore';
import { mockCollection, mockNotifications } from '@/data/mockData';
import { formatCurrency, formatNumber } from '@/utils/formatters';

interface DashboardProps {
  onPageChange: (page: string) => void;
}

export function Dashboard({ onPageChange }: DashboardProps) {
  const {
    collection,
    notifications,
    addToCollection,
    addNotification,
    markNotificationAsRead,
    getCollectionStats,
  } = useAppStore();

  useEffect(() => {
    if (collection.length === 0) {
      mockCollection.forEach((item) => addToCollection(item));
    }
    if (notifications.length === 0) {
      mockNotifications.forEach((n) => {
        if (!notifications.find((existing) => existing.id === n.id)) {
          addNotification(n);
        }
      });
    }
  }, [collection.length, notifications.length]);

  const stats = getCollectionStats();
  const recentItems = collection.slice(0, 4);
  const recentNotifications = notifications.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Привет, коллекционер! <Sparkles className="inline-block h-6 w-6 text-amber-400" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Вот что произошло с твоей коллекцией сегодня
          </p>
        </div>
        <Button onClick={() => onPageChange('collection')} className="gap-2">
          <Plus className="h-4 w-4" />
          Добавить предмет
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего предметов"
          value={formatNumber(stats.totalItems)}
          subtitle={`+${stats.recentAdditions} за последний месяц`}
          icon={<Package className="h-5 w-5" />}
        />
        <StatCard
          title="Потрачено всего"
          value={formatCurrency(stats.totalSpent)}
          subtitle="Общая сумма покупок"
          icon={<DollarSign className="h-5 w-5" />}
        />
        <StatCard
          title="Текущая стоимость"
          value={formatCurrency(stats.currentValue)}
          trend={stats.profitLoss >= 0 ? 'up' : 'down'}
          trendValue={`${stats.profitLoss >= 0 ? '+' : ''}${stats.profitLossPercent.toFixed(1)}%`}
          icon={<TrendingUp className="h-5 w-5" />}
        />
        <StatCard
          title="Прибыль/Убыток"
          value={formatCurrency(Math.abs(stats.profitLoss))}
          trend={stats.profitLoss >= 0 ? 'up' : 'down'}
          trendValue={stats.profitLoss >= 0 ? 'Прибыль' : 'Убыток'}
          icon={<Disc className="h-5 w-5" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Items */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Недавно добавленные</h2>
            <Button
              variant="ghost"
              size="sm"
              className="gap-2"
              onClick={() => onPageChange('collection')}
            >
              Все предметы
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {recentItems.map((item) => (
              <MerchCard key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Уведомления</h2>
              <Badge variant="secondary">{notifications.filter((n) => !n.read).length} новых</Badge>
            </div>
            <div className="space-y-2">
              {recentNotifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markNotificationAsRead}
                />
              ))}
            </div>
          </Card>

          {/* Collection Progress */}
          <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="font-semibold mb-4">Распределение по типам</h2>
            <div className="space-y-4">
              {Object.entries(stats.byType).map(([type, count]) => {
                const percentage = (count / stats.totalItems) * 100;
                const typeLabels: Record<string, string> = {
                  vinyl: 'Винил',
                  cd: 'CD',
                  tshirt: 'Футболки',
                  hoodie: 'Худи',
                  poster: 'Постеры',
                  accessory: 'Аксессуары',
                };
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{typeLabels[type] || type}</span>
                      <span className="text-muted-foreground">
                        {count} ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

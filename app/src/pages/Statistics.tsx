import { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Disc,
  DollarSign,
  PieChart,
  BarChart3,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { StatCard } from '@/components/ui-custom/StatCard';
import { useAppStore } from '@/stores/appStore';
import { formatCurrency, formatNumber } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { getArtistById } from '@/data/dataLoader';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export function Statistics() {
  const { getCollectionStats, collection } = useAppStore();
  const stats = getCollectionStats();
  const [selectedSegment, setSelectedSegment] = useState<{ name: string; value: number } | null>(null);

  const typeData = useMemo(() => {
    const labels: Record<string, string> = {
      vinyl: 'Винил',
      cd: 'CD',
      tshirt: 'Футболки',
      hoodie: 'Худи',
      poster: 'Постеры',
      accessory: 'Аксессуары',
    };
    return Object.entries(stats.byType).map(([type, count]) => ({
      name: labels[type] || type,
      value: count,
      type,
    }));
  }, [stats.byType]);

  const monthlyData = useMemo(() => {
    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    return months.map((month) => ({
      month,
      spent: Math.random() * 500 + 100,
      value: Math.random() * 600 + 150,
    }));
  }, []);

  const artistData = useMemo(() => {
    return Object.entries(stats.byArtist)
      .map(([artistId, count]) => {
        const artist = getArtistById(artistId);
        return {
          name: artist?.name || artistId,
          items: count,
        };
      })
      .sort((a, b) => b.items - a.items)
      .slice(0, 6);
  }, [stats.byArtist]);

  const handlePieClick = (data: any) => {
    if (data && data.name) {
      setSelectedSegment({ name: data.name, value: data.value });
    }
  };

  const selectedTypeItems = selectedSegment
    ? collection.filter((item) => {
        const typeMap: Record<string, string> = {
          'Винил': 'vinyl',
          'CD': 'cd',
          'Футболки': 'tshirt',
          'Худи': 'hoodie',
          'Постеры': 'poster',
          'Аксессуары': 'accessory',
        };
        return item.type === typeMap[selectedSegment.name];
      })
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Статистика коллекции</h1>
        <p className="text-muted-foreground mt-1">
          Анализируйте свою коллекцию и отслеживайте динамику
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Всего предметов"
          value={formatNumber(stats.totalItems)}
          subtitle={`+${stats.recentAdditions} за последний месяц`}
          icon={<Disc className="h-5 w-5" />}
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
          icon={stats.profitLoss >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="overview" className="gap-2">
            <PieChart className="h-4 w-4" />
            Обзор
          </TabsTrigger>
          <TabsTrigger value="dynamics" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Динамика
          </TabsTrigger>
          <TabsTrigger value="artists" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            По исполнителям
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Type Distribution */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-2">Распределение по типам</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Нажмите на сегмент для просмотра деталей
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={typeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                      onClick={handlePieClick}
                      className="cursor-pointer"
                    >
                      {typeData.map((_entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]} 
                          stroke={selectedSegment?.name === _entry.name ? '#fff' : 'none'}
                          strokeWidth={selectedSegment?.name === _entry.name ? 3 : 0}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      itemStyle={{
                        color: 'hsl(var(--foreground))',
                      }}
                      labelStyle={{
                        color: 'hsl(var(--foreground))',
                      }}
                    />
                    <Legend />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
              
              {/* Selected segment details */}
              {selectedSegment && (
                <div className="mt-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {selectedSegment.name}
                    </h4>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedSegment(null)}>
                      Закрыть
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Количество: {selectedSegment.value} предметов
                  </p>
                  {selectedTypeItems.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Предметы:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTypeItems.slice(0, 5).map((item) => (
                          <span key={item.id} className="text-xs px-2 py-1 rounded bg-background">
                            {item.title}
                          </span>
                        ))}
                        {selectedTypeItems.length > 5 && (
                          <span className="text-xs px-2 py-1 rounded bg-background text-muted-foreground">
                            +{selectedTypeItems.length - 5} ещё
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Type Breakdown */}
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
              <h3 className="text-lg font-semibold mb-6">Детализация по типам</h3>
              <div className="space-y-4">
                {typeData.map((type, idx) => {
                  const percentage = (type.value / stats.totalItems) * 100;
                  const isSelected = selectedSegment?.name === type.name;
                  return (
                    <div 
                      key={type.name} 
                      className={cn(
                        "space-y-2 p-2 rounded-lg cursor-pointer transition-colors",
                        isSelected && "bg-primary/10"
                      )}
                      onClick={() => setSelectedSegment({ name: type.name, value: type.value })}
                    >
                      <div className="flex justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                          />
                          {type.name}
                        </span>
                        <span className="text-muted-foreground">
                          {type.value} ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                      <Progress
                        value={percentage}
                        className="h-2"
                        style={{
                          backgroundColor: `${COLORS[idx % COLORS.length]}20`,
                        }}
                      />
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dynamics" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-6">Динамика стоимости коллекции</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="spent"
                    name="Потрачено"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: '#8b5cf6' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Текущая стоимость"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="artists" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="text-lg font-semibold mb-6">Предметы по исполнителям</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={artistData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="items" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

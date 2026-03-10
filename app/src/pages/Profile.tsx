import { useState } from 'react';
import {
  Star,
  Calendar,
  Disc,
  Heart,
  TrendingUp,
  Settings,
  Camera,
  Edit3,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { useAppStore } from '@/stores/appStore';
import { formatCurrency, formatDate } from '@/utils/formatters';

export function Profile() {
  const { currentUser, getCollectionStats } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    bio: 'Коллекционер музыкального мерча с 2020 года. Люблю винил и редкие издания.',
    location: 'Москва, Россия',
    website: '',
  });

  const stats = getCollectionStats();
  const joinedDate = currentUser?.joinedAt 
    ? formatDate(currentUser.joinedAt) 
    : 'Неизвестно';

  const handleSave = () => {
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Профиль</h1>
        <p className="text-muted-foreground mt-1">
          Управляйте своей информацией и настройками
        </p>
      </div>

      {/* Profile Card */}
      <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-32 w-32">
              <AvatarImage src={currentUser?.avatar} />
              <AvatarFallback className="text-4xl">{currentUser?.name?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <Button 
              size="icon" 
              className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
                  {currentUser?.role === 'verified_seller' && (
                    <Badge className="bg-amber-500/20 text-amber-400">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Проверенный
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground">{currentUser?.email}</p>
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              >
                {isEditing ? (
                  <>Сохранить</>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Редактировать
                  </>
                )}
              </Button>
            </div>

            {isEditing ? (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Имя</Label>
                    <Input 
                      value={profile.name} 
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={profile.email} 
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>О себе</Label>
                  <Input 
                    value={profile.bio} 
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Локация</Label>
                    <Input 
                      value={profile.location} 
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Сайт</Label>
                    <Input 
                      value={profile.website} 
                      onChange={(e) => setProfile({ ...profile, website: e.target.value })}
                      placeholder="https://"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 space-y-2">
                <p className="text-sm">{profile.bio}</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    На платформе с {joinedDate}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Disc className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{stats.totalItems}</p>
              <p className="text-sm text-muted-foreground">Предметов</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(stats.currentValue)}</p>
              <p className="text-sm text-muted-foreground">Стоимость</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser?.rating || 0}</p>
              <p className="text-sm text-muted-foreground">Рейтинг</p>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-rose-500/10 text-rose-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{currentUser?.reviewCount || 0}</p>
              <p className="text-sm text-muted-foreground">Сделок</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="collection" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="collection" className="gap-2">
            <Disc className="h-4 w-4" />
            Коллекция
          </TabsTrigger>
          <TabsTrigger value="activity" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Активность
          </TabsTrigger>
          <TabsTrigger value="settings" className="gap-2">
            <Settings className="h-4 w-4" />
            Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-4">Распределение по типам</h3>
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
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-4">Недавняя активность</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-primary/10">
                  <Disc className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Добавлен новый предмет в коллекцию</p>
                  <p className="text-xs text-muted-foreground">2 часа назад</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-amber-500/10">
                  <Star className="h-4 w-4 text-amber-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Получен отзыв от Марии Винил</p>
                  <p className="text-xs text-muted-foreground">Вчера</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                <div className="p-2 rounded-full bg-emerald-500/10">
                  <TrendingUp className="h-4 w-4 text-emerald-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">Цена на винил выросла на 15%</p>
                  <p className="text-xs text-muted-foreground">3 дня назад</p>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h3 className="font-semibold mb-4">Уведомления</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Уведомления о ценах</p>
                  <p className="text-sm text-muted-foreground">Получать уведомления о снижении цен</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Новые релизы</p>
                  <p className="text-sm text-muted-foreground">Уведомления о новых альбомах</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Сообщения</p>
                  <p className="text-sm text-muted-foreground">Уведомления о новых сообщениях</p>
                </div>
                <input type="checkbox" defaultChecked className="rounded" />
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

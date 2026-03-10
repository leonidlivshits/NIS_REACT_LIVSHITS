import { useState, useEffect, useMemo } from 'react';
import {
  Bell,
  Calendar,
  TrendingDown,
  Trash2,
  ExternalLink,
  Plus,
  Search,
  Heart,
  Share2,
  List,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAppStore } from '@/stores/appStore';
import { mockWishlist, mockArtists } from '@/data/mockData';
import { formatCurrency, formatDate, getMerchTypeLabel, generateId } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { MerchType, NotificationType } from '@/types';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/useUIStore';
import { useUrlSyncWishlist } from '@/hooks/useUrlSyncWishlist';

export function Wishlist() {
  useUrlSyncWishlist();

  const {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    updateWishlistItem,
    addNotification,
    currentUser,
  } = useAppStore();

  const searchWishlist = useUIStore((s) => s.searchWishlist);
  const setSearchWishlist = useUIStore((s) => s.setSearchWishlist);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState<number>(1);
  const pageSize = 12;

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      const v = p.get('view');
      const pg = p.get('page');
      if (v === 'grid' || v === 'list') setViewMode(v);
      if (pg) {
        const n = Number(pg);
        if (!Number.isNaN(n) && n > 0) setPage(n);
      }
    } catch {
    }
  }, []);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (viewMode) p.set('view', viewMode);
      else p.delete('view');
      const path = window.location.pathname + (p.toString() ? `?${p.toString()}` : '');
      window.history.replaceState({}, '', path);
    } catch {}
  }, [viewMode]);

  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (page && page > 1) p.set('page', String(page));
      else p.delete('page');
      const path = window.location.pathname + (p.toString() ? `?${p.toString()}` : '');
      window.history.replaceState({}, '', path);
    } catch {}
  }, [page]);

  const [newItem, setNewItem] = useState({
    title: '',
    artistId: '',
    type: MerchType.VINYL,
    targetPrice: '',
    releaseDate: '',
    notifyOnRelease: true,
    notifyOnPriceDrop: true,
  });

  useEffect(() => {
    if (wishlist.length === 0 && mockWishlist && mockWishlist.length > 0) {
      mockWishlist.forEach((item) => addToWishlist(item));
    }
  }, []);

  const filteredItems = useMemo(() => {
    const q = (searchWishlist || '').trim().toLowerCase();
    return wishlist.filter((item) => {
      if (!q) return true;
      const artistName = typeof item.artist === 'string' ? item.artist : item.artist?.name ?? '';
      return (
        item.title?.toLowerCase().includes(q) ||
        artistName.toLowerCase().includes(q)
      );
    });
  }, [wishlist, searchWishlist]);

  const paginatedItems = useMemo(() => {
    if (viewMode === 'list') return filteredItems;
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, viewMode]);


  const upcomingReleases = useMemo(() => filteredItems.filter((i) => i.releaseDate), [filteredItems]);
  const priceTracking = useMemo(() => filteredItems.filter((i) => i.targetPrice), [filteredItems]);
  const totalTarget = useMemo(
    () => priceTracking.reduce((sum, it) => sum + (it.targetPrice ?? 0), 0),
    [priceTracking]
  );

  const handleAddItem = () => {
    if (!newItem.title.trim() || !newItem.artistId) {
      alert('Пожалуйста, заполните название и выберите исполнителя');
      return;
    }

    const artist = mockArtists.find((a) => a.id === newItem.artistId);

    const item = {
      id: `wish-${generateId()}`,
      title: newItem.title,
      artistId: newItem.artistId,
      artist: artist,
      type: newItem.type,
      targetPrice: newItem.targetPrice ? Number(newItem.targetPrice) : undefined,
      image: 'https://images.unsplash.com/photo-1619983081563-430f63602796?w=600&h=600&fit=crop',
      releaseDate: newItem.releaseDate ? new Date(newItem.releaseDate) : undefined,
      notifyOnRelease: newItem.notifyOnRelease,
      notifyOnPriceDrop: newItem.notifyOnPriceDrop,
    };

    addToWishlist(item as any);

    if (newItem.notifyOnRelease && newItem.releaseDate) {
      addNotification({
        id: `notif-${generateId()}`,
        userId: currentUser?.id || '1',
        type: NotificationType.NEW_RELEASE,
        title: 'Добавлено в желаемое',
        message: `Вы будете уведомлены о релизе "${newItem.title}"`,
        read: false,
        createdAt: new Date(),
        data: { wishlistId: item.id },
      });
      toast.success('Вы будете уведомлены о релизе!');
    }

    setIsAddDialogOpen(false);
    setNewItem({
      title: '',
      artistId: '',
      type: MerchType.VINYL,
      targetPrice: '',
      releaseDate: '',
      notifyOnRelease: true,
      notifyOnPriceDrop: true,
    });
  };

  const handleToggleNotify = (id: string, field: 'notifyOnRelease' | 'notifyOnPriceDrop', value: boolean) => {
    updateWishlistItem(id, { [field]: value });

    const item = wishlist.find((w) => w.id === id);
    if (item) {
      if (field === 'notifyOnRelease' && value) {
        addNotification({
          id: `notif-${generateId()}`,
          userId: currentUser?.id || '1',
          type: NotificationType.NEW_RELEASE,
          title: 'Уведомление включено',
          message: `Вы будете уведомлены о релизе "${item.title}"`,
          read: false,
          createdAt: new Date(),
        });
        toast.success('Уведомление о релизе включено!');
      } else if (field === 'notifyOnPriceDrop' && value) {
        addNotification({
          id: `notif-${generateId()}`,
          userId: currentUser?.id || '1',
          type: NotificationType.PRICE_DROP,
          title: 'Отслеживание цены',
          message: `Вы будете уведомлены о снижении цены на "${item.title}"`,
          read: false,
          createdAt: new Date(),
        });
        toast.success('Отслеживание цены включено!');
      }
    }
  };

  const handleFindOnMarketplaces = (item: any) => {
    const searchQuery = encodeURIComponent(`${item.title} ${item.artist?.name || ''}`);
    const urls = [
      { name: 'Discogs', url: `https://www.discogs.com/search/?q=${searchQuery}&type=release` },
      { name: 'eBay', url: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}` },
      { name: 'Avito', url: `https://www.avito.ru/all/kollektsionirovanie?q=${searchQuery}` },
    ];

    navigator.clipboard.writeText(urls[0].url).then(() => {
      toast.success('Ссылка скопирована в буфер обмена!');
    }).catch(() => {
      toast.error('Не удалось скопировать ссылку');
    });

    window.open(urls[0].url, '_blank');
  };

  const handleShareCurrent = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Желаемое</h1>
          <p className="text-muted-foreground mt-1">
            {wishlist.length} предметов в списке ожидания
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            aria-label="Toggle view"
            title={viewMode === 'grid' ? 'Показать список' : 'Показать сетку'}
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <List className="h-4 w-4" />
            ) : (
              <Grid3X3 className="h-4 w-4" />
            )}
          </Button>

          <Button onClick={handleShareCurrent} variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" /> Поделиться
          </Button>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Добавить в желаемое
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Добавить в желаемое</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название *</Label>
                  <Input
                    id="title"
                    placeholder="Например: ACCEPT ALL COOKIES - Vinyl"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist">Исполнитель *</Label>
                  <Select value={newItem.artistId} onValueChange={(value) => setNewItem({ ...newItem, artistId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите исполнителя" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockArtists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Тип</Label>
                    <Select value={newItem.type} onValueChange={(value: any) => setNewItem({ ...newItem, type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(MerchType).map((t) => (
                          <SelectItem key={t} value={t}>{getMerchTypeLabel(t)}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Целевая цена (₽)</Label>
                    <Input
                      type="number"
                      placeholder="4000"
                      value={newItem.targetPrice}
                      onChange={(e) => setNewItem({ ...newItem, targetPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Дата релиза (если известна)</Label>
                  <Input
                    type="date"
                    value={newItem.releaseDate}
                    onChange={(e) => setNewItem({ ...newItem, releaseDate: e.target.value })}
                  />
                </div>

                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Уведомить о релизе</span>
                    </div>
                    <Switch checked={newItem.notifyOnRelease} onCheckedChange={(checked) => setNewItem({ ...newItem, notifyOnRelease: checked })} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Уведомить о снижении цены</span>
                    </div>
                    <Switch checked={newItem.notifyOnPriceDrop} onCheckedChange={(checked) => setNewItem({ ...newItem, notifyOnPriceDrop: checked })} />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Отмена</Button>
                  <Button onClick={handleAddItem}>Добавить</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{upcomingReleases.length}</p>
              <p className="text-sm text-muted-foreground">Ожидаемых релизов</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400">
              <TrendingDown className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{priceTracking.length}</p>
              <p className="text-sm text-muted-foreground">Отслеживаемых цен</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-amber-500/10 text-amber-400">
              <Bell className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold">{formatCurrency(totalTarget)}</p>
              <p className="text-sm text-muted-foreground">Целевая сумма</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Поиск по желаемому..."
          value={searchWishlist}
          onChange={(e) => setSearchWishlist(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Wishlist grid/list */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}>
        {paginatedItems.map((item) => (
          <Card
            key={item.id}
            className={cn(
              'overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300',
              'hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20'
            )}
          >
            <div className="relative aspect-square">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
              <div className="absolute top-3 left-3">
                <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white">
                  {getMerchTypeLabel(item.type)}
                </Badge>
              </div>
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-3 right-3 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeFromWishlist(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{typeof item.artist === 'string' ? item.artist : item.artist?.name}</p>
              </div>

              {item.releaseDate && (
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Релиз: {formatDate(item.releaseDate)}</span>
                </div>
              )}

              {item.targetPrice && (() => {
                const currentPrice = (item as any).currentPrice as number | undefined;

                const progressValue = currentPrice
                  ? Math.min(100, Math.round((currentPrice / (item.targetPrice || 1)) * 100))
                  : 0;

                return (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Целевая цена:</span>
                      <span className="font-medium">{formatCurrency(item.targetPrice)}</span>
                    </div>

                    <Progress value={progressValue} className="h-2" />

                    <p className="text-xs text-muted-foreground">
                      Текущая цена {currentPrice ? `- ${formatCurrency(currentPrice)}` : '- не указана'}
                    </p>
                  </div>
                );
              })()}

              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Уведомить о релизе</span>
                  </div>
                  <Switch checked={item.notifyOnRelease} onCheckedChange={(checked) => handleToggleNotify(item.id, 'notifyOnRelease', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Уведомить о снижении цены</span>
                  </div>
                  <Switch checked={item.notifyOnPriceDrop} onCheckedChange={(checked) => handleToggleNotify(item.id, 'notifyOnPriceDrop', checked)} />
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2" onClick={() => handleFindOnMarketplaces(item)}>
                  <ExternalLink className="h-4 w-4" />
                  Найти на маркетплейсах
                </Button>
                <Button variant="ghost" onClick={() => {
                  const shareUrl = `${window.location.origin}/marketplace?q=${encodeURIComponent(item.title)}`;
                  navigator.clipboard.writeText(shareUrl).then(() => toast.success('Ссылка на поиск скопирована')).catch(() => toast.error('Не удалось скопировать ссылку'));
                }}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Поиск
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pagination controls */}
      {viewMode === 'grid' && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))}>Prev</Button>
          <div className="text-sm">Page {page}</div>
          <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>Next</Button>
        </div>
      )}

      {filteredItems.length === 0 && (
        <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Список желаемого пуст</h3>
          <p className="text-muted-foreground">Добавьте предметы, чтобы отслеживать их цены и релизы</p>
        </Card>
      )}
    </div>
  );
}
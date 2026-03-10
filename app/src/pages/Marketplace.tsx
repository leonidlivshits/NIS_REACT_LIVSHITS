import { useState, useMemo, useEffect } from 'react';
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
  MessageSquare,
  List,
  Grid3X3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/appStore';
import { mockMarketplaceItems, mockArtists, getUserById } from '@/data/dataLoader';
import { formatCurrency, formatRelativeTime } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { NotificationType } from '@/types';
import { toast } from 'sonner';
import { useUIStore } from '@/stores/useUIStore';
import { useUrlSyncMarketplace } from '@/hooks/useUrlSyncMarketplace';
import { PriceComparison } from '@/components/ui-custom/PriceComparison';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Star as StarIcon } from 'lucide-react';

const marketplacePrices = [
  { id: 'p1', marketplace: 'Bandcamp', price: 4500, url: '#', inStock: true },
  { id: 'p2', marketplace: 'Amazon', price: 5200, url: '#', inStock: true },
  { id: 'p3', marketplace: 'Discogs', price: 3800, url: '#', inStock: false },
  { id: 'p4', marketplace: 'eBay', price: 4100, url: '#', inStock: true },
];

export function Marketplace() {
  useUrlSyncMarketplace();

  const searchMarketplace = useUIStore((s) => s.searchMarketplace);
  const setSearchMarketplace = useUIStore((s) => s.setSearchMarketplace);

  const {
    notifications,
    addNotification,
    markNotificationAsRead,
    currentUser,
    marketplaceReviews,
    likeMarketplaceReview,
    hasLikedMarketplaceReview,
    unlikeMarketplaceReview,
  } = useAppStore();

  const priceAlerts = notifications.filter((n) => n.type === NotificationType.PRICE_DROP && !n.read);

  // local component state
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [selectedItemForReviews, setSelectedItemForReviews] = useState<string | null>(null);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [newAlert, setNewAlert] = useState({
    itemName: '',
    artistId: '',
    targetPrice: '',
  });

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

  // keep page in URL
  useEffect(() => {
    try {
      const p = new URLSearchParams(window.location.search);
      if (page && page > 1) p.set('page', String(page));
      else p.delete('page');
      const path = window.location.pathname + (p.toString() ? `?${p.toString()}` : '');
      window.history.replaceState({}, '', path);
    } catch {}
  }, [page]);

  // filtered items by search
  const filteredItems = mockMarketplaceItems.filter(
    (item) =>
      item.title.toLowerCase().includes(searchMarketplace.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchMarketplace.toLowerCase())
  );

  // pagination slice
  const paginatedItems = useMemo(() => {
    if (viewMode === 'list') return filteredItems; // list mode: show all (or you could paginate)
    const start = (page - 1) * pageSize;
    return filteredItems.slice(start, start + pageSize);
  }, [filteredItems, page, viewMode]);

  // reviews for selected item
  const selectedItemReviews = useMemo(() => {
    if (!selectedItemForReviews) return [];
    return marketplaceReviews
      .filter((r) => r.itemId === selectedItemForReviews)
      .map((r) => ({ ...r, author: getUserById(r.authorId) }));
  }, [selectedItemForReviews, marketplaceReviews]);

  const selectedItemData = useMemo(() => {
    if (!selectedItemForReviews) return null;
    return mockMarketplaceItems.find((i) => i.id === selectedItemForReviews);
  }, [selectedItemForReviews]);

  const handleCreateAlert = () => {
    if (!newAlert.itemName.trim() || !newAlert.targetPrice) {
      toast.error('Заполните все поля');
      return;
    }

    addNotification({
      id: `alert-${Date.now()}`,
      userId: currentUser?.id || 'user-guest',
      type: NotificationType.PRICE_DROP,
      title: 'Отслеживание цены',
      message: `Вы отслеживаете "${newAlert.itemName}". Целевая цена: ${formatCurrency(Number(newAlert.targetPrice))}`,
      read: false,
      createdAt: new Date(),
      data: {
        itemName: newAlert.itemName,
        artistId: newAlert.artistId,
        targetPrice: Number(newAlert.targetPrice),
      },
    });

    toast.success('Уведомление о цене создано!');
    setIsAlertDialogOpen(false);
    setNewAlert({ itemName: '', artistId: '', targetPrice: '' });
  };

  const handleSetPriceAlert = (item: typeof mockMarketplaceItems[0]) => {
    addNotification({
      id: `alert-${Date.now()}`,
      userId: currentUser?.id || 'user-guest',
      type: NotificationType.PRICE_DROP,
      title: 'Цена отслеживается',
      message: `Вы будете уведомлены о снижении цены на "${item.title}"`,
      read: false,
      createdAt: new Date(),
      data: {
        itemName: item.title,
        artistId: item.artistId,
        currentPrice: item.lowestPrice,
      },
    });
    toast.success('Вы будете уведомлены о снижении цены!');
  };

  const handleDismissAlert = (notificationId: string) => {
    markNotificationAsRead(notificationId);
    toast.success('Уведомление отмечено как прочитанное');
  };

  const handleLikeReview = (reviewId: string) => {
    if (!currentUser) return;
    const hasLiked = hasLikedMarketplaceReview(reviewId, currentUser.id);
    if (hasLiked) {
      unlikeMarketplaceReview(reviewId, currentUser.id);
    } else {
      likeMarketplaceReview(reviewId, currentUser.id);
    }
  };

  const handleShareCurrent = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Ссылка скопирована в буфер обмена');
    } catch {
      toast.error('Не удалось скопировать ссылку');
    }
  };

  const handleFindOnMarketplaces = (item: any) => {
    const searchQuery = encodeURIComponent(`${item.title} ${item.artist || ''}`);
    const urls = [
      { name: 'Discogs', url: `https://www.discogs.com/search/?q=${searchQuery}&type=release` },
      { name: 'eBay', url: `https://www.ebay.com/sch/i.html?_nkw=${searchQuery}` },
    ];
    navigator.clipboard.writeText(urls[0].url).then(
      () => toast.success('Ссылка скопирована в буфер обмена!'),
      () => toast.error('Не удалось скопировать ссылку')
    );
    window.open(urls[0].url, '_blank');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Маркетплейс</h1>
          <p className="text-muted-foreground mt-1">Сравнивайте цены и находите лучшие предложения</p>
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
        </div>
      </div>

      <Tabs defaultValue="deals" className="space-y-6">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="deals">Лучшие предложения</TabsTrigger>
          <TabsTrigger value="compare">Сравнение цен</TabsTrigger>
          <TabsTrigger value="alerts">
            Мои уведомления
            {priceAlerts.length > 0 && (
              <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center p-0 text-xs">
                {priceAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Deals */}
        <TabsContent value="deals" className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или исполнителю..."
              value={searchMarketplace}
              onChange={(e) => setSearchMarketplace(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Items grid / list */}
          <div className={cn(viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4')}>
            {paginatedItems.map((item) => (
              <Card key={item.id} className={cn('overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300', 'hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20')}>
                <div className="relative aspect-square">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 flex gap-2">
                    <Badge className="bg-rose-500 text-white">-{item.discount}%</Badge>
                    {!item.inStock && <Badge variant="secondary" className="bg-black/60 text-white">Нет в наличии</Badge>}
                  </div>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 h-8 w-8 bg-black/60 backdrop-blur-sm hover:bg-black/80"
                    onClick={() => handleSetPriceAlert(item)}
                  >
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <Badge variant="outline" className="mb-2">{item.type}</Badge>
                    <h3 className="font-semibold line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <StarIcon className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="text-sm text-muted-foreground h-auto p-0"
                      onClick={() => setSelectedItemForReviews(item.id)}
                    >
                      ({item.reviews} отзывов)
                    </Button>
                  </div>

                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-2xl font-bold text-primary">{formatCurrency(item.lowestPrice)}</p>
                      <p className="text-sm text-muted-foreground line-through">{formatCurrency(item.originalPrice)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Лучшая цена на</p>
                      <p className="text-sm font-medium">{item.marketplace}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 gap-2" disabled={!item.inStock}>
                      Купить
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
                    >
                      <TrendingDown className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedItem === item.id && <PriceComparison prices={marketplacePrices} className="mt-4" />}

                  <div className="flex gap-2 mt-3">
                    <Button variant="ghost" size="sm" onClick={() => handleFindOnMarketplaces(item)}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Найти на маркетплейсах
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/marketplace?q=${encodeURIComponent(item.title)}`)
                        .then(() => toast.success('Ссылка на поиск скопирована'))
                        .catch(() => toast.error('Не удалось скопировать ссылку'))
                    }}>
                      <MessageSquare className="h-4 w-4 mr-2" /> Поделиться поиском
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {viewMode === 'grid' && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button variant="outline" size="sm" onClick={() => setPage(Math.max(1, page - 1))}>Prev</Button>
              <div className="text-sm">Page {page}</div>
              <Button variant="outline" size="sm" onClick={() => setPage(page + 1)}>Next</Button>
            </div>
          )}
        </TabsContent>

        {/* Compare */}
        <TabsContent value="compare" className="space-y-6">
          <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
            <h2 className="text-xl font-semibold mb-4">Сравнение цен</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <img src="https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=600&fit=crop" alt="Vinyl" className="w-full aspect-square object-cover rounded-lg" />
              </div>
              <PriceComparison prices={marketplacePrices} />
            </div>
          </Card>
        </TabsContent>

        {/* Alerts */}
        <TabsContent value="alerts" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Настройка уведомлений о ценах</h2>
            <Dialog open={isAlertDialogOpen} onOpenChange={setIsAlertDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Новое уведомление
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Создать уведомление о цене</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Название предмета</label>
                    <Input placeholder="Например: Сожги Этот Альбом" value={newAlert.itemName} onChange={(e) => setNewAlert({ ...newAlert, itemName: e.target.value })} />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Исполнитель</label>
                    <select value={newAlert.artistId} onChange={(e) => setNewAlert({ ...newAlert, artistId: e.target.value })} className="w-full rounded border px-2 py-1">
                      <option value="">Не указано</option>
                      {mockArtists.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Целевая цена (₽)</label>
                    <Input type="number" placeholder="4000" value={newAlert.targetPrice} onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })} />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={handleCreateAlert} className="flex-1">Создать уведомление</Button>
                    <Button variant="outline" onClick={() => {
                      setIsAlertDialogOpen(false)
                      setNewAlert({ itemName: '', artistId: '', targetPrice: '' })
                    }}>Отмена</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {priceAlerts.length > 0 ? (
            <div className="space-y-4">
              {priceAlerts.map((alert) => (
                <Card key={alert.id} className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-500/10 text-green-400">
                        <TrendingDown className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-sm text-muted-foreground">{alert.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatRelativeTime(alert.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleDismissAlert(alert.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border/50">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Нет активных уведомлений</h3>
              <p className="text-muted-foreground">Создайте уведомление, чтобы отслеживать снижение цен</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Reviews dialog */}
      <Dialog open={!!selectedItemForReviews} onOpenChange={() => setSelectedItemForReviews(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" /> Отзывы
              {selectedItemData && <span className="text-muted-foreground font-normal"> - {selectedItemData.title}</span>}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="max-h-[60vh]">
            <div className="space-y-4 mt-4">
              {selectedItemReviews.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Пока нет отзывов</p>
              ) : (
                selectedItemReviews.map((review) => {
                  const isLiked = currentUser ? hasLikedMarketplaceReview(review.id, currentUser.id) : false;
                  return (
                    <Card key={review.id} className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.author?.avatar} />
                          <AvatarFallback>{review.author?.name?.[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{review.author?.name}</p>
                              <p className="text-xs text-muted-foreground">{formatRelativeTime(review.createdAt)}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <StarIcon key={i} className={`h-4 w-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-sm">{review.content}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <Button variant="ghost" size="sm" className={`gap-2 ${isLiked ? 'text-rose-400' : ''}`} onClick={() => handleLikeReview(review.id)}>
                              <StarIcon className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                              <span>{review.likes}</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Marketplace;
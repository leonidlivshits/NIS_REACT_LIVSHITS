import { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Grid3X3,
  List,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MerchCard } from '@/components/ui-custom/MerchCard';
import { useAppStore } from '@/stores/appStore';
import { MerchType, MerchCondition } from '@/types';
import { formatCurrency, getMerchTypeLabel, getMerchConditionLabel, generateId } from '@/utils/formatters';
import { cn } from '@/lib/utils';
import { mockArtists } from '@/data/dataLoader';
import { useUIStore } from '@/stores/useUIStore';
import { useUrlSyncCollection } from '@/hooks/useUrlSyncCollection';

export function Collection() {
  useUrlSyncCollection()

  const { collection, addToCollection, removeFromCollection, filter: appFilter, setFilter: setAppFilter, resetFilter: resetAppFilter } = useAppStore();

  const searchCollection = useUIStore((s) => s.searchCollection);
  const setSearchCollection = useUIStore((s) => s.setSearchCollection);
  const uiFilters = useUIStore((s) => s.filters);
  const setUIFilters = useUIStore((s) => s.setFilters);
  const resetUIFilters = useUIStore((s) => s.resetFilters);

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: '',
    artistId: '',
    type: MerchType.VINYL,
    condition: MerchCondition.NEW,
    purchasePrice: '',
    currentPrice: '',
    description: '',
    image: '',
    isLimited: false,
    tags: '',
  });

  useEffect(() => {
    if (uiFilters && Object.keys(uiFilters).length > 0) {
      const toApply: any = {};
      if (uiFilters.type) toApply.type = uiFilters.type;
      if (uiFilters.condition) toApply.condition = uiFilters.condition;
      if (uiFilters.minPrice != null) toApply.minPrice = uiFilters.minPrice;
      if (uiFilters.maxPrice != null) toApply.maxPrice = uiFilters.maxPrice;
      if (uiFilters.sortBy) toApply.sortBy = uiFilters.sortBy;
      if (uiFilters.sortOrder) toApply.sortOrder = uiFilters.sortOrder;

      setAppFilter(toApply);
    }
  }, []);

  const filteredItems = collection.filter((item) => {
    const matchesSearch =
      !searchCollection ||
      item.title.toLowerCase().includes(searchCollection.toLowerCase()) ||
      item.artist?.name?.toLowerCase().includes(searchCollection.toLowerCase());

    const matchesType = !appFilter.type || item.type === appFilter.type;
    const matchesCondition = !appFilter.condition || item.condition === appFilter.condition;

    const matchesMin = appFilter.minPrice == null || (item.currentPrice ?? 0) >= (appFilter.minPrice ?? 0);
    const matchesMax = appFilter.maxPrice == null || (item.currentPrice ?? 0) <= (appFilter.maxPrice ?? Infinity);

    return matchesSearch && matchesType && matchesCondition && matchesMin && matchesMax;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    const dateA = a.purchaseDate instanceof Date ? a.purchaseDate : new Date(a.purchaseDate);
    const dateB = b.purchaseDate instanceof Date ? b.purchaseDate : new Date(b.purchaseDate);

    switch (appFilter.sortBy) {
      case 'price':
        return appFilter.sortOrder === 'asc'
          ? (a.currentPrice ?? 0) - (b.currentPrice ?? 0)
          : (b.currentPrice ?? 0) - (a.currentPrice ?? 0);
      case 'name':
        return appFilter.sortOrder === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      case 'artist':
        return appFilter.sortOrder === 'asc'
          ? (a.artist?.name || '').localeCompare(b.artist?.name || '')
          : (b.artist?.name || '').localeCompare(a.artist?.name || '');
      case 'date':
      default:
        return appFilter.sortOrder === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
    }
  });

  const handleDelete = (_id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот предмет?')) {
      removeFromCollection(_id);
    }
  };

  const handleAddItem = () => {
    if (!newItem.title || !newItem.artistId || !newItem.purchasePrice || !newItem.currentPrice) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    const artist = mockArtists.find((a) => a.id === newItem.artistId);

    const item = {
      id: `coll-${generateId()}`,
      title: newItem.title,
      artistId: newItem.artistId,
      artist: artist,
      type: newItem.type,
      condition: newItem.condition,
      purchasePrice: Number(newItem.purchasePrice),
      currentPrice: Number(newItem.currentPrice),
      purchaseDate: new Date(),
      image: newItem.image || 'https://images.unsplash.com/photo-1603048588665-791ca8aea617?w=600&h=600&fit=crop',
      description: newItem.description,
      isLimited: newItem.isLimited,
      tags: newItem.tags.split(',').map((t) => t.trim()).filter(Boolean),
      marketplace: 'Manual',
    };

    addToCollection(item as any);
    setIsAddDialogOpen(false);
    setNewItem({
      title: '',
      artistId: '',
      type: MerchType.VINYL,
      condition: MerchCondition.NEW,
      purchasePrice: '',
      currentPrice: '',
      description: '',
      image: '',
      isLimited: false,
      tags: '',
    });
  };

  const handleSetType = (value: string) => {
    const type = value === 'all' ? undefined : value;
    setAppFilter({ type });
    setUIFilters({ type });
  };

  const handleSetCondition = (value: string) => {
    const condition = value === 'all' ? undefined : value;
    setAppFilter({ condition });
    setUIFilters({ condition });
  };

  const handleSetSortBy = (value: any) => {
    setAppFilter({ sortBy: value });
    setUIFilters({ sortBy: value });
  };

  const handleSetSortOrder = (order: 'asc' | 'desc') => {
    setAppFilter({ sortOrder: order });
    setUIFilters({ sortOrder: order });
  };

  const handleReset = () => {
    resetAppFilter();
    resetUIFilters();
    setSearchCollection('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Моя коллекция</h1>
          <p className="text-muted-foreground mt-1">
            {collection.length} предметов на сумму{' '}
            {formatCurrency(collection.reduce((sum, item) => sum + (item.currentPrice ?? 0), 0))}
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Добавить предмет
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Добавить новый предмет</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">  {/* form fields ... unchanged */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Название *</Label>
                  <Input
                    id="title"
                    placeholder="Например: Сожги Этот Альбом"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="artist">Исполнитель *</Label>
                  <Select
                    value={newItem.artistId}
                    onValueChange={(value) => setNewItem({ ...newItem, artistId: value })}
                  >
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
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Тип</Label>
                  <Select
                    value={newItem.type}
                    onValueChange={(value: any) => setNewItem({ ...newItem, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MerchType).map((type) => (
                        <SelectItem key={type} value={type}>
                          {getMerchTypeLabel(type)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condition">Состояние</Label>
                  <Select
                    value={newItem.condition}
                    onValueChange={(value: any) => setNewItem({ ...newItem, condition: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(MerchCondition).map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {getMerchConditionLabel(condition)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Цена покупки (₽) *</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    placeholder="3500"
                    value={newItem.purchasePrice}
                    onChange={(e) => setNewItem({ ...newItem, purchasePrice: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPrice">Текущая цена (₽) *</Label>
                  <Input
                    id="currentPrice"
                    type="number"
                    placeholder="5500"
                    value={newItem.currentPrice}
                    onChange={(e) => setNewItem({ ...newItem, currentPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Описание</Label>
                <Textarea
                  id="description"
                  placeholder="Описание предмета..."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Теги (через запятую)</Label>
                <Input
                  id="tags"
                  placeholder="limited, vinyl, signed"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({ ...newItem, tags: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isLimited"
                  checked={newItem.isLimited}
                  onChange={(e) => setNewItem({ ...newItem, isLimited: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="isLimited" className="cursor-pointer">Ограниченный тираж</Label>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Отмена
                </Button>
                <Button onClick={handleAddItem}>
                  Добавить в коллекцию
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm border-border/50">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Поиск по названию или исполнителю..."
              value={searchCollection}
              onChange={(e) => setSearchCollection(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select
              value={appFilter.type || 'all'}
              onValueChange={(value) => handleSetType(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Тип" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все типы</SelectItem>
                {Object.values(MerchType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {getMerchTypeLabel(type)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={appFilter.condition || 'all'}
              onValueChange={(value) => handleSetCondition(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Состояние" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все состояния</SelectItem>
                {Object.values(MerchCondition).map((condition) => (
                  <SelectItem key={condition} value={condition}>
                    {getMerchConditionLabel(condition)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={appFilter.sortBy}
              onValueChange={(value: any) => handleSetSortBy(value)}
            >
              <SelectTrigger className="w-[140px]">
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Сортировка" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">По дате</SelectItem>
                <SelectItem value="price">По цене</SelectItem>
                <SelectItem value="name">По названию</SelectItem>
                <SelectItem value="artist">По исполнителю</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  {appFilter.sortOrder === 'asc' ? (
                    <span className="text-xs">А-Я</span>
                  ) : (
                    <span className="text-xs">Я-А</span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleSetSortOrder('asc')}>
                  По возрастанию
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleSetSortOrder('desc')}>
                  По убыванию
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3X3 className="h-4 w-4" />}
            </Button>

            {(appFilter.type || appFilter.condition || searchCollection) && (
              <Button variant="ghost" size="sm" onClick={handleReset}>
                Сбросить
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters */}
        {(appFilter.type || appFilter.condition) && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">Активные фильтры:</span>
            {appFilter.type && (
              <Badge variant="secondary" className="gap-1">
                {getMerchTypeLabel(appFilter.type)}
                <button onClick={() => { handleSetType('all'); }}>×</button>
              </Badge>
            )}
            {appFilter.condition && (
              <Badge variant="secondary" className="gap-1">
                {getMerchConditionLabel(appFilter.condition)}
                <button onClick={() => { handleSetCondition('all'); }}>×</button>
              </Badge>
            )}
          </div>
        )}
      </Card>

      {/* Items Grid/List */}
      {sortedItems.length > 0 ? (
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          )}
        >
          {sortedItems.map((item) => (
            <MerchCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center bg-card/50 backdrop-blur-sm border-border/50">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Ничего не найдено</h3>
          <p className="text-muted-foreground">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </Card>
      )}
    </div>
  );
}
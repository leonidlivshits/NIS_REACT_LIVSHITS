import { TrendingUp, TrendingDown, Package, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MerchItem } from '@/types';
import {
  formatCurrency,
  getMerchTypeLabel,
  getMerchConditionLabel,
  getConditionColor,
} from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface MerchCardProps {
  item: MerchItem;
  onEdit?: (item: MerchItem) => void;
  onDelete?: (id: string) => void;
  onAddToWishlist?: (item: MerchItem) => void;
  className?: string;
}

export function MerchCard({
  item,
  onEdit,
  onDelete,
  onAddToWishlist,
  className,
}: MerchCardProps) {
  const priceChange = item.currentPrice - item.purchasePrice;
  const priceChangePercent = (priceChange / item.purchasePrice) * 100;
  const isPriceUp = priceChange > 0;

  return (
    <Card
      className={cn(
        'group overflow-hidden bg-card/50 backdrop-blur-sm border-border/50 transition-all duration-300',
        'hover:shadow-xl hover:shadow-primary/5 hover:border-primary/20',
        className
      )}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-black/60 backdrop-blur-sm text-white">
            {getMerchTypeLabel(item.type)}
          </Badge>
          {item.isLimited && (
            <Badge className="bg-amber-500/80 text-white">
              Limited
            </Badge>
          )}
        </div>

        {/* Actions */}
        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 bg-black/60 backdrop-blur-sm hover:bg-black/80"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onEdit && (
                <DropdownMenuItem onClick={() => onEdit(item)}>Редактировать</DropdownMenuItem>
              )}
              {onAddToWishlist && (
                <DropdownMenuItem onClick={() => onAddToWishlist(item)}>
                  В желаемое
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem className="text-destructive" onClick={() => onDelete(item.id)}>
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Condition Badge */}
        <div className="absolute bottom-3 left-3">
          <Badge variant="outline" className={cn('backdrop-blur-sm', getConditionColor(item.condition))}>
            <Package className="h-3 w-3 mr-1" />
            {getMerchConditionLabel(item.condition)}
          </Badge>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
          <p className="text-sm text-muted-foreground">{item.artist?.name || 'Unknown Artist'}</p>
        </div>

        {item.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
        )}

        <div className="flex items-end justify-between pt-2">
          <div className="space-y-1">
            <p className="text-lg font-bold">{formatCurrency(item.currentPrice)}</p>
            <p className="text-xs text-muted-foreground">
              Куплено за {formatCurrency(item.purchasePrice)}
            </p>
          </div>

          <div
            className={cn(
              'flex items-center gap-1 text-sm font-medium',
              isPriceUp ? 'text-emerald-400' : priceChange < 0 ? 'text-rose-400' : 'text-gray-400'
            )}
          >
            {isPriceUp ? (
              <TrendingUp className="h-4 w-4" />
            ) : priceChange < 0 ? (
              <TrendingDown className="h-4 w-4" />
            ) : null}
            <span>
              {priceChange >= 0 ? '+' : ''}
              {priceChangePercent.toFixed(1)}%
            </span>
          </div>
        </div>

        {item.tags && item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-2">
            {item.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

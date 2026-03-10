import { ExternalLink, Check, X } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface MarketplacePrice {
  marketplace: string;
  price: number;
  url: string;
  inStock: boolean;
}

interface PriceComparisonProps {
  prices: MarketplacePrice[];
  className?: string;
}

export function PriceComparison({ prices, className }: PriceComparisonProps) {
  const sortedPrices = [...prices].sort((a, b) => a.price - b.price);

  return (
    <Card className={cn('p-4 bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <h3 className="font-semibold mb-4">Сравнение цен</h3>
      <div className="space-y-3">
        {sortedPrices.map((item, index) => (
          <div
            key={item.marketplace}
            className={cn(
              'flex items-center justify-between p-3 rounded-lg transition-colors',
              index === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30',
              !item.inStock && 'opacity-50'
            )}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center font-bold text-sm">
                {item.marketplace[0]}
              </div>
              <div>
                <p className="font-medium">{item.marketplace}</p>
                <div className="flex items-center gap-2">
                  {item.inStock ? (
                    <Badge variant="outline" className="text-xs bg-green-500/10 text-green-400 border-green-500/20">
                      <Check className="h-3 w-3 mr-1" />
                      В наличии
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-xs bg-red-500/10 text-red-400 border-red-500/20">
                      <X className="h-3 w-3 mr-1" />
                      Нет в наличии
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className={cn('font-bold', index === 0 && 'text-primary')}>
                  {formatCurrency(item.price)}
                </p>
                {index === 0 && <p className="text-xs text-primary">Лучшая цена</p>}
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => window.open(item.url, '_blank')}
                disabled={!item.inStock}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

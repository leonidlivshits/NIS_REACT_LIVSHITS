import { Check, X, ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatRelativeTime, getMerchTypeLabel, getMerchConditionLabel } from '@/utils/formatters';
import type { TradeOffer } from '@/types';

interface TradeOfferCardProps {
  offer: TradeOffer;
  onAccept: () => void;
  onDecline: () => void;
  onUserClick?: (userId: string) => void;
}

export function TradeOfferCard({ offer, onAccept, onDecline, onUserClick }: TradeOfferCardProps) {
  return (
    <Card className="p-5 bg-card/50 backdrop-blur-sm border-border/50">
      <div className="flex items-start gap-4">
        <Avatar 
          className="h-12 w-12 cursor-pointer hover:ring-2 ring-primary transition-all"
          onClick={() => onUserClick?.(offer.fromUserId)}
        >
          <AvatarImage src={offer.fromUser?.avatar} />
          <AvatarFallback>{offer.fromUser?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <div className="flex items-center gap-2">
                <span 
                  className="font-semibold cursor-pointer hover:text-primary transition-colors"
                  onClick={() => onUserClick?.(offer.fromUserId)}
                >
                  {offer.fromUser?.name}
                </span>
                <Badge variant="secondary" className="text-xs">
                  Предложение обмена
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(offer.createdAt)}
              </p>
            </div>
          </div>

          {offer.message && (
            <p className="text-sm text-muted-foreground mt-2 bg-muted/50 p-3 rounded-lg">
              "{offer.message}"
            </p>
          )}

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            {/* Offered Items */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Предлагает:</p>
              {offer.offeredItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getMerchTypeLabel(item.type)}</span>
                      <span>•</span>
                      <span>{getMerchConditionLabel(item.condition)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Arrow */}
            <div className="hidden md:flex items-center justify-center">
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
            </div>

            {/* Requested Items */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Хочет получить:</p>
              {offer.requestedItems?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{getMerchTypeLabel(item.type)}</span>
                      <span>•</span>
                      <span>{getMerchConditionLabel(item.condition)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              variant="default"
              size="sm"
              className="gap-2"
              onClick={onAccept}
            >
              <Check className="h-4 w-4" />
              Принять
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={onDecline}
            >
              <X className="h-4 w-4" />
              Отклонить
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

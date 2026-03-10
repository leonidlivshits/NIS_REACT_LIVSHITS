import { Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Discussion } from '@/types';
import { formatRelativeTime, truncateText } from '@/utils/formatters';
import { cn } from '@/lib/utils';

interface DiscussionCardProps {
  discussion: Discussion;
  onLike?: (id: string) => void;
  onReply?: (id: string) => void;
  onShare?: (id: string) => void;
  className?: string;
}

export function DiscussionCard({
  discussion,
  onLike,
  onReply,
  onShare,
  className,
}: DiscussionCardProps) {
  return (
    <Card className={cn('p-5 bg-card/50 backdrop-blur-sm border-border/50', className)}>
      <div className="flex items-start gap-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={discussion.author?.avatar} />
          <AvatarFallback>{discussion.author?.name?.[0] || 'U'}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{discussion.author?.name}</span>
                {discussion.author?.role === 'verified_seller' && (
                  <Badge variant="secondary" className="text-xs bg-amber-500/20 text-amber-400">
                    Проверенный
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                {formatRelativeTime(discussion.createdAt)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Пожаловаться</DropdownMenuItem>
                <DropdownMenuItem>Скрыть</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <h3 className="font-semibold mt-2">{discussion.title}</h3>
          <p className="text-muted-foreground mt-1 text-sm">
            {truncateText(discussion.content, 200)}
          </p>

          {discussion.tags && discussion.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {discussion.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4 mt-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hover:text-rose-400"
              onClick={() => onLike?.(discussion.id)}
            >
              <Heart className="h-4 w-4" />
              <span>{discussion.likes}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => onReply?.(discussion.id)}
            >
              <MessageCircle className="h-4 w-4" />
              <span>{discussion.replies}</span>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground"
              onClick={() => onShare?.(discussion.id)}
            >
              <Share2 className="h-4 w-4" />
              <span>Поделиться</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

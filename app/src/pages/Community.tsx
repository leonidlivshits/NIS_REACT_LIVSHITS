import { useState, useMemo, useEffect } from 'react';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Filter,
  Plus,
  Send,
  X,
  CornerDownRight,
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAppStore } from '@/stores/appStore';
import { mockArtists } from '@/data/dataLoader';
import {
  formatRelativeTime,
  truncateText,
  generateId,
} from '@/utils/formatters';
import { toast } from 'sonner';
import type { Discussion, Comment } from '@/types';
import { TradeOfferCard } from '@/components/ui-custom/TradeOfferCard';

interface CommunityProps {
  onPageChange?: (page: string, userId?: string) => void;
}

export function Community({ onPageChange }: CommunityProps) {
  const {
    currentUser,
    discussions,
    comments,
    tradeOffers,
    addDiscussion,
    addComment,
    likeDiscussion,
    unlikeDiscussion,
    hasLikedDiscussion,
    likeComment,
    unlikeComment,
    hasLikedComment,
    hideDiscussion,
    reportDiscussion,
    getFilteredDiscussions,
    acceptTradeOffer,
    declineTradeOffer,
  } = useAppStore();

  const [activeFilter, setActiveFilter] = useState<string>(() => {
    try {
      return localStorage.getItem('community-activeFilter') || 'all';
    } catch {
      return 'all';
    }
  });
  const [selectedTag, setSelectedTag] = useState<string>(() => {
    try {
      return localStorage.getItem('community-selectedTag') || 'all';
    } catch {
      return 'all';
    }
  });
  const [isNewDiscussionOpen, setIsNewDiscussionOpen] = useState(false);
  const [expandedDiscussion, setExpandedDiscussion] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<{ commentId: string; authorName: string } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [newDiscussion, setNewDiscussion] = useState({
    title: '',
    content: '',
    artistId: 'none',
    tags: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem('community-activeFilter', activeFilter);
    } catch {}
  }, [activeFilter]);

  useEffect(() => {
    try {
      localStorage.setItem('community-selectedTag', selectedTag);
    } catch {}
  }, [selectedTag]);

  // Get all unique tags from discussions
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    discussions.forEach((d) => d.tags?.forEach((t) => tags.add(t)));
    return Array.from(tags).slice(0, 20);
  }, [discussions]);

  // Filter discussions
  const filteredDiscussions = useMemo(() => {
    let filtered = getFilteredDiscussions(activeFilter, selectedTag === 'all' ? undefined : selectedTag);
    return filtered;
  }, [discussions, activeFilter, selectedTag, getFilteredDiscussions]);

  // Get pending trade offers for current user
  const pendingTradeOffers = useMemo(() => {
    return tradeOffers.filter(
      (t) => t.toUserId === currentUser?.id && t.status === 'pending'
    );
  }, [tradeOffers, currentUser]);

  // Get comments for a discussion
  const getDiscussionComments = (discussionId: string) => {
    return comments
      .filter((c) => c.discussionId === discussionId)
      .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  };

  // Handle new discussion submit
  const handleSubmitDiscussion = () => {
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast.error('Заполните заголовок и содержание');
      return;
    }

    const discussion: Discussion = {
      id: `disc-${generateId()}`,
      title: newDiscussion.title,
      content: newDiscussion.content,
      authorId: currentUser?.id || '',
      artistId: newDiscussion.artistId === 'none' ? undefined : newDiscussion.artistId,
      tags: newDiscussion.tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      likes: 0,
      likedBy: [],
      replies: 0,
      createdAt: new Date(),
    };

    addDiscussion(discussion);
    setNewDiscussion({ title: '', content: '', artistId: 'none', tags: '' });
    setIsNewDiscussionOpen(false);
    toast.success('Обсуждение создано!');
  };

  // Handle like discussion
  const handleLikeDiscussion = (id: string) => {
    if (!currentUser) return;
    const hasLiked = hasLikedDiscussion(id, currentUser.id);
    if (hasLiked) {
      unlikeDiscussion(id, currentUser.id);
    } else {
      likeDiscussion(id, currentUser.id);
    }
  };

  // Handle like comment
  const handleLikeComment = (id: string) => {
    if (!currentUser) return;
    const hasLiked = hasLikedComment(id, currentUser.id);
    if (hasLiked) {
      unlikeComment(id, currentUser.id);
    } else {
      likeComment(id, currentUser.id);
    }
  };

  // Handle add comment
  const handleAddComment = (discussionId: string) => {
    if (!newComment.trim() || !currentUser) return;

    const comment: Comment = {
      id: `comment-${generateId()}`,
      discussionId,
      authorId: currentUser.id,
      content: replyingTo
        ? `@${replyingTo.authorName} ${newComment}`
        : newComment,
      likes: 0,
      likedBy: [],
      replyTo: replyingTo?.commentId || null,
      createdAt: new Date(),
    };

    addComment(comment);
    setNewComment('');
    setReplyingTo(null);
    toast.success('Комментарий добавлен!');
  };

  // Handle share
  const handleShare = (discussion: Discussion) => {
    navigator.clipboard.writeText(
      `${discussion.title} - ${window.location.origin}/community/${discussion.id}`
    );
    toast.success('Ссылка скопирована!');
  };

  // Handle hide discussion
  const handleHideDiscussion = (id: string) => {
    hideDiscussion(id);
    toast.success('Обсуждение скрыто');
  };

  // Handle report discussion
  const handleReportDiscussion = (id: string) => {
    reportDiscussion(id, 'inappropriate');
    toast.success('Жалоба отправлена');
  };

  // Handle accept trade
  const handleAcceptTrade = (id: string) => {
    acceptTradeOffer(id);
    toast.success('Предложение принято!');
  };

  // Handle decline trade
  const handleDeclineTrade = (id: string) => {
    declineTradeOffer(id);
    toast.success('Предложение отклонено');
  };

  // Navigate to user profile
  const handleUserClick = (userId: string) => {
    if (onPageChange) {
      onPageChange('user-profile', userId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Сообщество</h1>
          <p className="text-muted-foreground mt-1">
            Обсуждения, обмены и коллекционеры
          </p>
        </div>
        <Dialog open={isNewDiscussionOpen} onOpenChange={setIsNewDiscussionOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Новое обсуждение
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Создать обсуждение</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Заголовок</label>
                <Input
                  placeholder="О чем хотите поговорить?"
                  value={newDiscussion.title}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, title: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Содержание</label>
                <Textarea
                  placeholder="Расскажите подробнее..."
                  rows={4}
                  value={newDiscussion.content}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, content: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Исполнитель (опционально)</label>
                <Select
                  value={newDiscussion.artistId}
                  onValueChange={(value) =>
                    setNewDiscussion({ ...newDiscussion, artistId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите исполнителя" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Не выбрано</SelectItem>
                    {mockArtists.map((artist) => (
                      <SelectItem key={artist.id} value={artist.id}>
                        {artist.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Теги (через запятую)</label>
                <Input
                  placeholder="концерт, винил, обмен..."
                  value={newDiscussion.tags}
                  onChange={(e) =>
                    setNewDiscussion({ ...newDiscussion, tags: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleSubmitDiscussion} className="w-full">
                Опубликовать
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="discussions" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="discussions">Обсуждения</TabsTrigger>
          <TabsTrigger value="trades">
            Обмены
            {pendingTradeOffers.length > 0 && (
              <Badge variant="secondary" className="ml-2 bg-primary text-primary-foreground">
                {pendingTradeOffers.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="discussions" className="space-y-6">
          {/* Filters */}
          <Card className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Фильтры:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'Все' },
                  { id: 'popular', label: 'Популярные' },
                  { id: 'recent', label: 'Новые' },
                  { id: 'discussed', label: 'Обсуждаемые' },
                ].map((f) => (
                  <Button
                    key={f.id}
                    variant={activeFilter === f.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveFilter(f.id)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-sm text-muted-foreground">Тег:</span>
                <Select value={selectedTag} onValueChange={setSelectedTag}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Все теги" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Все теги</SelectItem>
                    {allTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>
                        #{tag}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          {/* Discussions List */}
          <div className="space-y-4">
            {filteredDiscussions.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Нет обсуждений по выбранным фильтрам</p>
              </Card>
            ) : (
              filteredDiscussions.map((discussion) => {
                const isExpanded = expandedDiscussion === discussion.id;
                const discussionComments = getDiscussionComments(discussion.id);
                const isLiked = currentUser
                  ? hasLikedDiscussion(discussion.id, currentUser.id)
                  : false;

                return (
                  <Card
                    key={discussion.id}
                    className="p-5 bg-card/50 backdrop-blur-sm border-border/50"
                  >
                    <div className="flex items-start gap-4">
                      <Avatar 
                        className="h-10 w-10 cursor-pointer hover:ring-2 ring-primary transition-all"
                        onClick={() => handleUserClick(discussion.authorId)}
                      >
                        <AvatarImage src={discussion.author?.avatar} />
                        <AvatarFallback>
                          {discussion.author?.name?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span 
                                className="font-semibold cursor-pointer hover:text-primary transition-colors"
                                onClick={() => handleUserClick(discussion.authorId)}
                              >
                                {discussion.author?.name}
                              </span>
                              {discussion.author?.role === 'verified_seller' && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-amber-500/20 text-amber-400"
                                >
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
                              <DropdownMenuItem
                                onClick={() => handleReportDiscussion(discussion.id)}
                              >
                                Пожаловаться
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleHideDiscussion(discussion.id)}
                              >
                                Скрыть
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <h3 className="font-semibold mt-2">{discussion.title}</h3>
                        <p className="text-muted-foreground mt-1 text-sm">
                          {isExpanded
                            ? discussion.content
                            : truncateText(discussion.content, 200)}
                        </p>

                        {discussion.tags && discussion.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mt-3">
                            {discussion.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="text-xs cursor-pointer hover:bg-primary/10"
                                onClick={() => setSelectedTag(tag)}
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center gap-4 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${isLiked ? 'text-rose-400' : 'text-muted-foreground'}`}
                            onClick={() => handleLikeDiscussion(discussion.id)}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{discussion.likes}</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground"
                            onClick={() =>
                              setExpandedDiscussion(isExpanded ? null : discussion.id)
                            }
                          >
                            <MessageCircle className="h-4 w-4" />
                            <span>{discussion.replies}</span>
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-2 text-muted-foreground"
                            onClick={() => handleShare(discussion)}
                          >
                            <Share2 className="h-4 w-4" />
                            <span>Поделиться</span>
                          </Button>
                        </div>

                        {/* Comments Section */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            <ScrollArea className="max-h-[400px]">
                              <div className="space-y-4">
                                {discussionComments.length === 0 ? (
                                  <p className="text-sm text-muted-foreground text-center py-4">
                                    Пока нет комментариев. Будьте первым!
                                  </p>
                                ) : (
                                  discussionComments.map((comment) => {
                                    const commentLiked = currentUser
                                      ? hasLikedComment(comment.id, currentUser.id)
                                      : false;
                                    const isReply = comment.replyTo;

                                    return (
                                      <div
                                        key={comment.id}
                                        className={`flex gap-3 ${isReply ? 'ml-8' : ''}`}
                                      >
                                        {isReply && (
                                          <CornerDownRight className="h-4 w-4 text-muted-foreground mt-1 -ml-6" />
                                        )}
                                        <Avatar 
                                          className="h-8 w-8 cursor-pointer hover:ring-2 ring-primary transition-all"
                                          onClick={() => handleUserClick(comment.authorId)}
                                        >
                                          <AvatarImage src={comment.author?.avatar} />
                                          <AvatarFallback>
                                            {comment.author?.name?.[0] || 'U'}
                                          </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                          <div className="flex items-center gap-2">
                                            <span 
                                              className="text-sm font-medium cursor-pointer hover:text-primary transition-colors"
                                              onClick={() => handleUserClick(comment.authorId)}
                                            >
                                              {comment.author?.name}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              {formatRelativeTime(comment.createdAt)}
                                            </span>
                                          </div>
                                          <p className="text-sm mt-1">{comment.content}</p>
                                          <div className="flex items-center gap-3 mt-2">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className={`h-7 gap-1 text-xs ${commentLiked ? 'text-rose-400' : 'text-muted-foreground'}`}
                                              onClick={() => handleLikeComment(comment.id)}
                                            >
                                              <Heart className={`h-3 w-3 ${commentLiked ? 'fill-current' : ''}`} />
                                              <span>{comment.likes}</span>
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-7 text-xs text-muted-foreground"
                                              onClick={() =>
                                                setReplyingTo({
                                                  commentId: comment.id,
                                                  authorName: comment.author?.name || '',
                                                })
                                              }
                                            >
                                              Ответить
                                            </Button>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </ScrollArea>

                            {/* Add Comment */}
                            <div className="mt-4 pt-4 border-t border-border/50">
                              {replyingTo && (
                                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                                  <span>Ответ @{replyingTo.authorName}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-5 w-5"
                                    onClick={() => setReplyingTo(null)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              )}
                              <div className="flex gap-2">
                                <Input
                                  placeholder="Написать комментарий..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                      e.preventDefault();
                                      handleAddComment(discussion.id);
                                    }
                                  }}
                                />
                                <Button
                                  size="icon"
                                  onClick={() => handleAddComment(discussion.id)}
                                  disabled={!newComment.trim()}
                                >
                                  <Send className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        </TabsContent>

        <TabsContent value="trades" className="space-y-6">
          <div className="grid gap-4">
            {pendingTradeOffers.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">Нет активных предложений обмена</p>
              </Card>
            ) : (
              pendingTradeOffers.map((offer) => (
                <TradeOfferCard
                  key={offer.id}
                  offer={offer}
                  onAccept={() => handleAcceptTrade(offer.id)}
                  onDecline={() => handleDeclineTrade(offer.id)}
                  onUserClick={handleUserClick}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
import { useMemo, useState } from 'react';
import { ArrowLeft, Star, Calendar, MapPin, Link as LinkIcon, MessageSquare, ThumbsUp } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';

import { getUserById, mockUserReviews, mockCollection, mockArtists } from '@/data/dataLoader';
import { useAppStore } from '@/stores/appStore';
import { formatDate, formatCurrency, getMerchTypeLabel, getMerchConditionLabel } from '@/utils/formatters';
import { toast } from 'sonner';

interface UserProfileProps {
  userId: string;
  onBack?: () => void;
}

export function UserProfile({ userId, onBack }: UserProfileProps) {
  const { currentUser, likeUserReview, hasLikedUserReview, unlikeUserReview } = useAppStore();
  const [activeTab, setActiveTab] = useState('collection');

  const user = useMemo(() => getUserById(userId), [userId]);
  
  const userReviews = useMemo(() => {
    return mockUserReviews
      .filter((r) => r.toUserId === userId)
      .map((r) => ({
        ...r,
        fromUser: getUserById(r.fromUserId),
      }));
  }, [userId]);

  const userCollection = useMemo(() => {
    return mockCollection
      .filter((item) => item.ownerId === userId)
      .map((item) => ({
        ...item,
        artist: mockArtists.find((a) => a.id === item.artistId),
      }));
  }, [userId]);

  const handleLikeReview = (reviewId: string) => {
    if (!currentUser) return;
    const hasLiked = hasLikedUserReview(reviewId, currentUser.id);
    if (hasLiked) {
      unlikeUserReview(reviewId, currentUser.id);
    } else {
      likeUserReview(reviewId, currentUser.id);
    }
  };

  const handleContact = () => {
    toast.success(`Сообщение отправлено ${user?.name}`);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-muted-foreground">Пользователь не найден</p>
        {onBack && (
          <Button onClick={onBack} className="mt-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Назад
          </Button>
        )}
      </div>
    );
  }

  const isCurrentUser = currentUser?.id === userId;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      {onBack && (
        <Button variant="ghost" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Назад
        </Button>
      )}

      {/* Profile Header */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <Avatar className="h-24 w-24 md:h-32 md:w-32">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="text-3xl">{user.name[0]}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge
                    variant={user.role === 'verified_seller' ? 'default' : 'secondary'}
                    className={
                      user.role === 'verified_seller'
                        ? 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30'
                        : ''
                    }
                  >
                    {user.role === 'verified_seller' ? 'Проверенный продавец' : 'Пользователь'}
                  </Badge>
                </div>
              </div>

              {!isCurrentUser && (
                <Button className="md:ml-auto gap-2" onClick={handleContact}>
                  <MessageSquare className="h-4 w-4" />
                  Написать
                </Button>
              )}
            </div>

            {user.bio && (
              <p className="text-muted-foreground mt-4">{user.bio}</p>
            )}

            <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
              {user.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>С {formatDate(user.joinedAt)}</span>
              </div>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-primary transition-colors"
                >
                  <LinkIcon className="h-4 w-4" />
                  <span>Сайт</span>
                </a>
              )}
            </div>

            <Separator className="my-4" />

            <div className="flex gap-8">
              <div className="text-center">
                <p className="text-2xl font-bold">{userCollection.length}</p>
                <p className="text-sm text-muted-foreground">В коллекции</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-1">
                  <p className="text-2xl font-bold">{user.rating.toFixed(1)}</p>
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                </div>
                <p className="text-sm text-muted-foreground">Рейтинг</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{userReviews.length}</p>
                <p className="text-sm text-muted-foreground">Отзывов</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="collection">Коллекция</TabsTrigger>
          <TabsTrigger value="reviews">Отзывы</TabsTrigger>
        </TabsList>

        <TabsContent value="collection" className="space-y-4">
          {userCollection.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Коллекция пуста</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {userCollection.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.artist?.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {getMerchTypeLabel(item.type)}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {getMerchConditionLabel(item.condition)}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium mt-2">
                      {formatCurrency(item.currentPrice)}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4">
          {userReviews.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Пока нет отзывов</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {userReviews.map((review) => {
                const isLiked = currentUser
                  ? hasLikedUserReview(review.id, currentUser.id)
                  : false;

                return (
                  <Card key={review.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={review.fromUser?.avatar} />
                        <AvatarFallback>{review.fromUser?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{review.fromUser?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDate(review.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? 'text-amber-400 fill-amber-400'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="mt-2 text-sm">{review.content}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 ${isLiked ? 'text-rose-400' : ''}`}
                            onClick={() => handleLikeReview(review.id)}
                          >
                            <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
                            <span>{review.likes}</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

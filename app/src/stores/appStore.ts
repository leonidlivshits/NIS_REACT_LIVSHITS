import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  MerchItem,
  WishlistItem,
  Notification,
  User,
  Artist,
  TradeOffer,
  Discussion,
  Comment,
  MerchFilter,
  Theme,
  CollectionStats,
  MarketplaceReview,
  UserReview,
} from '@/types';
import {
  mockArtists,
  mockWishlist,
  mockNotifications,
  getCurrentUser,
  enrichCollection,
  enrichDiscussions,
  enrichComments,
  enrichTradeOffers,
  enrichMarketplaceReviews,
  enrichUserReviews,
} from '@/data/dataLoader';

interface AppState {
  // User
  currentUser: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (user: User) => void;
  logout: () => void;

  // Theme
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Collection
  collection: MerchItem[];
  addToCollection: (item: MerchItem) => void;
  removeFromCollection: (id: string) => void;
  updateCollectionItem: (id: string, updates: Partial<MerchItem>) => void;
  getCollectionStats: () => CollectionStats;

  // Wishlist
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  updateWishlistItem: (id: string, updates: Partial<WishlistItem>) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  unreadCount: () => number;

  // Artists
  artists: Artist[];
  addArtist: (artist: Artist) => void;
  getArtistById: (id: string) => Artist | undefined;

  // Trade Offers
  tradeOffers: TradeOffer[];
  addTradeOffer: (offer: TradeOffer) => void;
  updateTradeOffer: (id: string, updates: Partial<TradeOffer>) => void;
  acceptTradeOffer: (id: string) => void;
  declineTradeOffer: (id: string) => void;

  // Discussions
  discussions: Discussion[];
  addDiscussion: (discussion: Discussion) => void;
  likeDiscussion: (id: string, userId: string) => boolean;
  unlikeDiscussion: (id: string, userId: string) => boolean;
  hasLikedDiscussion: (id: string, userId: string) => boolean;
  hideDiscussion: (id: string) => void;
  reportDiscussion: (id: string, reason: string) => void;
  getFilteredDiscussions: (filter: string, tag?: string) => Discussion[];

  // Comments
  comments: Comment[];
  addComment: (comment: Comment) => void;
  getCommentsByDiscussion: (discussionId: string) => Comment[];
  likeComment: (id: string, userId: string) => boolean;
  unlikeComment: (id: string, userId: string) => boolean;
  hasLikedComment: (id: string, userId: string) => boolean;

  // Filters
  filter: MerchFilter;
  setFilter: (filter: Partial<MerchFilter>) => void;
  resetFilter: () => void;

  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Hidden/Reported content
  hiddenDiscussions: string[];
  hiddenComments: string[];

  // Marketplace Reviews
  marketplaceReviews: MarketplaceReview[];
  addMarketplaceReview: (review: MarketplaceReview) => void;
  likeMarketplaceReview: (id: string, userId: string) => boolean;
  unlikeMarketplaceReview: (id: string, userId: string) => boolean;
  hasLikedMarketplaceReview: (id: string, userId: string) => boolean;
  getReviewsByItem: (itemId: string) => MarketplaceReview[];

  // User Reviews
  userReviews: UserReview[];
  addUserReview: (review: UserReview) => void;
  likeUserReview: (id: string, userId: string) => boolean;
  unlikeUserReview: (id: string, userId: string) => boolean;
  hasLikedUserReview: (id: string, userId: string) => boolean;
  getReviewsByUser: (userId: string) => UserReview[];

  // Initialize data
  initializeData: () => void;
}

const initialFilter: MerchFilter = {
  sortBy: 'date',
  sortOrder: 'desc',
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // User
      currentUser: null,
      isAuthenticated: false,
      setUser: (user) => set({ currentUser: user, isAuthenticated: !!user }),
      login: (user) => set({ currentUser: user, isAuthenticated: true }),
      logout: () => set({ currentUser: null, isAuthenticated: false }),

      // Theme
      theme: 'dark',
      setTheme: (theme) => set({ theme }),

      // Collection
      collection: [],
      addToCollection: (item) =>
        set((state) => ({ collection: [item, ...state.collection] })),
      removeFromCollection: (id) =>
        set((state) => ({
          collection: state.collection.filter((item) => item.id !== id),
        })),
      updateCollectionItem: (id, updates) =>
        set((state) => ({
          collection: state.collection.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),
      getCollectionStats: () => {
        const { collection } = get();
        const totalItems = collection.length;
        const totalSpent = collection.reduce((sum, item) => sum + item.purchasePrice, 0);
        const currentValue = collection.reduce((sum, item) => sum + item.currentPrice, 0);
        const profitLoss = currentValue - totalSpent;
        const profitLossPercent = totalSpent > 0 ? (profitLoss / totalSpent) * 100 : 0;

        const byType: Record<string, number> = {};
        const byArtist: Record<string, number> = {};

        collection.forEach((item) => {
          byType[item.type] = (byType[item.type] || 0) + 1;
          byArtist[item.artistId] = (byArtist[item.artistId] || 0) + 1;
        });

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentAdditions = collection.filter(
          (item) => new Date(item.purchaseDate) > thirtyDaysAgo
        ).length;

        return {
          totalItems,
          totalSpent,
          currentValue,
          profitLoss,
          profitLossPercent,
          byType,
          byArtist,
          recentAdditions,
        };
      },

      // Wishlist
      wishlist: [],
      addToWishlist: (item) =>
        set((state) => ({ wishlist: [item, ...state.wishlist] })),
      removeFromWishlist: (id) =>
        set((state) => ({
          wishlist: state.wishlist.filter((item) => item.id !== id),
        })),
      updateWishlistItem: (id, updates) =>
        set((state) => ({
          wishlist: state.wishlist.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        })),

      // Notifications
      notifications: [],
      addNotification: (notification) =>
        set((state) => ({ notifications: [notification, ...state.notifications] })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      markAllNotificationsAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
      clearNotifications: () => set({ notifications: [] }),
      unreadCount: () => {
        const { notifications } = get();
        return notifications.filter((n) => !n.read).length;
      },

      // Artists
      artists: [],
      addArtist: (artist) =>
        set((state) => ({ artists: [...state.artists, artist] })),
      getArtistById: (id) => {
        const { artists } = get();
        return artists.find((a) => a.id === id);
      },

      // Trade Offers
      tradeOffers: [],
      addTradeOffer: (offer) =>
        set((state) => ({ tradeOffers: [...state.tradeOffers, offer] })),
      updateTradeOffer: (id, updates) =>
        set((state) => ({
          tradeOffers: state.tradeOffers.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          ),
        })),
      acceptTradeOffer: (id) => {
        const { currentUser, addNotification } = get();
        set((state) => ({
          tradeOffers: state.tradeOffers.map((o) =>
            o.id === id ? { ...o, status: 'accepted' as const } : o
          ),
        }));
        // Add notification
        const offer = get().tradeOffers.find((o) => o.id === id);
        if (offer && currentUser) {
          addNotification({
            id: `notif-${Date.now()}`,
            userId: offer.fromUserId,
            type: 'message' as const,
            title: 'Предложение обмена принято!',
            message: `${currentUser.name} принял(а) ваше предложение обмена`,
            read: false,
            createdAt: new Date(),
          });
        }
      },
      declineTradeOffer: (id) => {
        set((state) => ({
          tradeOffers: state.tradeOffers.map((o) =>
            o.id === id ? { ...o, status: 'declined' as const } : o
          ),
        }));
      },

      // Discussions
      discussions: [],
      addDiscussion: (discussion) =>
        set((state) => ({ discussions: [discussion, ...state.discussions] })),
      likeDiscussion: (id, userId) => {
        const { hasLikedDiscussion } = get();
        if (hasLikedDiscussion(id, userId)) return false;
        
        set((state) => ({
          discussions: state.discussions.map((d) =>
            d.id === id 
              ? { ...d, likes: d.likes + 1, likedBy: [...(d.likedBy || []), userId] } 
              : d
          ),
        }));
        return true;
      },
      unlikeDiscussion: (id, userId) => {
        set((state) => ({
          discussions: state.discussions.map((d) =>
            d.id === id 
              ? { 
                  ...d, 
                  likes: Math.max(0, d.likes - 1), 
                  likedBy: (d.likedBy || []).filter((uid) => uid !== userId) 
                } 
              : d
          ),
        }));
        return true;
      },
      hasLikedDiscussion: (id, userId) => {
        const { discussions } = get();
        const discussion = discussions.find((d) => d.id === id);
        return discussion?.likedBy?.includes(userId) || false;
      },
      hideDiscussion: (id) =>
        set((state) => ({
          hiddenDiscussions: [...state.hiddenDiscussions, id],
        })),
      reportDiscussion: (id, reason) => {
        console.log(`Discussion ${id} reported: ${reason}`);
        set((state) => ({
          hiddenDiscussions: [...state.hiddenDiscussions, id],
        }));
      },
      getFilteredDiscussions: (filter, tag) => {
        const { discussions, hiddenDiscussions } = get();
        let filtered = discussions.filter((d) => !hiddenDiscussions.includes(d.id));
        
        if (tag && tag !== 'all') {
          filtered = filtered.filter((d) => d.tags?.includes(tag));
        }
        
        switch (filter) {
          case 'popular':
            filtered = [...filtered].sort((a, b) => b.likes - a.likes);
            break;
          case 'recent':
            filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'discussed':
            filtered = [...filtered].sort((a, b) => b.replies - a.replies);
            break;
          default:
            break;
        }
        
        return filtered;
      },

      // Comments
      comments: [],
      addComment: (comment) =>
        set((state) => {
          const newComments = [comment, ...state.comments];
          return {
            comments: newComments,
            discussions: state.discussions.map((d) =>
              d.id === comment.discussionId 
                ? { ...d, replies: d.replies + 1 } 
                : d
            ),
          };
        }),
      getCommentsByDiscussion: (discussionId) => {
        const { comments, hiddenComments } = get();
        return comments
          .filter((c) => c.discussionId === discussionId && !hiddenComments.includes(c.id))
          .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      },
      likeComment: (id, userId) => {
        const { hasLikedComment } = get();
        if (hasLikedComment(id, userId)) return false;
        
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === id 
              ? { ...c, likes: c.likes + 1, likedBy: [...(c.likedBy || []), userId] } 
              : c
          ),
        }));
        return true;
      },
      unlikeComment: (id, userId) => {
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === id 
              ? { 
                  ...c, 
                  likes: Math.max(0, c.likes - 1), 
                  likedBy: (c.likedBy || []).filter((uid) => uid !== userId) 
                } 
              : c
          ),
        }));
        return true;
      },
      hasLikedComment: (id, userId) => {
        const { comments } = get();
        const comment = comments.find((c) => c.id === id);
        return comment?.likedBy?.includes(userId) || false;
      },

      // Filters
      filter: initialFilter,
      setFilter: (filter) =>
        set((state) => ({ filter: { ...state.filter, ...filter } })),
      resetFilter: () => set({ filter: initialFilter }),

      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Loading
      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      // Hidden content
      hiddenDiscussions: [],
      hiddenComments: [],

      // Marketplace Reviews
      marketplaceReviews: [],
      addMarketplaceReview: (review) =>
        set((state) => ({ marketplaceReviews: [review, ...state.marketplaceReviews] })),
      likeMarketplaceReview: (id, userId) => {
        const { hasLikedMarketplaceReview } = get();
        if (hasLikedMarketplaceReview(id, userId)) return false;
        
        set((state) => ({
          marketplaceReviews: state.marketplaceReviews.map((r) =>
            r.id === id 
              ? { ...r, likes: r.likes + 1, likedBy: [...(r.likedBy || []), userId] } 
              : r
          ),
        }));
        return true;
      },
      unlikeMarketplaceReview: (id, userId) => {
        set((state) => ({
          marketplaceReviews: state.marketplaceReviews.map((r) =>
            r.id === id 
              ? { 
                  ...r, 
                  likes: Math.max(0, r.likes - 1), 
                  likedBy: (r.likedBy || []).filter((uid) => uid !== userId) 
                } 
              : r
          ),
        }));
        return true;
      },
      hasLikedMarketplaceReview: (id, userId) => {
        const { marketplaceReviews } = get();
        const review = marketplaceReviews.find((r) => r.id === id);
        return review?.likedBy?.includes(userId) || false;
      },
      getReviewsByItem: (itemId) => {
        const { marketplaceReviews } = get();
        return marketplaceReviews.filter((r) => r.itemId === itemId);
      },

      // User Reviews
      userReviews: [],
      addUserReview: (review) =>
        set((state) => ({ userReviews: [review, ...state.userReviews] })),
      likeUserReview: (id, userId) => {
        const { hasLikedUserReview } = get();
        if (hasLikedUserReview(id, userId)) return false;
        
        set((state) => ({
          userReviews: state.userReviews.map((r) =>
            r.id === id 
              ? { ...r, likes: r.likes + 1, likedBy: [...(r.likedBy || []), userId] } 
              : r
          ),
        }));
        return true;
      },
      unlikeUserReview: (id, userId) => {
        set((state) => ({
          userReviews: state.userReviews.map((r) =>
            r.id === id 
              ? { 
                  ...r, 
                  likes: Math.max(0, r.likes - 1), 
                  likedBy: (r.likedBy || []).filter((uid) => uid !== userId) 
                } 
              : r
          ),
        }));
        return true;
      },
      hasLikedUserReview: (id, userId) => {
        const { userReviews } = get();
        const review = userReviews.find((r) => r.id === id);
        return review?.likedBy?.includes(userId) || false;
      },
      getReviewsByUser: (userId) => {
        const { userReviews } = get();
        return userReviews.filter((r) => r.toUserId === userId);
      },

      // Initialize data from JSON
      initializeData: () => {
        const user = getCurrentUser();
        
        set({
          artists: mockArtists,
          currentUser: user as any,
          isAuthenticated: true,
          collection: enrichCollection() as any,
          wishlist: mockWishlist.map((item: any) => ({
            ...item,
            artist: mockArtists.find((a: any) => a.id === item.artistId),
          })) as any,
          discussions: enrichDiscussions() as any,
          comments: enrichComments() as any,
          tradeOffers: enrichTradeOffers() as any,
          marketplaceReviews: enrichMarketplaceReviews() as any,
          userReviews: enrichUserReviews() as any,
          notifications: mockNotifications as any,
        });
      },
    }),
    {
      name: 'merch-tracker-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        theme: state.theme,
        collection: state.collection,
        wishlist: state.wishlist,
        notifications: state.notifications,
        artists: state.artists,
        tradeOffers: state.tradeOffers,
        discussions: state.discussions,
        comments: state.comments,
        hiddenDiscussions: state.hiddenDiscussions,
        hiddenComments: state.hiddenComments,
        marketplaceReviews: state.marketplaceReviews,
        userReviews: state.userReviews,
      }),
    }
  )
);

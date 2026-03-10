import { z } from 'zod';

// Enums
export const MerchType = {
  VINYL: 'vinyl',
  CD: 'cd',
  CASSETTE: 'cassette',
  POSTER: 'poster',
  TSHIRT: 'tshirt',
  HOODIE: 'hoodie',
  ACCESSORY: 'accessory',
  OTHER: 'other',
} as const;

export const MerchCondition = {
  NEW: 'new',
  LIKE_NEW: 'like_new',
  GOOD: 'good',
  FAIR: 'fair',
  POOR: 'poor',
} as const;

export const NotificationType = {
  PRICE_DROP: 'price_drop',
  NEW_RELEASE: 'new_release',
  LIMITED_EDITION: 'limited_edition',
  SALE: 'sale',
  MESSAGE: 'message',
} as const;

export const UserRole = {
  USER: 'user',
  ADMIN: 'admin',
  VERIFIED_SELLER: 'verified_seller',
} as const;

// Zod Schemas
export const ArtistSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  image: z.string().optional(),
  genre: z.string().optional(),
});

export const MerchItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  artistId: z.string(),
  artist: ArtistSchema.optional(),
  type: z.nativeEnum(MerchType),
  condition: z.nativeEnum(MerchCondition),
  purchasePrice: z.number().min(0),
  currentPrice: z.number().min(0),
  purchaseDate: z.date(),
  image: z.string(),
  description: z.string().optional(),
  isLimited: z.boolean().optional().default(false),
  limitedNumber: z.number().optional(),
  tags: z.array(z.string()).default([]),
  marketplace: z.string().optional(),
});

export const WishlistItemSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  artistId: z.string(),
  artist: ArtistSchema.optional(),
  type: z.nativeEnum(MerchType),
  targetPrice: z.number().min(0).optional(),
  image: z.string(),
  releaseDate: z.date().optional(),
  notifyOnRelease: z.boolean().default(true),
  notifyOnPriceDrop: z.boolean().default(true),
});

export const MarketplacePriceSchema = z.object({
  id: z.string(),
  merchItemId: z.string(),
  marketplace: z.string(),
  price: z.number().min(0),
  url: z.string(),
  lastUpdated: z.date(),
  inStock: z.boolean(),
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(1),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
  rating: z.number().min(0).max(5).default(0),
  reviewCount: z.number().default(0),
  joinedAt: z.date(),
});

export const NotificationSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: z.nativeEnum(NotificationType),
  title: z.string(),
  message: z.string(),
  read: z.boolean().default(false),
  createdAt: z.date(),
  data: z.record(z.string(), z.any()).optional(),
});

export const TradeOfferSchema = z.object({
  id: z.string(),
  fromUserId: z.string(),
  fromUser: UserSchema.optional(),
  toUserId: z.string(),
  offeredItemIds: z.array(z.string()),
  offeredItems: z.array(MerchItemSchema).optional(),
  requestedItemIds: z.array(z.string()),
  requestedItems: z.array(MerchItemSchema).optional(),
  message: z.string().optional(),
  status: z.enum(['pending', 'accepted', 'declined', 'cancelled']).default('pending'),
  createdAt: z.date(),
});

export const DiscussionSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  authorId: z.string(),
  author: UserSchema.optional(),
  artistId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  replies: z.number().default(0),
  createdAt: z.date(),
});

export const CommentSchema = z.object({
  id: z.string(),
  discussionId: z.string(),
  authorId: z.string(),
  author: UserSchema.optional(),
  content: z.string(),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  replyTo: z.string().nullable().optional(),
  createdAt: z.date(),
});

export const MarketplaceReviewSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  authorId: z.string(),
  author: UserSchema.optional(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  createdAt: z.date(),
});

export const UserReviewSchema = z.object({
  id: z.string(),
  toUserId: z.string(),
  fromUserId: z.string(),
  fromUser: UserSchema.optional(),
  toUser: UserSchema.optional(),
  rating: z.number().min(1).max(5),
  content: z.string(),
  likes: z.number().default(0),
  likedBy: z.array(z.string()).default([]),
  createdAt: z.date(),
});

// Types
export type Artist = z.infer<typeof ArtistSchema>;
export type MerchItem = z.infer<typeof MerchItemSchema>;
export type WishlistItem = z.infer<typeof WishlistItemSchema>;
export type MarketplacePrice = z.infer<typeof MarketplacePriceSchema>;
export type User = z.infer<typeof UserSchema>;
export type Notification = z.infer<typeof NotificationSchema>;
export type TradeOffer = z.infer<typeof TradeOfferSchema>;
export type Discussion = z.infer<typeof DiscussionSchema>;
export type Comment = z.infer<typeof CommentSchema>;
export type MarketplaceReview = z.infer<typeof MarketplaceReviewSchema>;
export type UserReview = z.infer<typeof UserReviewSchema>;

// Collection Statistics
export interface CollectionStats {
  totalItems: number;
  totalSpent: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercent: number;
  byType: Record<string, number>;
  byArtist: Record<string, number>;
  recentAdditions: number;
}

// Filter Types
export interface MerchFilter {
  type?: string;
  artist?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sortBy: 'date' | 'price' | 'name' | 'artist';
  sortOrder: 'asc' | 'desc';
}

// Theme Type
export type Theme = 'dark' | 'light' | 'system';

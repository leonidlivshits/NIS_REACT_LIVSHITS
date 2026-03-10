import artistsData from './json/artists.json';
import usersData from './json/users.json';
import collectionData from './json/collection.json';
import wishlistData from './json/wishlist.json';
import discussionsData from './json/discussions.json';
import commentsData from './json/comments.json';
import tradeOffersData from './json/tradeOffers.json';
import marketplaceItemsData from './json/marketplaceItems.json';
import marketplaceReviewsData from './json/marketplaceReviews.json';
import notificationsData from './json/notifications.json';
import userReviewsData from './json/userReviews.json';

// Parse dates from JSON strings
const parseDates = <T extends { createdAt?: string; purchaseDate?: string; releaseDate?: string; joinedAt?: string }>(items: T[]): T[] => {
  return items.map(item => ({
    ...item,
    ...(item.createdAt && { createdAt: new Date(item.createdAt) }),
    ...(item.purchaseDate && { purchaseDate: new Date(item.purchaseDate) }),
    ...(item.releaseDate && { releaseDate: new Date(item.releaseDate) }),
    ...(item.joinedAt && { joinedAt: new Date(item.joinedAt) }),
  }));
};

export const mockArtists = artistsData;
export const mockUsers = parseDates(usersData);
export const mockCollection = parseDates(collectionData);
export const mockWishlist = parseDates(wishlistData);
export const mockDiscussions = parseDates(discussionsData);
export const mockComments = parseDates(commentsData);
export const mockTradeOffers = parseDates(tradeOffersData);
export const mockMarketplaceItems = marketplaceItemsData;
export const mockMarketplaceReviews = parseDates(marketplaceReviewsData);
export const mockNotifications = parseDates(notificationsData);
export const mockUserReviews = parseDates(userReviewsData);

// Re-export for convenience
export { default as mockUserReviewsData } from './json/userReviews.json';

// Get current user (Leonid Livshits)
export const getCurrentUser = () => mockUsers.find(u => u.id === 'user-leonid') || mockUsers[0];

// Get user by ID
export const getUserById = (id: string) => mockUsers.find(u => u.id === id);

// Get artist by ID
export const getArtistById = (id: string) => mockArtists.find(a => a.id === id);

// Enrich data with related entities
export const enrichCollection = () => {
  return mockCollection.map(item => ({
    ...item,
    artist: getArtistById(item.artistId),
  }));
};

export const enrichDiscussions = () => {
  return mockDiscussions.map(d => ({
    ...d,
    author: getUserById(d.authorId),
    artist: d.artistId ? getArtistById(d.artistId) : undefined,
  }));
};

export const enrichComments = () => {
  return mockComments.map(c => ({
    ...c,
    author: getUserById(c.authorId),
  }));
};

export const enrichTradeOffers = () => {
  return mockTradeOffers.map(t => ({
    ...t,
    fromUser: getUserById(t.fromUserId),
  }));
};

export const enrichMarketplaceReviews = () => {
  return mockMarketplaceReviews.map(r => ({
    ...r,
    author: getUserById(r.authorId),
  }));
};

export const enrichUserReviews = () => {
  return mockUserReviews.map(r => ({
    ...r,
    fromUser: getUserById(r.fromUserId),
    toUser: getUserById(r.toUserId),
  }));
};

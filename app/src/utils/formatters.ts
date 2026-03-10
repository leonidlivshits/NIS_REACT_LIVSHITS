export const formatCurrency = (amount: number, currency = 'RUB'): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export const formatRelativeTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return 'только что';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} мин. назад`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ч. назад`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} дн. назад`;
  
  return formatDate(date);
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ru-RU').format(num);
};

export const getMerchTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    vinyl: 'Винил',
    cd: 'CD',
    cassette: 'Кассета',
    poster: 'Постер',
    tshirt: 'Футболка',
    hoodie: 'Худи',
    accessory: 'Аксессуар',
    other: 'Другое',
  };
  return labels[type] || type;
};

export const getMerchConditionLabel = (condition: string): string => {
  const labels: Record<string, string> = {
    new: 'Новое',
    like_new: 'Как новое',
    good: 'Хорошее',
    fair: 'Удовлетворительное',
    poor: 'Плохое',
  };
  return labels[condition] || condition;
};

export const getConditionColor = (condition: string): string => {
  const colors: Record<string, string> = {
    new: 'bg-green-500/20 text-green-400 border-green-500/30',
    like_new: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    good: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    fair: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    poor: 'bg-red-500/20 text-red-400 border-red-500/30',
  };
  return colors[condition] || 'bg-gray-500/20 text-gray-400';
};

export const getNotificationIcon = (type: string): string => {
  const icons: Record<string, string> = {
    price_drop: 'TrendingDown',
    new_release: 'Disc',
    limited_edition: 'Sparkles',
    sale: 'Percent',
    message: 'MessageCircle',
  };
  return icons[type] || 'Bell';
};

export const getNotificationColor = (type: string): string => {
  const colors: Record<string, string> = {
    price_drop: 'text-green-400 bg-green-500/20',
    new_release: 'text-purple-400 bg-purple-500/20',
    limited_edition: 'text-amber-400 bg-amber-500/20',
    sale: 'text-rose-400 bg-rose-500/20',
    message: 'text-blue-400 bg-blue-500/20',
  };
  return colors[type] || 'text-gray-400 bg-gray-500/20';
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

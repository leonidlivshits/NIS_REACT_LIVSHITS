export interface Movie {
  id: number;
  title: string;
  year: number;
  posterUrl: string;
  isFavorite: boolean;
}

export type ViewMode = 'grid' | 'list';
export type FilterType = 'all' | 'favorites';
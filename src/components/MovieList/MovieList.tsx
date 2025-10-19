import React from 'react';
import { Movie, ViewMode } from '../../types/movie';
import styles from './MovieList.module.css';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieListProps {
  movies: Movie[];
  onToggleFavorite: (id: number) => void;
  viewMode: ViewMode;
}

export const MovieList: React.FC<MovieListProps> = ({
  movies,
  onToggleFavorite,
  viewMode
}) => {
  if (movies.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>Фильмов нет</h2>
        <p>Попробуйте изменить параметры поиска или фильтрации</p>
      </div>
    );
  }

  return (
    <div className={`${styles.movieList} ${styles[viewMode]}`}>
      {movies.map(movie => (
        <MovieCard
          key={movie.id}
          movie={movie}
          onToggleFavorite={onToggleFavorite}
          viewMode={viewMode}
        />
      ))}
    </div>
  );
};
import React from 'react';
import { Movie } from '../../types/movie';
import styles from './MovieCard.module.css';
import starEmpty from '../../assets/images/star-empty.svg';
import starFilled from '../../assets/images/star-filled.svg';

interface MovieCardProps {
  movie: Movie;
  onToggleFavorite: (id: number) => void;
  viewMode: 'grid' | 'list';
}

export const MovieCard: React.FC<MovieCardProps> = ({ 
  movie, 
  onToggleFavorite, 
  viewMode 
}) => {
  const starIcon = movie.isFavorite ? starFilled : starEmpty;
  const starAlt = movie.isFavorite ? 'Удалить из избранного' : 'Добавить в избранное';

  return (
    <div className={`${styles.card} ${styles[viewMode]}`}>
      <img 
        src={movie.posterUrl} 
        alt={movie.title}
        className={styles.poster}
        
      />
      <div className={styles.info}>
        <h3 className={styles.title}>{movie.title}</h3>
        <p className={styles.year}>Год: {movie.year}</p>
        <button
          className={styles.favoriteBtn}
          onClick={() => onToggleFavorite(movie.id)}
          aria-label={starAlt}
        >
          <img 
            src={starIcon} 
            alt={starAlt}
            className={styles.starIcon}
          />
        </button>
      </div>
    </div>
  );
};
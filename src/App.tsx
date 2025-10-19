import React, { useState, useMemo } from 'react';
import { Movie, ViewMode, FilterType } from './types/movie';
import { initialMovies } from './data/movies';
import styles from './App.module.css';
import { SearchBar } from './components/SearchBar/SearchBar';
import { FilterButtons } from './components/FilterButtons/FilterButtons';
import { ViewToggle } from './components/ViewToggle/ViewToggle';
import { MovieList } from './components/MovieList/MovieList';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>(initialMovies);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentFilter, setCurrentFilter] = useState<FilterType>('all');
  const [currentView, setCurrentView] = useState<ViewMode>('grid');

  const toggleFavorite = (id: number) => {
    setMovies(prevMovies =>
      prevMovies.map(movie =>
        movie.id === id ? { ...movie, isFavorite: !movie.isFavorite } : movie
      )
    );
  };

  const filteredMovies = useMemo(() => {
    let filtered = movies;

    // Фильтрация по избранному
    if (currentFilter === 'favorites') {
      filtered = filtered.filter(movie => movie.isFavorite);
    }

    // Поиск по названию
    if (searchQuery.trim()) {
      filtered = filtered.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [movies, currentFilter, searchQuery]);

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <h1>Каталог фильмов</h1>
        <div className={styles.controls}>
          <SearchBar onSearch={setSearchQuery} />
          <div className={styles.controlGroup}>
            <FilterButtons
              currentFilter={currentFilter}
              onFilterChange={setCurrentFilter}
            />
            <ViewToggle
              currentView={currentView}
              onViewChange={setCurrentView}
            />
          </div>
        </div>
      </header>
      
      <main className={styles.main}>
        <MovieList
          movies={filteredMovies}
          onToggleFavorite={toggleFavorite}
          viewMode={currentView}
        />
      </main>
    </div>
  );
};
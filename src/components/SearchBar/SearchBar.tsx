import React, { useRef } from 'react';
import styles from './SearchBar.module.css';
import clearIcon from '../../assets/images/clear-icon.svg';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const searchRef = useRef<HTMLInputElement>(null);

  const handleSearch = () => {
    if (searchRef.current) {
      onSearch(searchRef.current.value);
    }
  };

  const handleClear = () => {
    if (searchRef.current) {
      searchRef.current.value = '';
      onSearch('');
      searchRef.current.focus(); // Фокус на поле после очистки
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClear();
    }
  };

  return (
    <div className={styles.searchContainer}>
      <input
        ref={searchRef}
        type="text"
        placeholder="Поиск по названию фильма..."
        className={styles.searchInput}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
      />
      <button 
        onClick={handleClear} 
        className={styles.clearButton}
        aria-label="Очистить поиск"
        title="Очистить поиск"
      >
        <img src={clearIcon} alt="Очистить" width={16} height={16} />
      </button>
    </div>
  );
};
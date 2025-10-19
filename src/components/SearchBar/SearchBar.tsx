import React, { useRef } from 'react';
import styles from './SearchBar.module.css';

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
      />
      <button onClick={handleClear} className={styles.clearButton}>
        ×
      </button>
    </div>
  );
};
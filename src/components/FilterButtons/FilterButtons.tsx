import React from 'react';
import { FilterType } from '../../types/movie';
import styles from './FilterButtons.module.css';

interface FilterButtonsProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export const FilterButtons: React.FC<FilterButtonsProps> = ({
  currentFilter,
  onFilterChange
}) => {
  return (
    <div className={styles.filterContainer}>
      <button
        className={`${styles.filterButton} ${currentFilter === 'all' ? styles.active : ''}`}
        onClick={() => onFilterChange('all')}
      >
        Все
      </button>
      <button
        className={`${styles.filterButton} ${currentFilter === 'favorites' ? styles.active : ''}`}
        onClick={() => onFilterChange('favorites')}
      >
        Только избранные
      </button>
    </div>
  );
};
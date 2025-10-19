import React from 'react';
import { ViewMode } from '../../types/movie';
import styles from './ViewToggle.module.css';

interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  currentView,
  onViewChange
}) => {
  return (
    <div className={styles.toggleContainer}>
      <button
        className={`${styles.toggleButton} ${currentView === 'grid' ? styles.active : ''}`}
        onClick={() => onViewChange('grid')}
        aria-label="Плитка"
      >
        ▦
      </button>
      <button
        className={`${styles.toggleButton} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="Список"
      >
        ≡
      </button>
    </div>
  );
};
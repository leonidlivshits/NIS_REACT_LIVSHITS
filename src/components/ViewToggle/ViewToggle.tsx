import React from 'react';
import { ViewMode } from '../../types/movie';
import gridIcon from '../../assets/images/grid-icon.svg';
import listIcon from '../../assets/images/list-icon.svg';
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
        title="Режим плитки"
      >
        <img src={gridIcon} alt="Плитка" width={18} height={18} />
      </button>
      <button
        className={`${styles.toggleButton} ${currentView === 'list' ? styles.active : ''}`}
        onClick={() => onViewChange('list')}
        aria-label="Список"
        title="Режим списка"
      >
        <img src={listIcon} alt="Список" width={18} height={18} />
      </button>
    </div>
  );
};
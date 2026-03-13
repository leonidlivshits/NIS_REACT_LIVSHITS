import React, { useReducer, useCallback, useRef, useEffect, memo } from 'react';
import styles from './PetCard.module.scss';
import { Pet, PetState, PetAction } from './types';
import { useEventLog } from '../../hooks/useEventLog';
import { usePetLifecycle } from '../../hooks/usePetLifecycle';
import { ActionButton } from '../PetActions/ActionButton.styled';

import feedIcon from '../../assets/icons/feed.svg';
import levelIcon from '../../assets/icons/levelup.svg';
import cheerIcon from '../../assets/icons/cheer.svg';
import resetIcon from '../../assets/icons/reset.svg';
import disabledIcon from '../../assets/icons/disabled.svg';
import avatarPlaceholder from '../../assets/avatars/placeholder.svg';

const MOOD_ORDER: PetState['mood'][] = ['sad', 'content', 'happy', 'excited'];

type ActionWithoutPayload = Extract<PetAction, { type: 'FEED' | 'LEVEL_UP' | 'CHEER' | 'RESET' }>;

function petReducer(state: PetState, action: PetAction): PetState {
  switch (action.type) {
    case 'FEED':
      return {
        ...state,
        energy: Math.min(state.energy + 25, 100),
        mood: 'happy',
      };
    case 'LEVEL_UP':
      return {
        ...state,
        level: state.level + 1,
      };
    case 'CHEER': {
      const currentIndex = MOOD_ORDER.indexOf(state.mood);
      const nextIndex = Math.min(currentIndex + 1, MOOD_ORDER.length - 1);
      return { ...state, mood: MOOD_ORDER[nextIndex] };
    }
    case 'RESET':
      return { ...state, energy: 100, mood: 'happy', level: 1 };
    case 'UPDATE_ENERGY':
      return { ...state, energy: action.payload };
    case 'UPDATE_MOOD':
      return { ...state, mood: action.payload };
    default:
      return state;
  }
}

interface PetCardProps {
  initialPet: Pet;
  onUpdate: (id: string, updates: Partial<Pet>) => void;
}

export const PetCard: React.FC<PetCardProps> = memo(({ initialPet, onUpdate }) => {
  const [state, dispatch] = useReducer(petReducer, initialPet);
  const { addEvent } = useEventLog();
  const avatarRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (avatarRef.current) {
      if (state.energy <= 30) {
        avatarRef.current.style.animation = 'pulse 2s infinite';
      } else {
        avatarRef.current.style.animation = 'none';
      }
    }
  }, [state.energy]);

  const performAction = useCallback(
    (actionType: ActionWithoutPayload['type'], logMessage: string, updates: Partial<Pet>) => {
      dispatch({ type: actionType } as PetAction);
      addEvent(`${state.name} ${logMessage}`);
      onUpdate(state.id, updates);
    },
    [state.name, state.id, addEvent, onUpdate]
  );

  const handleFeed = useCallback(() => {
    const newEnergy = Math.min(state.energy + 25, 100);
    performAction('FEED', 'был покормлен. Энергия увеличена.', {
      energy: newEnergy,
      mood: 'happy',
    });
  }, [state.energy, performAction]);

  const handleLevelUp = useCallback(() => {
    performAction('LEVEL_UP', 'повысил уровень.', {
      level: state.level + 1,
    });
  }, [state.level, performAction]);

  const handleCheer = useCallback(() => {
    const currentIndex = MOOD_ORDER.indexOf(state.mood);
    const nextIndex = Math.min(currentIndex + 1, MOOD_ORDER.length - 1);
    const nextMood = MOOD_ORDER[nextIndex];
    performAction('CHEER', 'получил поддержку. Настроение улучшено.', {
      mood: nextMood,
    });
  }, [state.mood, performAction]);

  const handleReset = useCallback(() => {
    performAction('RESET', 'сброшен до начального состояния.', {
      energy: 100,
      mood: 'happy',
      level: 1,
    });
  }, [performAction]);

  const updateEnergy = useCallback(
    (id: string, newEnergy: number) => {
      if (id !== state.id) return;
      dispatch({ type: 'UPDATE_ENERGY', payload: newEnergy });
      onUpdate(state.id, { energy: newEnergy });
    },
    [state.id, onUpdate]
  );

  const updateMood = useCallback(
    (id: string, newMood: PetState['mood']) => {
      if (id !== state.id) return;
      dispatch({ type: 'UPDATE_MOOD', payload: newMood });
      onUpdate(state.id, { mood: newMood });
    },
    [state.id, onUpdate]
  );

  usePetLifecycle(state, updateEnergy, updateMood);

  const moodStyles: React.CSSProperties = {
    boxShadow:
      state.mood === 'happy'
        ? '0 8px 32px rgba(72, 187, 120, 0.3)'
        : state.mood === 'sad'
        ? '0 8px 32px rgba(108, 117, 125, 0.3)'
        : state.mood === 'excited'
        ? '0 8px 32px rgba(255, 193, 7, 0.3)'
        : '0 8px 32px rgba(13, 110, 253, 0.3)',
    border:
      state.mood === 'happy'
        ? '2px solid #48bb78'
        : state.mood === 'sad'
        ? '2px solid #6c757d'
        : state.mood === 'excited'
        ? '2px solid #ffc107'
        : '2px solid #0d6efd',
  };

  const isDisabled = state.energy === 0;

  return (
    <div className={styles.petCard} style={moodStyles}>
      <div className={styles.avatarContainer}>
        <img
          ref={avatarRef}
          src={state.avatar || avatarPlaceholder}
          alt={state.name}
          className={styles.avatar}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== avatarPlaceholder) {
              img.src = avatarPlaceholder;
            }
          }}
        />
        <div className={styles.levelBadge}>Lvl {state.level}</div>
      </div>

      <div className={styles.petInfo}>
        <h3 className={styles.petName}>{state.name}</h3>
        <p className={styles.species}>{state.species}</p>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Энергия:</span>
            <div className={styles.energyBar}>
              <div
                className={`${styles.energyFill} ${state.energy <= 30 ? styles.low : ''}`}
                style={{ width: `${state.energy}%` }}
              />
            </div>
            <span className={styles.statValue}>{state.energy}%</span>
          </div>

          <div className={styles.stat}>
            <span className={styles.statLabel}>Настроение:</span>
            <span className={`${styles.mood} ${styles[state.mood]}`}>
              {state.mood === 'happy' && 'Счастлив'}
              {state.mood === 'sad' && 'Грустный'}
              {state.mood === 'content' && 'Довольный'}
              {state.mood === 'excited' && 'В восторге'}
              {state.mood === 'angry' && 'Сердитый'}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <ActionButton $variant="success" onClick={handleFeed} disabled={isDisabled}>
          <img src={feedIcon} alt="feed" width={18} height={18} />
          Кормить
        </ActionButton>

        <ActionButton $variant="primary" onClick={handleLevelUp} disabled={isDisabled}>
          <img src={levelIcon} alt="level up" width={18} height={18} />
          Уровень+
        </ActionButton>

        <ActionButton $variant="warning" onClick={handleCheer} disabled={isDisabled}>
          <img src={cheerIcon} alt="cheer" width={18} height={18} />
          Подбодрить
        </ActionButton>

        <ActionButton $variant="secondary" onClick={handleReset}>
          <img src={resetIcon} alt="reset" width={18} height={18} />
          Сброс
        </ActionButton>
      </div>

      {isDisabled && (
        <div className={styles.disabledOverlay} role="region" aria-label={`${state.name} истощен`}>
          <div style={{ textAlign: 'center' }}>
            <img src={disabledIcon} alt="disabled" width={36} height={36} style={{ display: 'block', margin: '0 auto 8px' }} />
            <div style={{ color: '#fff', fontWeight: 700, marginBottom: 12 }}>Питомец истощен</div>
            <ActionButton $variant="primary" onClick={handleReset} style={{ pointerEvents: 'auto' }}>
              Восстановить
            </ActionButton>
          </div>
        </div>
      )}
    </div>
  );
});

PetCard.displayName = 'PetCard';
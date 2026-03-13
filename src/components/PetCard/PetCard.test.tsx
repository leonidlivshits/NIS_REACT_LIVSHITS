import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Pet } from './types';
import { EventContext } from '../../context/EventContext';
import { PetCard } from './PetCard';

vi.mock('../../hooks/usePetLifecycle', () => ({
  usePetLifecycle: vi.fn(),
}));

vi.mock('../../assets/icons/feed.svg', () => ({ default: 'feed-icon' }));
vi.mock('../../assets/icons/levelup.svg', () => ({ default: 'levelup-icon' }));
vi.mock('../../assets/icons/cheer.svg', () => ({ default: 'cheer-icon' }));
vi.mock('../../assets/icons/reset.svg', () => ({ default: 'reset-icon' }));
vi.mock('../../assets/icons/disabled.svg', () => ({ default: 'disabled-icon' }));
vi.mock('../../assets/avatars/placeholder.svg', () => ({ default: 'placeholder' }));

const mockPet: Pet = {
  id: '1',
  name: 'Тестовый питомец',
  species: 'Кибер-кот',
  mood: 'happy',
  energy: 80,
  level: 3,
  avatar: '',
};

const renderWithContext = (ui: React.ReactElement, contextValue?: any) => {
  const defaultContext = {
    events: [],
    addEvent: vi.fn(),
    clearEvents: vi.fn(),
  };
  return render(
    <EventContext.Provider value={contextValue || defaultContext}>
      {ui}
    </EventContext.Provider>
  );
};

describe('PetCard', () => {
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('отключает кнопки действий при энергии = 0', () => {
    const disabledPet = { ...mockPet, energy: 0 };
    renderWithContext(<PetCard initialPet={disabledPet} onUpdate={mockOnUpdate} />);

    expect(screen.getByRole('button', { name: /кормить/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /уровень\+/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /подбодрить/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /сброс/i })).not.toBeDisabled();
  });

  it('повышение уровня не увеличивает энергию', async () => {
    const user = userEvent.setup();
    renderWithContext(<PetCard initialPet={mockPet} onUpdate={mockOnUpdate} />);

    const initialEnergy = mockPet.energy;
    const initialLevel = mockPet.level;

    const energyElement = screen.getByText(`${initialEnergy}%`);

    const levelUpButton = screen.getByRole('button', { name: /уровень\+/i });
    await user.click(levelUpButton);

    expect(mockOnUpdate).toHaveBeenCalledTimes(1);
    expect(mockOnUpdate).toHaveBeenCalledWith(mockPet.id, {
      level: initialLevel + 1,
    });

    await waitFor(() => {
      expect(energyElement.textContent).toBe(`${initialEnergy}%`);
    });
  });

  it('при подбадривании настроение повышается до максимального, а затем остаётся максимальным', async () => {
    const user = userEvent.setup();

    const sadPet = { ...mockPet, mood: 'sad' as const };
    const { rerender } = renderWithContext(<PetCard initialPet={sadPet} onUpdate={mockOnUpdate} />);

    const getMoodText = () => {
      const moodSpan = screen.getByText(/(Счастлив|Грустный|Довольный|В восторге)/i);
      return moodSpan.textContent;
    };

    await user.click(screen.getByRole('button', { name: /подбодрить/i }));
    expect(mockOnUpdate).toHaveBeenCalledWith(sadPet.id, { mood: 'content' });
    rerender(
      <EventContext.Provider value={{ events: [], addEvent: vi.fn(), clearEvents: vi.fn() }}>
        <PetCard initialPet={{ ...sadPet, mood: 'content' }} onUpdate={mockOnUpdate} />
      </EventContext.Provider>
    );
    expect(getMoodText()).toBe('Довольный');

    await user.click(screen.getByRole('button', { name: /подбодрить/i }));
    expect(mockOnUpdate).toHaveBeenCalledWith(sadPet.id, { mood: 'happy' });
    rerender(
      <EventContext.Provider value={{ events: [], addEvent: vi.fn(), clearEvents: vi.fn() }}>
        <PetCard initialPet={{ ...sadPet, mood: 'happy' }} onUpdate={mockOnUpdate} />
      </EventContext.Provider>
    );
    expect(getMoodText()).toBe('Счастлив');

    await user.click(screen.getByRole('button', { name: /подбодрить/i }));
    expect(mockOnUpdate).toHaveBeenCalledWith(sadPet.id, { mood: 'excited' });
    rerender(
      <EventContext.Provider value={{ events: [], addEvent: vi.fn(), clearEvents: vi.fn() }}>
        <PetCard initialPet={{ ...sadPet, mood: 'excited' }} onUpdate={mockOnUpdate} />
      </EventContext.Provider>
    );
    expect(getMoodText()).toBe('В восторге');

    await user.click(screen.getByRole('button', { name: /подбодрить/i }));
    expect(mockOnUpdate).toHaveBeenCalledWith(sadPet.id, { mood: 'excited' });
    rerender(
      <EventContext.Provider value={{ events: [], addEvent: vi.fn(), clearEvents: vi.fn() }}>
        <PetCard initialPet={{ ...sadPet, mood: 'excited' }} onUpdate={mockOnUpdate} />
      </EventContext.Provider>
    );
    expect(getMoodText()).toBe('В восторге');
  });
});
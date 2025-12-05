import { useEffect, useRef } from 'react';
import { PetState } from '../components/PetCard/types';

type UpdateEnergyFn = (id: string, newEnergy: number) => void;
type UpdateMoodFn = (id: string, newMood: PetState['mood']) => void;

export const usePetLifecycle = (
  pet: PetState,
  updateEnergy: UpdateEnergyFn,
  updateMood: UpdateMoodFn,
  options?: { intervalMs?: number; decrement?: number }
) => {
  const intervalMs = options?.intervalMs ?? 10000;
  const decrement = options?.decrement ?? 1;

  const currentEnergyRef = useRef<number>(pet.energy);

  useEffect(() => {
    currentEnergyRef.current = pet.energy;
  }, [pet.energy]);

  useEffect(() => {
    if (pet.energy <= 0) {
      return;
    }

    let mounted = true;
    const id = setInterval(() => {
      if (!mounted) return;
      const prev = currentEnergyRef.current;
      const next = Math.max(0, prev - decrement);
      if (next !== prev) {
        currentEnergyRef.current = next;
        updateEnergy(pet.id, next);

        if (next <= 0) {
          updateMood(pet.id, 'sad');
        } else if (next <= 20) {
          updateMood(pet.id, 'sad');
        } else if (next <= 50) {
          updateMood(pet.id, 'content');
        } else {
          updateMood(pet.id, 'happy');
        }
      }
    }, intervalMs);

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [pet.id, updateEnergy, updateMood, intervalMs, decrement]);
};

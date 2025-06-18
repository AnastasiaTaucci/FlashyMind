import type { Flashcard } from '@/types/Flashcard';

export function shuffle(array: Flashcard[]) {
  return [...array].sort(() => Math.random() - 0.5);
}

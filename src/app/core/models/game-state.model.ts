import { Hand } from './hand.model';
import { Tile } from './tile.model';

export type BetChoice = 'higher' | 'lower' | null;

export interface GameState {
  currentHand: Hand | null;
  previousHand: Hand | null;
  history: Hand[];
  drawPile: Tile[];
  discardPile: Tile[];
  score: number;
  reshuffleCount: number;
  lastBet: BetChoice;
  isGameOver: boolean;
  gameOverReason: string | null;
}
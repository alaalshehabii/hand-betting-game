import { Injectable } from '@angular/core';
import { DeckService } from './deck';
import { ScoringService } from './scoring';
import { GameState, BetChoice } from '../models/game-state.model';
import { Hand } from '../models/hand.model';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  private readonly handSize = 3;
  private readonly maxReshuffles = 3;

  private state: GameState = this.createInitialState();

  constructor(
    private deckService: DeckService,
    private scoringService: ScoringService
  ) {}

  getState(): GameState {
    return {
      ...this.state,
      history: [...this.state.history],
      drawPile: [...this.state.drawPile],
      discardPile: [...this.state.discardPile]
    };
  }

  startNewGame(): void {
    const drawPile = this.deckService.createFreshDeck();
    const { drawnTiles, updatedDrawPile } = this.deckService.drawTiles(drawPile, this.handSize);
    const firstHand = this.scoringService.createHand(drawnTiles);

    this.state = {
      currentHand: firstHand,
      previousHand: null,
      history: [],
      drawPile: updatedDrawPile,
      discardPile: [],
      score: 0,
      reshuffleCount: 0,
      lastBet: null,
      isGameOver: false,
      gameOverReason: null
    };
  }

  placeBet(betChoice: BetChoice): void {
    if (!betChoice || this.state.isGameOver || !this.state.currentHand) {
      return;
    }

    const previousHand = this.state.currentHand;

    this.addHandToDiscardPile(previousHand);
    const nextDrawResult = this.drawNextHand();

    if (!nextDrawResult) {
      return;
    }

    const nextHand = nextDrawResult;
    const comparisonResult = this.scoringService.compareHands(previousHand, nextHand);
    const didWin = this.scoringService.isBetCorrect(betChoice, comparisonResult);
    const resolvedHand = this.scoringService.updateSpecialTileValues(nextHand, didWin);

    this.state = {
      ...this.state,
      previousHand,
      currentHand: resolvedHand,
      history: [previousHand, ...this.state.history].slice(0, 10),
      score: didWin ? this.state.score + 1 : this.state.score,
      lastBet: betChoice
    };

    if (this.scoringService.hasAnyTileReachedLimit(resolvedHand)) {
      this.endGame('A special tile reached its value limit.');
    }
  }

  resetGame(): void {
    this.state = this.createInitialState();
  }

  private drawNextHand(): Hand | null {
    let drawPile = [...this.state.drawPile];
    let discardPile = [...this.state.discardPile];
    let reshuffleCount = this.state.reshuffleCount;

    if (drawPile.length < this.handSize) {
      reshuffleCount += 1;

      if (reshuffleCount >= this.maxReshuffles) {
        this.state = {
          ...this.state,
          reshuffleCount,
          isGameOver: true,
          gameOverReason: 'The draw pile ran out for the third time.'
        };
        return null;
      }

      const freshDeck = this.deckService.createFreshDeck();
      drawPile = this.deckService.reshuffleDeck([...discardPile, ...freshDeck]);
      discardPile = [];
    }

    const { drawnTiles, updatedDrawPile } = this.deckService.drawTiles(drawPile, this.handSize);
    const nextHand = this.scoringService.createHand(drawnTiles);

    this.state = {
      ...this.state,
      drawPile: updatedDrawPile,
      discardPile,
      reshuffleCount
    };

    return nextHand;
  }

  private addHandToDiscardPile(hand: Hand): void {
    this.state = {
      ...this.state,
      discardPile: [...this.state.discardPile, ...hand.tiles]
    };
  }

  private endGame(reason: string): void {
    this.state = {
      ...this.state,
      isGameOver: true,
      gameOverReason: reason
    };
  }

  private createInitialState(): GameState {
    return {
      currentHand: null,
      previousHand: null,
      history: [],
      drawPile: [],
      discardPile: [],
      score: 0,
      reshuffleCount: 0,
      lastBet: null,
      isGameOver: false,
      gameOverReason: null
    };
  }
}
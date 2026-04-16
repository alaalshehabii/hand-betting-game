
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state';
import { GameState } from '../../core/models/game-state.model';
import { Tile } from '../../core/models/tile.model';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './game.html',
  styleUrl: './game.scss',
})
export class Game {
  state: GameState;
  lastRoundMessage = 'Predict whether the next hand will be higher or lower.';
  isResolvingRound = false;
  resultTone: 'neutral' | 'correct' | 'wrong' = 'neutral';
  animateCards = false;

  constructor(
    private gameService: GameStateService,
    public router: Router
  ) {
    this.gameService.startNewGame();
    this.state = this.gameService.getState();
  }

  bet(choice: 'higher' | 'lower'): void {
    if (this.isResolvingRound || this.state.isGameOver || !this.state.currentHand) {
      return;
    }

    this.isResolvingRound = true;

    const previousTotal = this.state.currentHand.total;

    this.gameService.placeBet(choice);
    this.state = this.gameService.getState();

    const currentTotal = this.state.currentHand?.total ?? 0;

    if (this.state.isGameOver) {
      this.isResolvingRound = false;
      this.router.navigate(['/summary']);
      return;
    }

    if (currentTotal > previousTotal) {
      const wasCorrect = choice === 'higher';
      this.resultTone = wasCorrect ? 'correct' : 'wrong';
      this.lastRoundMessage = wasCorrect
        ? `Correct! The new hand is higher (${currentTotal} vs ${previousTotal}).`
        : `Wrong! The new hand is higher (${currentTotal} vs ${previousTotal}).`;
    } else if (currentTotal < previousTotal) {
      const wasCorrect = choice === 'lower';
      this.resultTone = wasCorrect ? 'correct' : 'wrong';
      this.lastRoundMessage = wasCorrect
        ? `Correct! The new hand is lower (${currentTotal} vs ${previousTotal}).`
        : `Wrong! The new hand is lower (${currentTotal} vs ${previousTotal}).`;
    } else {
      this.resultTone = 'neutral';
      this.lastRoundMessage = `Tie! The new hand is equal (${currentTotal} vs ${previousTotal}).`;
    }

    this.triggerCardAnimation();
    this.isResolvingRound = false;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  trackByIndex(index: number, _tile: Tile): number {
    return index;
  }

  private triggerCardAnimation(): void {
    this.animateCards = false;

    requestAnimationFrame(() => {
      this.animateCards = true;

      setTimeout(() => {
        this.animateCards = false;
      }, 420);
    });
  }
}



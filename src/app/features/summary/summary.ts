
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameStateService } from '../../core/services/game-state';
import { LeaderboardService } from '../../core/services/leaderboard';
import { GameState } from '../../core/models/game-state.model';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary.html',
  styleUrl: './summary.scss',
})
export class Summary {
  state: GameState;

  constructor(
    private router: Router,
    private gameStateService: GameStateService,
    private leaderboardService: LeaderboardService
  ) {
    this.state = this.gameStateService.getState();

    if (this.state.isGameOver) {
      this.leaderboardService.saveScore(this.state.score);
    }
  }

  playAgain(): void {
    this.gameStateService.startNewGame();
    this.router.navigate(['/game']);
  }

  goToLanding(): void {
    this.gameStateService.resetGame();
    this.router.navigate(['/']);
  }
}

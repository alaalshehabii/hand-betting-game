import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../core/services/leaderboard';
import { LeaderboardEntry } from '../../core/models/leaderboard-entry.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {
  topScores: LeaderboardEntry[] = [];

  constructor(
    private router: Router,
    private leaderboardService: LeaderboardService
  ) {
    this.topScores = this.leaderboardService.getTopScores();
  }

  startGame(): void {
    this.router.navigate(['/game']);
  }
}


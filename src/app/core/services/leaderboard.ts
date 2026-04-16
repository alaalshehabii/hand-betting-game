import { Injectable } from '@angular/core';
import { LeaderboardEntry } from '../models/leaderboard-entry.model';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private readonly storageKey = 'hand-betting-game-leaderboard';
  private readonly maxEntries = 5;

  getTopScores(): LeaderboardEntry[] {
    return this.getStoredScores()
      .sort((a, b) => b.score - a.score)
      .slice(0, this.maxEntries);
  }

  saveScore(score: number): void {
    const newEntry: LeaderboardEntry = {
      score,
      playedAt: new Date().toISOString(),
    };

    const updatedScores = [...this.getStoredScores(), newEntry];

    localStorage.setItem(this.storageKey, JSON.stringify(updatedScores));
  }

  clearScores(): void {
    localStorage.removeItem(this.storageKey);
  }

  private getStoredScores(): LeaderboardEntry[] {
    const stored = localStorage.getItem(this.storageKey);

    if (!stored) {
      return [];
    }

    try {
      return JSON.parse(stored) as LeaderboardEntry[];
    } catch {
      return [];
    }
  }
}
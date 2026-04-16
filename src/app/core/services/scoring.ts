import { Injectable } from '@angular/core';
import { Hand } from '../models/hand.model';
import { Tile } from '../models/tile.model';

export type HandComparisonResult = 'higher' | 'lower' | 'equal';

@Injectable({
  providedIn: 'root'
})
export class ScoringService {
  private readonly minimumSpecialTileValue = 0;
  private readonly maximumSpecialTileValue = 10;

  calculateHandTotal(tiles: Tile[]): number {
    return tiles.reduce((total, tile) => total + tile.currentValue, 0);
  }

  createHand(tiles: Tile[]): Hand {
    return {
      tiles,
      total: this.calculateHandTotal(tiles)
    };
  }

  compareHands(previousHand: Hand, currentHand: Hand): HandComparisonResult {
    if (currentHand.total > previousHand.total) {
      return 'higher';
    }

    if (currentHand.total < previousHand.total) {
      return 'lower';
    }

    return 'equal';
  }

  isBetCorrect(betChoice: 'higher' | 'lower', result: HandComparisonResult): boolean {
    if (result === 'equal') {
      return false;
    }

    return betChoice === result;
  }

  updateSpecialTileValues(hand: Hand, didWin: boolean): Hand {
    const updatedTiles = hand.tiles.map((tile) => {
      if (tile.category === 'number') {
        return tile;
      }

      const valueChange = didWin ? 1 : -1;

      return {
        ...tile,
        currentValue: tile.currentValue + valueChange
      };
    });

    return this.createHand(updatedTiles);
  }

  hasAnyTileReachedLimit(hand: Hand): boolean {
    return hand.tiles.some((tile) => {
      if (tile.category === 'number') {
        return false;
      }

      return (
        tile.currentValue === this.minimumSpecialTileValue ||
        tile.currentValue === this.maximumSpecialTileValue
      );
    });
  }
}
import { Injectable } from '@angular/core';
import { Tile, WindType, DragonType } from '../models/tile.model';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  private readonly copiesPerTile = 4;
  private readonly numberTileRanks = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  private readonly windTypes: WindType[] = ['east', 'south', 'west', 'north'];
  private readonly dragonTypes: DragonType[] = ['red', 'green', 'white'];
  private readonly specialTileStartingValue = 5;

  // Create a full deck
  createFreshDeck(): Tile[] {
    const numberTiles = this.createNumberTiles();
    const windTiles = this.createWindTiles();
    const dragonTiles = this.createDragonTiles();

    return this.shuffle([...numberTiles, ...windTiles, ...dragonTiles]);
  }

  // Draw tiles from the top of the deck
  drawTiles(drawPile: Tile[], count: number): { drawnTiles: Tile[]; updatedDrawPile: Tile[] } {
    const drawnTiles = drawPile.slice(0, count);
    const updatedDrawPile = drawPile.slice(count);

    return {
      drawnTiles,
      updatedDrawPile
    };
  }

  // Reshuffle discard pile into new draw pile
  reshuffleDeck(discardPile: Tile[]): Tile[] {
    return this.shuffle([...discardPile]);
  }

  // Fisher-Yates shuffle
  private shuffle<T>(items: T[]): T[] {
    const shuffled = [...items];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  private createNumberTiles(): Tile[] {
    const tiles: Tile[] = [];

    for (const rank of this.numberTileRanks) {
      for (let copy = 1; copy <= this.copiesPerTile; copy++) {
        tiles.push({
          id: `number-${rank}-${copy}`,
          category: 'number',
          label: `${rank}`,
          rank,
          currentValue: rank
        });
      }
    }

    return tiles;
  }

  private createWindTiles(): Tile[] {
    const tiles: Tile[] = [];

    for (const wind of this.windTypes) {
      for (let copy = 1; copy <= this.copiesPerTile; copy++) {
        tiles.push({
          id: `wind-${wind}-${copy}`,
          category: 'wind',
          label: this.formatLabel(wind, 'Wind'),
          windType: wind,
          currentValue: this.specialTileStartingValue
        });
      }
    }

    return tiles;
  }

  private createDragonTiles(): Tile[] {
    const tiles: Tile[] = [];

    for (const dragon of this.dragonTypes) {
      for (let copy = 1; copy <= this.copiesPerTile; copy++) {
        tiles.push({
          id: `dragon-${dragon}-${copy}`,
          category: 'dragon',
          label: this.formatLabel(dragon, 'Dragon'),
          dragonType: dragon,
          currentValue: this.specialTileStartingValue
        });
      }
    }

    return tiles;
  }

  private formatLabel(value: string, suffix: string): string {
    return `${value.charAt(0).toUpperCase() + value.slice(1)} ${suffix}`;
  }
}
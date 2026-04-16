import { Tile } from './tile.model';

export interface Hand {
  tiles: Tile[];
  total: number;
}
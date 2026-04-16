export type TileCategory = 'number' | 'dragon' | 'wind';

export type WindType = 'east' | 'south' | 'west' | 'north';
export type DragonType = 'red' | 'green' | 'white';

export interface Tile {
  id: string;
  category: TileCategory;
  label: string;
  rank?: number;
  windType?: WindType;
  dragonType?: DragonType;
  currentValue: number;
}
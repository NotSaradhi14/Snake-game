export type Point = {
  x: number;
  y: number;
};

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export type GameStatus = 'IDLE' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
  coverArt: string;
}

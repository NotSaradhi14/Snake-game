import { Track } from './types';

export const GRID_SIZE = 20;
export const INITIAL_SNAKE = [
  { x: 10, y: 10 },
  { x: 10, y: 11 },
  { x: 10, y: 12 },
];
export const INITIAL_DIRECTION = 'UP';
export const GAME_SPEED = 140;

export const NEON_COLORS = {
  primary: '#00ffff', // Cyan
  secondary: '#ff00ff', // Magenta
  accent: '#ffff00', // Yellow
  success: '#00ff00', // Green
  danger: '#ff0000', // Red
  bg: '#0a0a0c',
  surface: '#121217',
  border: '#1f1f27',
};

export const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Odyssey',
    artist: 'AI Synthwave',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '6:12',
    coverArt: 'https://picsum.photos/seed/synth1/200/200',
  },
  {
    id: '2',
    title: 'Crystal Grid',
    artist: 'Digital Echo',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '7:05',
    coverArt: 'https://picsum.photos/seed/synth2/200/200',
  },
  {
    id: '3',
    title: 'Retro Pulse',
    artist: 'Vector Runner',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '5:48',
    coverArt: 'https://picsum.photos/seed/synth3/200/200',
  },
];

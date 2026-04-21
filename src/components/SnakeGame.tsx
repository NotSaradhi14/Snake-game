import { useEffect, useRef, useState, useCallback } from 'react';
import { GameStatus, Direction, Point } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_DIRECTION, GAME_SPEED, NEON_COLORS } from '../constants';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, RotateCcw, Play, Pause } from 'lucide-react';

interface SnakeGameProps {
  onScoreChange: (score: number) => void;
}

export default function SnakeGame({ onScoreChange }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [snake, setSnake] = useState<Point[]>(INITIAL_SNAKE);
  const [direction, setDirection] = useState<Direction>(INITIAL_DIRECTION);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [status, setStatus] = useState<GameStatus>('IDLE');
  const [score, setScore] = useState(0);
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      if (!currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
        break;
      }
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateFood(INITIAL_SNAKE));
    setScore(0);
    onScoreChange(0);
    setStatus('IDLE');
  };

  const startGame = () => {
    if (status === 'GAME_OVER') {
      resetGame();
    }
    setStatus('PLAYING');
  };

  const togglePause = () => {
    if (status === 'PLAYING') setStatus('PAUSED');
    else if (status === 'PAUSED') setStatus('PLAYING');
  };

  const moveSnake = useCallback(() => {
    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Border collision
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE
      ) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      // Self collision
      if (prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus('GAME_OVER');
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Food collision
      if (newHead.x === food.x && newHead.y === food.y) {
        const newScore = score + 10;
        setScore(newScore);
        onScoreChange(newScore);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, score, onScoreChange, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': togglePause(); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction, status]);

  useEffect(() => {
    if (status === 'PLAYING') {
      gameLoopRef.current = setInterval(moveSnake, GAME_SPEED);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [status, moveSnake]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellSize = canvas.width / GRID_SIZE;

    // Clear background
    ctx.fillStyle = NEON_COLORS.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Grid (subtle)
    ctx.strokeStyle = NEON_COLORS.border;
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * cellSize, 0);
      ctx.lineTo(i * cellSize, canvas.height);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i * cellSize);
      ctx.lineTo(canvas.width, i * cellSize);
      ctx.stroke();
    }

    // Draw Food
    ctx.fillStyle = NEON_COLORS.secondary;
    ctx.shadowBlur = 15;
    ctx.shadowColor = NEON_COLORS.secondary;
    ctx.beginPath();
    ctx.roundRect(food.x * cellSize + 2, food.y * cellSize + 2, cellSize - 4, cellSize - 4, 4);
    ctx.fill();

    // Draw Snake
    snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? NEON_COLORS.primary : NEON_COLORS.primary + 'AA';
      ctx.shadowBlur = index === 0 ? 20 : 10;
      ctx.shadowColor = NEON_COLORS.primary;
      ctx.beginPath();
      ctx.roundRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2, index === 0 ? 6 : 4);
      ctx.fill();
    });

    ctx.shadowBlur = 0;

  }, [snake, food]);

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-magenta-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
      
      <div className="relative flex flex-col items-center bg-[#0a0a0c] p-6 rounded-xl border border-white/5 overflow-hidden">
        {/* HUD */}
        <div className="w-full flex justify-between items-center mb-4 font-mono">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-white/60 text-xs uppercase tracking-widest">Score</span>
            <span className="text-xl font-bold text-white tabular-nums">{score.toString().padStart(4, '0')}</span>
          </div>
          <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${status === 'PLAYING' ? 'bg-green-500 animate-pulse shadow-[0_0_8px_#22c55e]' : 'bg-red-500'}`} />
             <span className="text-xs uppercase tracking-tighter text-white/40">{status}</span>
          </div>
        </div>

        {/* Canvas Stage */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={400}
            height={400}
            className="rounded-lg border border-white/10"
          />

          <AnimatePresence>
            {status !== 'PLAYING' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-lg"
              >
                <div className="text-center p-8">
                  {status === 'IDLE' && (
                    <>
                      <h2 className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">Neon Snake</h2>
                      <p className="text-white/50 mb-6 text-sm">Use arrow keys to move</p>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-cyan-500 text-black font-bold rounded-full hover:bg-cyan-400 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Play size={20} fill="black" /> START GAME
                      </button>
                    </>
                  )}

                  {status === 'PAUSED' && (
                    <>
                      <h2 className="text-3xl font-black text-white mb-6 tracking-tighter uppercase italic">Paused</h2>
                      <button
                        onClick={togglePause}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Play size={20} fill="black" /> RESUME
                      </button>
                    </>
                  )}

                  {status === 'GAME_OVER' && (
                    <>
                      <h2 className="text-4xl font-black text-red-500 mb-2 tracking-tighter uppercase italic">Crashed</h2>
                      <div className="mb-6">
                        <p className="text-white/40 text-xs uppercase tracking-widest">Final Scorce</p>
                        <p className="text-4xl font-bold text-white tracking-widest tabular-nums">{score}</p>
                      </div>
                      <button
                        onClick={startGame}
                        className="px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-white/90 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <RotateCcw size={20} /> REBOOT
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, FastForward, Rewind, Volume2, VolumeX, Settings2 } from 'lucide-react';

interface PlayerProps {
  isPlaying: boolean;
  onPlayPause: () => void;
  onSeek: (time: number) => void;
  onRewind: (seconds: number) => void;
  onForward: (seconds: number) => void;
  onSpeedChange: (speed: number) => void;
  onVolumeChange: (volume: number) => void;
  currentTime: number;
  duration: number;
  currentSpeed: number;
  currentVolume: number;
}

const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

const Player: React.FC<PlayerProps> = ({ 
  isPlaying, 
  onPlayPause, 
  onSeek, 
  onRewind, 
  onForward, 
  onSpeedChange,
  onVolumeChange,
  currentTime, 
  duration,
  currentSpeed,
  currentVolume
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [sliderValue, setSliderValue] = useState(0);
  const [showVolume, setShowVolume] = useState(false);

  useEffect(() => {
    if (!isDragging) setSliderValue(currentTime);
  }, [currentTime, isDragging]);

  const handleSeekStart = () => setIsDragging(true);
  const handleSeekEnd = (e: React.ChangeEvent<HTMLInputElement> | React.TouchEvent | React.MouseEvent) => {
    setIsDragging(false);
    // Type guard for input element
    if ('value' in e.target) {
        onSeek(Number((e.target as HTMLInputElement).value));
    }
  };

  const progress = duration > 0 ? (sliderValue / duration) * 100 : 0;
  const SPEEDS = [0.25, 0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

  return (
    <div className="sticky top-0 z-40 w-full bg-background border-b border-border transition-all duration-500">
      <div className="max-w-4xl mx-auto px-4 py-3 md:py-4">
        <div className="flex flex-col gap-2">
          
          {/* Top Row: Controls & Info */}
          <div className="flex items-center justify-between">
            
            {/* Playback Controls */}
            <div className="flex items-center gap-4 md:gap-6">
               <button 
                onClick={() => onRewind(5)}
                className="text-neutral-400 hover:text-foreground transition-colors active:scale-90"
              >
                <Rewind size={20} strokeWidth={1.5} />
              </button>

              <button 
                onClick={onPlayPause}
                className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-accent text-accent-text shadow-glow hover:scale-105 active:scale-95 transition-all duration-300"
              >
                {isPlaying ? (
                  <Pause size={18} fill="currentColor" stroke="none" />
                ) : (
                  <Play size={18} fill="currentColor" stroke="none" className="ml-0.5" />
                )}
              </button>

              <button 
                onClick={() => onForward(10)}
                className="text-neutral-400 hover:text-foreground transition-colors active:scale-90"
              >
                <FastForward size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Time & Speed */}
            <div className="flex items-center gap-4">
                <div className="hidden md:flex items-center gap-2 group relative">
                    <button 
                        onClick={() => setShowVolume(!showVolume)}
                        className="text-neutral-400 hover:text-foreground transition-colors"
                    >
                        {currentVolume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                    </button>
                    {/* Desktop Volume Slider popout */}
                    <div className="w-20 h-1 bg-border rounded-full overflow-hidden cursor-pointer group-hover:w-24 transition-all">
                        <div className="h-full bg-foreground" style={{width: `${currentVolume * 100}%`}} />
                         <input 
                            type="range" min="0" max="1" step="0.1"
                            value={currentVolume}
                            onChange={(e) => onVolumeChange(Number(e.target.value))}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                    </div>
                </div>

                <button 
                    onClick={() => {
                        const nextIdx = (SPEEDS.indexOf(currentSpeed) + 1) % SPEEDS.length;
                        onSpeedChange(SPEEDS[nextIdx]);
                    }}
                    className="text-xs font-semibold font-mono text-neutral-500 hover:text-foreground px-2 py-1 rounded bg-surface border border-border transition-colors w-12 text-center"
                >
                    {currentSpeed}x
                </button>
            </div>
          </div>

          {/* Bottom Row: Scrubber */}
          <div className="flex items-center gap-3 pt-1">
             <span className="text-[10px] font-mono text-neutral-400 w-8 text-right tabular-nums">{formatTime(sliderValue)}</span>
             
             <div className="relative flex-1 h-3 flex items-center group cursor-pointer">
                {/* Track */}
                <div className="absolute w-full h-[2px] bg-border rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-foreground transition-all duration-100 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
                {/* Thumb (only visible on hover/drag) */}
                <div 
                    className={`absolute h-3 w-3 bg-accent border-2 border-background rounded-full shadow-sm transition-opacity duration-200 pointer-events-none ${isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100'}`}
                    style={{ left: `calc(${progress}% - 6px)` }}
                />
                
                <input 
                    type="range" min="0" max={duration || 0} step="0.01"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(Number(e.target.value))}
                    onMouseDown={handleSeekStart}
                    onTouchStart={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchEnd={handleSeekEnd}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
             </div>

             <span className="text-[10px] font-mono text-neutral-400 w-8 tabular-nums">{formatTime(duration)}</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Player;
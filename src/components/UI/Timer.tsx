import React from 'react';
import { useTimer } from '../../hooks/useTimer';

interface TimerProps {
  seconds: number;
}

export const Timer: React.FC<TimerProps> = ({ seconds }) => {
  const { timeLeft, isActive, start, pause, reset } = useTimer(seconds);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="timer-control">
      <span className="timer-display">{formatTime(timeLeft)}</span>
      <div className="timer-buttons">
        {!isActive ? (
          <button onClick={start}>Старт</button>
        ) : (
          <button onClick={pause}>Пауза</button>
        )}
        <button onClick={reset}>Скинути</button>
      </div>
    </div>
  );
};
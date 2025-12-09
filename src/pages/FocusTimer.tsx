import { useState, useRef, useEffect } from 'react';
import { db } from '../firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const DEFAULT_FOCUS_MINUTES = 25;
const DEFAULT_BREAK_MINUTES = 5;

export default function FocusTimer() {
  const [minutes, setMinutes] = useState<number>(DEFAULT_FOCUS_MINUTES);
  const [seconds, setSeconds] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);
  const [sessions, setSessions] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isRunning) return;

    const id = window.setInterval(() => {
      setSeconds((sec) => {
        if (sec === 0) {
          if (minutes === 0) {
            // End of current period
            clearInterval(id);
            if (!isBreak) {
              // Completed a focus session
              addDoc(collection(db, 'focus_sessions'), {
                completedAt: Timestamp.now(),
                duration: DEFAULT_FOCUS_MINUTES,
              }).catch(console.error);
              setSessions((s) => s + 1);
              setIsBreak(true);
              setMinutes(DEFAULT_BREAK_MINUTES);
              setSeconds(0);
            } else {
              // End of break
              setIsBreak(false);
              setMinutes(DEFAULT_FOCUS_MINUTES);
              setSeconds(0);
            }
            setIsRunning(false);
            return 0;
          }
          setMinutes((m) => m - 1);
          return 59;
        }
        return sec - 1;
      });
    }, 1000);

    // Save interval id for external reference if needed
    timerRef.current = id;

    return () => clearInterval(id);
  }, [isRunning, minutes, isBreak]);

  const startTimer = () => setIsRunning(true);
  const pauseTimer = () => setIsRunning(false);
  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setMinutes(DEFAULT_FOCUS_MINUTES);
    setSeconds(0);
  };

  return (
    <div style={{ maxWidth: 320, margin: 'auto', padding: 24 }}>
      <h2>{isBreak ? 'Break Time' : 'Focus Time'}</h2>
      <div style={{ fontSize: 48, marginBottom: 16 }}>
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button onClick={startTimer} disabled={isRunning}>Start</button>
        <button onClick={pauseTimer} disabled={!isRunning}>Pause</button>
        <button onClick={resetTimer}>Reset</button>
      </div>
      <div>Sessions completed: {sessions}</div>
    </div>
  );
}
import * as React from "react";
export interface UseCountdownOptions { initialSeconds: number; onComplete?: () => void; }
export interface UseCountdownReturn { seconds: number; isRunning: boolean; start: () => void; pause: () => void; reset: () => void; }
export function useCountdown({ initialSeconds, onComplete }: UseCountdownOptions): UseCountdownReturn {
  const [seconds, setSeconds] = React.useState(initialSeconds);
  const [running, setRunning] = React.useState(false);
  const intervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  React.useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { setRunning(false); if (intervalRef.current) clearInterval(intervalRef.current); onComplete?.(); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, onComplete]);
  return {
    seconds, isRunning: running,
    start:  () => { if (seconds > 0) setRunning(true); },
    pause:  () => setRunning(false),
    reset:  () => { setRunning(false); setSeconds(initialSeconds); },
  };
}

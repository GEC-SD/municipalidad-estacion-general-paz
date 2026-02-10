import { useState, useCallback, useRef, useEffect } from 'react';

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 60_000; // 1 minute

interface RateLimitState {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsLeft: number;
  registerAttempt: () => boolean; // returns true if allowed
  reset: () => void;
}

export const useRateLimit = (): RateLimitState => {
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [isLocked, setIsLocked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lockEndRef = useRef<number>(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLockout = useCallback(() => {
    setIsLocked(true);
    lockEndRef.current = Date.now() + LOCKOUT_DURATION_MS;
    setRemainingSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));

    clearTimer();
    timerRef.current = setInterval(() => {
      const remaining = lockEndRef.current - Date.now();
      if (remaining <= 0) {
        clearTimer();
        setIsLocked(false);
        setRemainingSeconds(0);
        setAttemptsLeft(MAX_ATTEMPTS);
      } else {
        setRemainingSeconds(Math.ceil(remaining / 1000));
      }
    }, 1000);
  }, [clearTimer]);

  const registerAttempt = useCallback((): boolean => {
    if (isLocked) return false;

    const next = attemptsLeft - 1;
    if (next <= 0) {
      setAttemptsLeft(0);
      startLockout();
      return false;
    }

    setAttemptsLeft(next);
    return true;
  }, [isLocked, attemptsLeft, startLockout]);

  const reset = useCallback(() => {
    clearTimer();
    setIsLocked(false);
    setRemainingSeconds(0);
    setAttemptsLeft(MAX_ATTEMPTS);
  }, [clearTimer]);

  useEffect(() => {
    return clearTimer;
  }, [clearTimer]);

  return { isLocked, remainingSeconds, attemptsLeft, registerAttempt, reset };
};

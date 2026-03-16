import * as React from "react";
export interface UseStepOptions { steps: number; initialStep?: number; }
export interface UseStepReturn { step: number; isFirst: boolean; isLast: boolean; progress: number; next: () => void; prev: () => void; goTo: (s: number) => void; reset: () => void; }
export function useStep({ steps, initialStep = 0 }: UseStepOptions): UseStepReturn {
  const [step, setStep] = React.useState(initialStep);
  return {
    step, isFirst: step === 0, isLast: step === steps - 1,
    progress: steps <= 1 ? 100 : (step / (steps - 1)) * 100,
    next:  () => setStep(s => Math.min(s + 1, steps - 1)),
    prev:  () => setStep(s => Math.max(s - 1, 0)),
    goTo:  (s) => setStep(Math.min(Math.max(0, s), steps - 1)),
    reset: () => setStep(initialStep),
  };
}

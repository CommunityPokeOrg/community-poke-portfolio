import { useCallback, useEffect, useRef, useState } from "react";
import type { Tone } from "../data/quips";

const STORAGE_KEY = "cp:sound";

type Cue = Tone | "tick" | "select" | "open";

/** Frequencies (Hz) and envelope per cue. Everything is synthesised; there are no audio files. */
const cues: Record<Cue, { notes: number[]; type: OscillatorType; gain: number; decay: number }> = {
  tick: { notes: [880], type: "square", gain: 0.04, decay: 0.05 },
  select: { notes: [523, 784], type: "triangle", gain: 0.06, decay: 0.12 },
  open: { notes: [392, 523, 659], type: "sine", gain: 0.06, decay: 0.2 },
  dry: { notes: [220, 330], type: "sawtooth", gain: 0.05, decay: 0.18 },
  chaos: { notes: [660, 440, 880, 550], type: "square", gain: 0.05, decay: 0.09 },
  warm: { notes: [262, 330, 392], type: "sine", gain: 0.07, decay: 0.28 },
  ominous: { notes: [110, 116], type: "sawtooth", gain: 0.06, decay: 0.5 },
};

function readPref(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === "on";
  } catch {
    return false;
  }
}

/**
 * Opt-in synthesised UI sound. Off by default, persisted, and a no-op when the
 * Web Audio API is unavailable (`supported === false`).
 */
export function useSound() {
  const [enabled, setEnabled] = useState(readPref);
  const [supported, setSupported] = useState(() => typeof window !== "undefined" && "AudioContext" in window);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, enabled ? "on" : "off");
    } catch {
      /* storage unavailable: preference is session-only */
    }
  }, [enabled]);

  const play = useCallback(
    (cue: Cue) => {
      if (!enabled || !supported) return;
      try {
        const ctx = (ctxRef.current ??= new AudioContext());
        if (ctx.state === "suspended") void ctx.resume();
        const spec = cues[cue];
        const now = ctx.currentTime;
        spec.notes.forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const t = now + i * (spec.decay * 0.6);
          osc.type = spec.type;
          osc.frequency.setValueAtTime(freq, t);
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(spec.gain, t + 0.008);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + spec.decay);
          osc.connect(gain).connect(ctx.destination);
          osc.start(t);
          osc.stop(t + spec.decay + 0.02);
        });
      } catch {
        setSupported(false);
      }
    },
    [enabled, supported],
  );

  const toggle = useCallback(() => {
    setEnabled((v) => {
      const next = !v;
      if (next && supported) {
        // play a confirmation immediately so the user knows it worked
        queueMicrotask(() => {
          try {
            const ctx = (ctxRef.current ??= new AudioContext());
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = "triangle";
            osc.frequency.value = 660;
            gain.gain.setValueAtTime(0.06, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.17);
          } catch {
            setSupported(false);
          }
        });
      }
      return next;
    });
  }, [supported]);

  return { enabled, supported, play, toggle };
}

export type SoundApi = ReturnType<typeof useSound>;

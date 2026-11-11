// A short, low two-note chime (under a second), made with the Web Audio API: no file to load.
// Only ever called after a tap or when the person turned the sound on, never on its own.
export function playCelebrationSound(): void {
  try {
    const context = new AudioContext();
    const start = context.currentTime;
    [
      { frequency: 262, at: 0 },
      { frequency: 392, at: 0.18 },
    ].forEach(({ frequency, at }) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start + at);
      gain.gain.exponentialRampToValueAtTime(0.18, start + at + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + at + 0.5);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start + at);
      oscillator.stop(start + at + 0.55);
    });
    window.setTimeout(() => void context.close(), 1000);
  } catch {
    // No audio available: the popup works the same.
  }
}

/**
 * Web Audio API Ambient Sound Synthesizer
 * Generates an ethereal, deep-space cinematic hum with zero external audio assets.
 * 100% offline exhibition ready.
 */

class AmbientAudioService {
  private ctx: AudioContext | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying: boolean = false;

  public init() {
    if (this.ctx) return;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AudioContextClass();
  }

  public play() {
    this.init();
    if (!this.ctx) return;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.isPlaying) return;

    // Master Gain
    this.gainNode = this.ctx.createGain();
    this.gainNode.gain.setValueAtTime(0.01, this.ctx.currentTime);
    this.gainNode.gain.exponentialRampToValueAtTime(0.12, this.ctx.currentTime + 3.0); // smooth fade in
    this.gainNode.connect(this.ctx.destination);

    // Deep sub-drone (55Hz / A1)
    this.osc1 = this.ctx.createOscillator();
    this.osc1.type = 'sine';
    this.osc1.frequency.setValueAtTime(55, this.ctx.currentTime);

    // Binaural spatial detune (55.5Hz)
    this.osc2 = this.ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(55.6, this.ctx.currentTime);

    // Low pass filter for soft velvety ambient sound
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.osc1.connect(filter);
    this.osc2.connect(filter);
    filter.connect(this.gainNode);

    this.osc1.start();
    this.osc2.start();
    this.isPlaying = true;
  }

  public pause() {
    if (!this.ctx || !this.gainNode || !this.isPlaying) return;

    // Smooth fade out
    this.gainNode.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.8);
    setTimeout(() => {
      if (this.osc1) {
        this.osc1.stop();
        this.osc1.disconnect();
        this.osc1 = null;
      }
      if (this.osc2) {
        this.osc2.stop();
        this.osc2.disconnect();
        this.osc2 = null;
      }
      this.isPlaying = false;
    }, 850);
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.pause();
      return false;
    } else {
      this.play();
      return true;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientAudioService();


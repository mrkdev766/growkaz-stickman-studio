#!/usr/bin/env python3
"""
build_sound_pack.py — Synthesize a complete library of 100% royalty-free,
broadcast-ready sound effects for documentary video production (whooshes, hits,
glitches, clicks, risers, paper slides).
"""
import os
import wave
import struct
import numpy as np
from pathlib import Path

SR = 44100

def write_wav(path, data):
    # Ensure float in range [-1, 1]
    data = np.clip(data, -0.98, 0.98)
    int_data = (data * 32767).astype(np.int16)
    with wave.open(str(path), 'w') as wf:
        wf.setnchannels(1)
        wf.setsampwidth(2)
        wf.setframerate(SR)
        wf.writeframes(int_data.tobytes())
    print(f"  🔊 Created: {Path(path).name} ({len(data)/SR:.2f}s)")

def make_whoosh_fast():
    # 0.45s fast camera whoosh
    t = np.linspace(0, 0.45, int(SR * 0.45))
    noise = np.random.uniform(-1, 1, len(t))
    # Gaussian bell envelope centered around t = 0.22
    env = np.exp(-((t - 0.22) ** 2) / (2 * (0.07 ** 2)))
    # Modulated resonant sine
    freq = 300 + 1200 * np.exp(-((t - 0.22) ** 2) / (2 * (0.08 ** 2)))
    phase = 2 * np.pi * np.cumsum(freq) / SR
    sig = (noise * 0.7 + np.sin(phase) * 0.4) * env
    return sig

def make_whoosh_deep():
    # 0.7s deep cinematic whoosh
    t = np.linspace(0, 0.7, int(SR * 0.7))
    noise = np.random.uniform(-1, 1, len(t))
    env = np.exp(-((t - 0.35) ** 2) / (2 * (0.12 ** 2)))
    # Sub pitch sweep
    freq = 60 + 160 * np.exp(-((t - 0.32) ** 2) / (2 * (0.15 ** 2)))
    phase = 2 * np.pi * np.cumsum(freq) / SR
    sub = np.sin(phase) * 0.6
    sig = (noise * 0.4 + sub) * env
    return sig

def make_sub_boom():
    # 1.4s dramatic revelation impact
    t = np.linspace(0, 1.4, int(SR * 1.4))
    # Exponential frequency drop from 120Hz to 38Hz
    freq = 38 + (120 - 38) * np.exp(-t * 9)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    # Punch transient + long rumble decay
    punch = np.exp(-t * 14) * 0.7
    rumble = np.exp(-t * 2.8) * 0.6
    # Subtle harmonic saturation
    tone = np.sin(phase) + 0.3 * np.sin(phase * 2)
    sig = np.tanh(tone * 1.5) * (punch + rumble)
    return sig

def make_digital_glitch():
    # 0.35s digital data corruption / glitch
    t = np.linspace(0, 0.35, int(SR * 0.35))
    sig = np.zeros_like(t)
    # Stuttering blocks
    block_len = int(SR * 0.04)
    for b in range(0, len(t), block_len):
        f = np.random.choice([800, 1200, 440, 2400, 180])
        block_t = t[b:b+block_len]
        wave_type = np.random.choice(['square', 'noise', 'saw'])
        if wave_type == 'square':
            seg = np.sign(np.sin(2 * np.pi * f * block_t)) * 0.5
        elif wave_type == 'noise':
            seg = np.random.uniform(-0.6, 0.6, len(block_t))
        else:
            seg = (2 * (block_t * f % 1) - 1) * 0.5
        sig[b:b+block_len] = seg[:len(sig[b:b+block_len])]
    env = np.exp(-t * 4) * (t < 0.32)
    return sig * env

def make_camera_shutter():
    # 0.28s double click mechanical shutter
    t = np.linspace(0, 0.28, int(SR * 0.28))
    sig = np.zeros_like(t)
    # First click at t = 0.02
    t1 = t - 0.02
    c1 = (np.random.uniform(-1, 1, len(t)) * 0.6 + np.sin(2 * np.pi * 3200 * t) * 0.4) * np.exp(-np.maximum(0, t1) * 90) * (t1 >= 0)
    # Second click at t = 0.12
    t2 = t - 0.12
    c2 = (np.random.uniform(-1, 1, len(t)) * 0.8 + np.sin(2 * np.pi * 2600 * t) * 0.5) * np.exp(-np.maximum(0, t2) * 80) * (t2 >= 0)
    return c1 + c2

def make_paper_slide():
    # 0.4s document / evidence sliding on desk
    t = np.linspace(0, 0.4, int(SR * 0.4))
    noise = np.random.uniform(-1, 1, len(t))
    # Filter envelope: rising friction, brief plateau, soft stop
    env = np.sin(np.pi * np.clip(t / 0.4, 0, 1)) ** 1.5
    # Bandpass filter simulation via smoothing
    smoothed = np.convolve(noise, np.ones(8)/8, mode='same')
    return smoothed * env * 0.65

def make_button_click():
    # 0.08s high-tech UI mouse / button click
    t = np.linspace(0, 0.08, int(SR * 0.08))
    f = 2400
    click = np.sin(2 * np.pi * f * t) * np.exp(-t * 120)
    noise = np.random.uniform(-1, 1, len(t)) * np.exp(-t * 160)
    return (click * 0.6 + noise * 0.4)

def make_riser_tension():
    # 2.8s rising tension before a beat drop
    t = np.linspace(0, 2.8, int(SR * 2.8))
    # Frequency smoothly rises from 160Hz to 950Hz
    freq = 160 * (950 / 160) ** (t / 2.8)
    phase = 2 * np.pi * np.cumsum(freq) / SR
    # Volume ramps up
    env = (t / 2.8) ** 2.2
    # Tremolo modulation
    tremolo = 1 + 0.3 * np.sin(2 * np.pi * 8 * t)
    # Shephard-like harmonic blend
    tone = np.sin(phase) + 0.4 * np.sin(phase * 2) + 0.2 * np.sin(phase * 3)
    return tone * env * tremolo * 0.6

def main():
    out_dir = Path(__file__).resolve().parent.parent / "assets" / "sfx"
    out_dir.mkdir(parents=True, exist_ok=True)
    print(f"📦 Synthesizing Broadcast Sound Pack into: {out_dir}")

    sounds = {
        "whoosh_fast.wav": make_whoosh_fast(),
        "whoosh_deep.wav": make_whoosh_deep(),
        "sub_boom.wav": make_sub_boom(),
        "digital_glitch.wav": make_digital_glitch(),
        "camera_shutter.wav": make_camera_shutter(),
        "paper_slide.wav": make_paper_slide(),
        "button_click.wav": make_button_click(),
        "riser_tension.wav": make_riser_tension(),
    }

    for name, data in sounds.items():
        write_wav(out_dir / name, data)

    print("✅ All 8 sound effects synthesized successfully!")

if __name__ == "__main__":
    main()


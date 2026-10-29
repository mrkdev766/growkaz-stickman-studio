// assets/overlays/overlays.js — Reusable cinematic post-processing & overlays
import { E, V, alpha, radGrad, rr, seg } from '/engine/core.js';

// 1. Cinematic Anamorphic Letterbox Bars (e.g. 2.39:1 widescreen)
export function letterbox(g, ratio = 2.39) {
  const targetH = E.W / ratio;
  if (targetH >= E.H) return;
  const barH = (E.H - targetH) / 2;
  g.save();
  g.fillStyle = '#000000';
  g.fillRect(0, 0, E.W, barH);
  g.fillRect(0, E.H - barH, E.W, barH);
  g.restore();
}

// 2. Cinematic Lens Vignette (radial falloff to edge darkness)
export function vignette(g, intensity = 0.45) {
  g.save();
  const maxR = Math.hypot(E.W / 2, E.H / 2);
  const gr = radGrad(g, E.W / 2, E.H / 2, maxR * 0.45, maxR, [
    'rgba(0,0,0,0)',
    alpha('#000000', intensity * 0.5),
    alpha('#000000', intensity)
  ]);
  g.fillStyle = gr;
  g.fillRect(0, 0, E.W, E.H);
  g.restore();
}

// 3. CRT Monitor Scanlines (for hacking / surveillance / news playback)
export function crtScanlines(g, spacing = 4, opacity = 0.12) {
  g.save();
  g.strokeStyle = `rgba(0, 0, 0, ${opacity})`;
  g.lineWidth = 1;
  for (let y = 0; y < E.H; y += spacing) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(E.W, y);
    g.stroke();
  }
  g.restore();
}

// 4. Surveillance Target Reticle HUD
export function targetReticle(g, x, y, size = 60, color = '#ff1744') {
  g.save();
  g.strokeStyle = color;
  g.lineWidth = 2;
  const len = size * 0.3;
  // Top-left
  seg(g, [[x - size/2, y - size/2 + len], [x - size/2, y - size/2], [x - size/2 + len, y - size/2]], 2, color);
  // Top-right
  seg(g, [[x + size/2 - len, y - size/2], [x + size/2, y - size/2], [x + size/2, y - size/2 + len]], 2, color);
  // Bottom-left
  seg(g, [[x - size/2, y + size/2 - len], [x - size/2, y + size/2], [x - size/2 + len, y + size/2]], 2, color);
  // Bottom-right
  seg(g, [[x + size/2 - len, y + size/2], [x + size/2, y + size/2], [x + size/2, y + size/2 - len]], 2, color);
  // Center crosshair dot
  g.fillStyle = color;
  g.beginPath();
  g.arc(x, y, 2.5, 0, Math.PI * 2);
  g.fill();
  g.restore();
}

// 5. Dynamic Audio Waveform Visualizer
export function audioVisualizer(g, t, x, y, w = 180, h = 40, bars = 16, color = '#00e5ff') {
  g.save();
  const bw = (w / bars) * 0.65;
  const gap = w / bars;
  for (let i = 0; i < bars; i++) {
    const wave = Math.abs(Math.sin(t * 12 + i * 0.8) * Math.cos(t * 7 + i * 0.3));
    const bh = Math.max(4, h * wave);
    const bx = x + i * gap;
    const by = y - bh / 2;
    rr(g, bx, by, bw, bh, bw / 2);
    g.fillStyle = color;
    g.fill();
  }
  g.restore();
}


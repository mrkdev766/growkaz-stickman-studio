// s03.js — The Crush Face Swap (6.8s – 8.4s)
// Line: "Your crush..."
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';

preloadImages([BG.cosmicVoid]);

registerShot('s03', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 1.6;
    const p = clamp(t / dur, 0, 1);

    // Camera: playful slight Dutch tilt and float
    const cam = {
      x: lerp(-5, 5, Math.sin(t * 3)),
      y: lerp(0, -8, ease.out(p)),
      z: lerp(1.15, 1.22, ease.out(p))
    };

    // Layer 1: Dreamy pastel pink & deep purple vignette
    layer(g, cam, 0.3, (gx) => {
      const grad = gx.createRadialGradient(E.W * 0.5, E.H * 0.45, 80, E.W * 0.5, E.H * 0.45, 900);
      grad.addColorStop(0, 'rgba(244, 63, 94, 0.35)');
      grad.addColorStop(0.5, 'rgba(136, 19, 55, 0.45)');
      grad.addColorStop(1, 'rgba(15, 7, 20, 0.95)');
      gx.fillStyle = grad;
      gx.fillRect(0, 0, E.W, E.H);
    });

    // Layer 2: Floating pastel hearts & sparkle glints
    layer(g, cam, 0.6, (gx) => {
      for (let i = 0; i < 7; i++) {
        const hx = E.W * (0.35 + (i * 0.06)) + Math.sin(t * 2 + i) * 20;
        const hy = E.H * 0.65 - ((t * 80 + i * 45) % 350);
        const hs = 12 + (i % 3) * 6;

        gx.save();
        gx.fillStyle = 'rgba(251, 113, 133, 0.65)';
        gx.beginPath();
        gx.moveTo(hx, hy);
        gx.bezierCurveTo(hx - hs / 2, hy - hs / 2, hx - hs, hy + hs / 3, hx, hy + hs);
        gx.bezierCurveTo(hx + hs, hy + hs / 3, hx + hs / 2, hy - hs / 2, hx, hy);
        gx.fill();
        gx.restore();
      }
    });

    // Layer 3: Character with Cute Crush Swap Props
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.5;
      const figY = E.H * 0.85;

      // Cute bashful pose (waving gently, body slightly tilted)
      drawFigure(gx, {
        x: figX,
        y: figY,
        s: 1.45,
        facing: 1,
        pose: POSES.wave,
        outfit: { top: 'hoodie', color: '#f43f5e' },
        rim: { dir: [-0.6, -0.6], w: 6, color: '#fb7185' }
      });

      // Crush Face overlay props
      const hx = figX - 10;
      const hy = figY - 265;

      gx.save();

      // 1. Rosy Blushing Cheeks (soft pink radial circles)
      gx.fillStyle = 'rgba(244, 63, 94, 0.65)';
      gx.beginPath();
      gx.ellipse(hx - 22, hy + 8, 11, 7, 0, 0, Math.PI * 2);
      gx.ellipse(hx + 22, hy + 8, 11, 7, 0, 0, Math.PI * 2);
      gx.fill();

      // 2. Giant Sparkling Anime Star Eyes ✨
      const eyeSparkle = (Math.sin(t * 8) + 1) * 0.5;
      [-14, 14].forEach((ox) => {
        // Eye oval background
        gx.fillStyle = '#ffffff';
        gx.beginPath();
        gx.ellipse(hx + ox, hy - 4, 10, 14, 0, 0, Math.PI * 2);
        gx.fill();
        gx.strokeStyle = '#0f172a';
        gx.lineWidth = 2.5;
        gx.stroke();

        // Dark pupil
        gx.fillStyle = '#1e1b4b';
        gx.beginPath();
        gx.ellipse(hx + ox, hy - 2, 7, 10, 0, 0, Math.PI * 2);
        gx.fill();

        // 4-point star catchlight
        gx.fillStyle = '#ffffff';
        const starSize = 4 + eyeSparkle * 2;
        gx.beginPath();
        gx.moveTo(hx + ox - 2, hy - 5 - starSize);
        gx.lineTo(hx + ox, hy - 5);
        gx.lineTo(hx + ox - 2, hy - 5 + starSize);
        gx.lineTo(hx + ox - 4, hy - 5);
        gx.fill();
      });

      // 3. Cute Happy Mouth (subtle smile arc)
      gx.strokeStyle = '#e11d48';
      gx.lineWidth = 3;
      gx.lineCap = 'round';
      gx.beginPath();
      gx.arc(hx, hy + 12, 8, 0.2, Math.PI - 0.2);
      gx.stroke();

      gx.restore();
    });

    // Layer 4: Biometric Crush HUD
    layer(g, cam, 1.1, (gx) => {
      gx.save();
      gx.fillStyle = 'rgba(244, 63, 94, 0.25)';
      gx.strokeStyle = '#fda4af';
      gx.lineWidth = 1.5;
      gx.beginPath();
      gx.roundRect(E.W * 0.72, E.H * 0.18, 170, 28, 6);
      gx.fill();
      gx.stroke();
      gx.font = '800 12px "JetBrains Mono", monospace';
      gx.fillStyle = '#fda4af';
      gx.fillText('IDENTITY: CRUSH', E.W * 0.72 + 14, E.H * 0.18 + 18);
      gx.restore();

      gx.font = '700 13px "JetBrains Mono", monospace';
      gx.fillStyle = '#fda4af';
      gx.fillText('PULSE RATE: 142 BPM', E.W * 0.72, E.H * 0.26);
      gx.fillText('COMPATIBILITY: 99.8%', E.W * 0.72, E.H * 0.29);
      gx.fillText('ALERT: BUTTERFLIES DETECTED', E.W * 0.72, E.H * 0.32);
    });
  }
});

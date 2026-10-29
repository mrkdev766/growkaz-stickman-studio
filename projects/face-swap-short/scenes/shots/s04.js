// s04.js — The President Face Swap (8.4s – 10.3s)
// Line: "Even the president?"
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';

preloadImages([BG.broadcastNewsroom]);

registerShot('s04', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 1.9;
    const p = clamp(t / dur, 0, 1);

    // Camera: slow formal dolly-back establishing gravitas
    const cam = {
      x: lerp(10, 0, ease.out(p)),
      y: lerp(5, 0, ease.out(p)),
      z: lerp(1.15, 1.08, ease.out(p))
    };

    // Layer 1: Press Briefing Room Background
    layer(g, cam, 0.3, (gx) => {
      imagePlate(gx, BG.broadcastNewsroom, 0, 0, E.W, E.H, {
        fit: 'cover',
        filter: 'brightness(0.4) contrast(1.15)'
      });
      // Formal navy blue wash
      const grad = gx.createLinearGradient(0, 0, 0, E.H);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.7)');
      grad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      gx.fillStyle = grad;
      gx.fillRect(0, 0, E.W, E.H);
    });

    // Layer 2: Paparazzi / Press Camera Flashes
    layer(g, cam, 0.5, (gx) => {
      // Rapid intermittent strobe flashes
      const flashTimes = [0.1, 0.45, 0.8, 1.25, 1.6];
      flashTimes.forEach((ft) => {
        if (t >= ft && t < ft + 0.08) {
          const flashFade = 1 - ((t - ft) / 0.08);
          gx.fillStyle = `rgba(255, 255, 255, ${flashFade * 0.45})`;
          gx.fillRect(0, 0, E.W, E.H);
        }
      });
    });

    // Layer 3: Character with Presidential Props
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.5;
      const figY = E.H * 0.85;

      // Presidential address pose (hand raised slightly or pointing)
      drawFigure(gx, {
        x: figX,
        y: figY,
        s: 1.45,
        facing: 1,
        pose: POSES.explain,
        outfit: { top: 'suit', color: '#0f172a' },
        rim: { dir: [-0.6, -0.6], w: 5, color: '#38bdf8' }
      });

      // Head position
      const hx = figX - 10;
      const hy = figY - 265;

      gx.save();

      // 1. Silver-Gray Swept Presidential Hair
      gx.fillStyle = '#cbd5e1';
      gx.strokeStyle = '#64748b';
      gx.lineWidth = 2.5;
      gx.beginPath();
      gx.moveTo(hx - 28, hy - 14);
      gx.bezierCurveTo(hx - 32, hy - 40, hx + 10, hy - 44, hx + 28, hy - 25);
      gx.bezierCurveTo(hx + 34, hy - 10, hx + 15, hy - 20, hx - 5, hy - 24);
      gx.bezierCurveTo(hx - 20, hy - 26, hx - 24, hy - 18, hx - 28, hy - 14);
      gx.fill();
      gx.stroke();

      // 2. Bold Red Power Tie
      gx.fillStyle = '#dc2626';
      gx.beginPath();
      // Tie knot
      gx.moveTo(hx - 7, hy + 42);
      gx.lineTo(hx + 7, hy + 42);
      gx.lineTo(hx + 4, hy + 50);
      gx.lineTo(hx - 4, hy + 50);
      gx.closePath();
      gx.fill();
      // Tie blade
      gx.beginPath();
      gx.moveTo(hx - 5, hy + 50);
      gx.lineTo(hx + 5, hy + 50);
      gx.lineTo(hx + 9, hy + 115);
      gx.lineTo(hx, hy + 130);
      gx.lineTo(hx - 9, hy + 115);
      gx.closePath();
      gx.fill();

      // 3. Secret Service Earpiece & Coiled Wire
      gx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      gx.lineWidth = 2;
      gx.beginPath();
      gx.arc(hx - 28, hy - 2, 4, 0, Math.PI * 2);
      gx.stroke();
      // Coiled wire down collar
      gx.beginPath();
      gx.moveTo(hx - 28, hy + 2);
      gx.bezierCurveTo(hx - 36, hy + 14, hx - 24, hy + 24, hx - 34, hy + 38);
      gx.stroke();

      gx.restore();
    });

    // Layer 4: Press Podium Microphones in Foreground
    layer(g, cam, 1.15, (gx) => {
      const podY = E.H * 0.94;
      // Podium top edge
      gx.fillStyle = '#1e293b';
      gx.fillRect(E.W * 0.32, podY, E.W * 0.36, 65);
      gx.strokeStyle = '#38bdf8';
      gx.lineWidth = 2.5;
      gx.strokeRect(E.W * 0.32, podY, E.W * 0.36, 65);

      // Microphones
      [-60, 0, 60].forEach((ox) => {
        const mx = E.W * 0.5 + ox;
        gx.strokeStyle = '#94a3b8';
        gx.lineWidth = 3;
        gx.beginPath();
        gx.moveTo(mx, podY);
        gx.lineTo(mx + (ox * -0.2), podY - 55);
        gx.stroke();

        // Mic capsule
        gx.fillStyle = '#0f172a';
        gx.beginPath();
        gx.roundRect(mx + (ox * -0.2) - 8, podY - 80, 16, 25, 6);
        gx.fill();
        gx.strokeStyle = '#e2e8f0';
        gx.lineWidth = 1.5;
        gx.stroke();
      });
    });

    // Layer 5: Presidential HUD Tag
    layer(g, cam, 1.2, (gx) => {
      gx.save();
      gx.fillStyle = 'rgba(59, 130, 246, 0.25)';
      gx.strokeStyle = '#60a5fa';
      gx.lineWidth = 1.5;
      gx.beginPath();
      gx.roundRect(E.W * 0.10, E.H * 0.14, 250, 28, 6);
      gx.fill();
      gx.stroke();
      gx.font = '800 12px "JetBrains Mono", monospace';
      gx.fillStyle = '#60a5fa';
      gx.fillText('IDENTITY: COMMANDER-IN-CHIEF', E.W * 0.10 + 14, E.H * 0.14 + 18);
      gx.restore();

      gx.font = '700 13px "JetBrains Mono", monospace';
      gx.fillStyle = '#93c5fd';
      gx.fillText('CLEARANCE: TOP SECRET // LEVEL 5', E.W * 0.10, E.H * 0.22);
      gx.fillText('PRESS POOL: 48 JOURNALISTS PRESENT', E.W * 0.10, E.H * 0.25);
    });
  }
});

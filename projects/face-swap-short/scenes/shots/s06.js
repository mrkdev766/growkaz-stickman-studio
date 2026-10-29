// s06.js — The Glitch Punchline & Provocative Outro (14.5s – 16.44s)
// Line: "Sounds amazing, right?"
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';

preloadImages([BG.serverDatacenter]);

registerShot('s06', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 1.94;
    const p = clamp(t / dur, 0, 1);

    // Glitch jitter camera shake
    const isGlitching = t < 0.6;
    const glitchJitterX = isGlitching ? (Math.random() - 0.5) * 16 : 0;
    const glitchJitterY = isGlitching ? (Math.random() - 0.5) * 12 : 0;

    const cam = {
      x: glitchJitterX,
      y: glitchJitterY,
      z: lerp(1.15, 1.05, ease.out(p))
    };

    // Layer 1: Dark Digital Void with Scanline Glitches
    layer(g, cam, 0.25, (gx) => {
      gx.fillStyle = '#05070e';
      gx.fillRect(0, 0, E.W, E.H);

      // CRT Scanlines
      gx.fillStyle = 'rgba(0, 229, 255, 0.04)';
      for (let y = 0; y < E.H; y += 4) {
        gx.fillRect(0, y, E.W, 1.5);
      }
    });

    // Layer 2: Chromatic Glitch Slash Bars (at start of shot)
    layer(g, cam, 0.5, (gx) => {
      if (isGlitching) {
        for (let i = 0; i < 4; i++) {
          const gy = Math.random() * E.H;
          const gh = 10 + Math.random() * 30;
          gx.fillStyle = Math.random() > 0.5 ? 'rgba(239, 68, 68, 0.35)' : 'rgba(0, 229, 255, 0.35)';
          gx.fillRect(0, gy, E.W, gh);
        }
      }
    });

    // Layer 3: Character — The Face Peeling / Glitching Off
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.5;
      const figY = E.H * 0.85;

      // Bewildered / confused pose
      drawFigure(gx, {
        x: figX,
        y: figY,
        s: 1.45,
        facing: 1,
        pose: POSES.shrug,
        outfit: { top: 'hoodie', color: '#00e5ff' },
        rim: { dir: [-0.6, -0.6], w: 5, color: '#ef4444' }
      });

      // Head position
      const hx = figX - 10;
      const hy = figY - 265;

      gx.save();

      // 1. Dizzy Cartoon Swirl Eyes (the real stickman blinking in shock)
      [-14, 14].forEach((ox) => {
        gx.fillStyle = '#ffffff';
        gx.beginPath();
        gx.arc(hx + ox, hy, 12, 0, Math.PI * 2);
        gx.fill();
        gx.strokeStyle = '#0f172a';
        gx.lineWidth = 2.5;
        gx.stroke();

        // Spiral pupil
        gx.strokeStyle = '#ef4444';
        gx.lineWidth = 2;
        gx.beginPath();
        for (let a = 0; a < Math.PI * 4; a += 0.2) {
          const r = a * 1.5;
          const sx = hx + ox + Math.cos(a + t * 6) * r;
          const sy = hy + Math.sin(a + t * 6) * r;
          if (a === 0) gx.moveTo(sx, sy);
          else gx.lineTo(sx, sy);
        }
        gx.stroke();
      });

      // 2. The Peeling Gold Face Mask (drifts away like a loose rubber sticker)
      const peelP = clamp(t / 1.2, 0, 1);
      const maskX = hx + lerp(0, 140, ease.out(peelP));
      const maskY = hy - lerp(0, 60, ease.out(peelP));
      const maskRot = lerp(0, 0.45, ease.out(peelP));

      gx.save();
      gx.translate(maskX, maskY);
      gx.rotate(maskRot);
      gx.globalAlpha = 1 - peelP * 0.8;

      // Mask outline
      gx.fillStyle = 'rgba(234, 179, 8, 0.85)';
      gx.strokeStyle = '#fef08a';
      gx.lineWidth = 3;
      gx.beginPath();
      gx.roundRect(-24, -26, 48, 52, 16);
      gx.fill();
      gx.stroke();

      // Mask sunglasses
      gx.fillStyle = '#09090b';
      gx.beginPath();
      gx.roundRect(-18, -12, 16, 10, 3);
      gx.roundRect(2, -12, 16, 10, 3);
      gx.fill();
      gx.restore();

      gx.restore();
    });

    // Layer 4: Grand Provocative Finale Title Card
    layer(g, cam, 1.2, (gx) => {
      const cardP = clamp(prog(t, 0.5, 1.4), 0, 1);
      if (cardP > 0) {
        gx.save();
        gx.globalAlpha = ease.out(cardP);
        gx.translate(0, lerp(40, 0, ease.out(cardP)));

        // Center card banner
        const cw = 720;
        const ch = 120;
        const cx = (E.W - cw) / 2;
        const cy = E.H * 0.16;

        gx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        gx.strokeStyle = '#00e5ff';
        gx.lineWidth = 3;
        gx.beginPath();
        gx.roundRect(cx, cy, cw, ch, 18);
        gx.fill();
        gx.stroke();

        // Main punchline text
        gx.font = '900 36px "Plus Jakarta Sans", sans-serif';
        gx.fillStyle = '#ffffff';
        gx.textAlign = 'center';
        gx.fillText('WOULD YOU DO IT?', E.W / 2, cy + 54);

        // Subtext / Call to Action
        gx.font = '700 15px "JetBrains Mono", monospace';
        gx.fillStyle = '#00e5ff';
        gx.fillText('WHOSE FACE ARE YOU STEALING FIRST? 🎭', E.W / 2, cy + 92);
        gx.restore();
      }
    });
  }
});

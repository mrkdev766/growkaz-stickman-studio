// s02.js — The Father Face Swap (5.0s – 6.8s)
// Line: "Your father..."
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';

preloadImages([BG.detectiveOffice]);

registerShot('s02', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 1.8;
    const p = clamp(t / dur, 0, 1);

    // Camera punch-in for sudden dramatic comedic reveal
    const cam = {
      x: lerp(0, 10, ease.out(p)),
      y: lerp(-10, 0, ease.out(p)),
      z: lerp(1.12, 1.18, ease.out(p))
    };

    // Layer 1: Warm amber office / home setting
    layer(g, cam, 0.3, (gx) => {
      imagePlate(gx, BG.detectiveOffice, 0, 0, E.W, E.H, {
        fit: 'cover',
        filter: 'brightness(0.4) sepia(0.3) contrast(1.1)'
      });
      // Warm room lighting overlay
      const grad = gx.createRadialGradient(E.W * 0.5, E.H * 0.45, 100, E.W * 0.5, E.H * 0.45, 800);
      grad.addColorStop(0, 'rgba(251, 146, 60, 0.15)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0.85)');
      gx.fillStyle = grad;
      gx.fillRect(0, 0, E.W, E.H);
    });

    // Layer 2: Comedic Snap Impact Flash (at start of shot t < 0.2s)
    layer(g, cam, 0.5, (gx) => {
      if (t < 0.25) {
        const flashA = 1 - (t / 0.25);
        gx.fillStyle = `rgba(251, 146, 60, ${flashA * 0.35})`;
        gx.fillRect(0, 0, E.W, E.H);
      }
    });

    // Layer 3: Character with Dad Face Swap Props
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.5;
      const figY = E.H * 0.84;

      // Stickman in casual dad stance holding coffee mug
      drawFigure(gx, {
        x: figX,
        y: figY,
        s: 1.45,
        facing: 1,
        pose: POSES.holdFront,
        outfit: { top: 'suit', color: '#1e293b' },
        rim: { dir: [-0.6, -0.6], w: 5, color: '#f97316' }
      });

      // Dad Face overlay props on head
      const hx = figX - 10;
      const hy = figY - 265;

      gx.save();
      // Snap bounce animation
      const snapBounce = p < 0.3 ? Math.sin((p / 0.3) * Math.PI) * 12 : 0;
      gx.translate(0, -snapBounce);

      // 1. Thick bushy grey/brown eyebrows
      gx.strokeStyle = '#475569';
      gx.lineWidth = 7;
      gx.lineCap = 'round';
      // Left brow
      gx.beginPath();
      gx.moveTo(hx - 22, hy - 14);
      gx.lineTo(hx - 4, hy - 18);
      gx.stroke();
      // Right brow
      gx.beginPath();
      gx.moveTo(hx + 4, hy - 18);
      gx.lineTo(hx + 22, hy - 14);
      gx.stroke();

      // 2. Round Dad Reading Glasses (gold wireframe)
      gx.strokeStyle = '#eab308';
      gx.lineWidth = 3.5;
      // Bridge
      gx.beginPath();
      gx.moveTo(hx - 6, hy);
      gx.lineTo(hx + 6, hy);
      gx.stroke();
      // Lenses
      gx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      gx.beginPath();
      gx.arc(hx - 14, hy + 2, 11, 0, Math.PI * 2);
      gx.fill();
      gx.stroke();
      gx.beginPath();
      gx.arc(hx + 14, hy + 2, 11, 0, Math.PI * 2);
      gx.fill();
      gx.stroke();

      // 3. Giant Bushy Mustache
      gx.fillStyle = '#334155';
      gx.beginPath();
      gx.moveTo(hx, hy + 16);
      gx.bezierCurveTo(hx - 12, hy + 12, hx - 30, hy + 22, hx - 28, hy + 30);
      gx.bezierCurveTo(hx - 18, hy + 32, hx - 6, hy + 24, hx, hy + 20);
      gx.bezierCurveTo(hx + 6, hy + 24, hx + 18, hy + 32, hx + 28, hy + 30);
      gx.bezierCurveTo(hx + 30, hy + 22, hx + 12, hy + 12, hx, hy + 16);
      gx.fill();

      // 4. Steaming Ceramic Coffee Mug ("#1 DAD")
      const mugX = figX + 75;
      const mugY = figY - 145;
      // Mug body
      gx.fillStyle = '#f8fafc';
      gx.beginPath();
      gx.roundRect(mugX, mugY, 44, 52, 6);
      gx.fill();
      gx.strokeStyle = '#0f172a';
      gx.lineWidth = 3;
      gx.stroke();
      // Mug handle
      gx.beginPath();
      gx.arc(mugX + 44, mugY + 26, 14, -Math.PI / 2, Math.PI / 2);
      gx.stroke();
      // Text "#1 DAD"
      gx.font = '800 10px "Plus Jakarta Sans", sans-serif';
      gx.fillStyle = '#f97316';
      gx.fillText('#1 DAD', mugX + 5, mugY + 30);

      // Steam wisps rising
      const steamProg = (t * 4) % 1;
      gx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      gx.lineWidth = 2.5;
      gx.beginPath();
      gx.moveTo(mugX + 16, mugY - 4 - steamProg * 20);
      gx.bezierCurveTo(mugX + 24, mugY - 14 - steamProg * 20, mugX + 10, mugY - 24 - steamProg * 20, mugX + 18, mugY - 34 - steamProg * 20);
      gx.stroke();

      gx.restore();
    });

    // Layer 4: Biometric HUD Data Tag
    layer(g, cam, 1.1, (gx) => {
      gx.save();
      gx.fillStyle = 'rgba(249, 115, 22, 0.2)';
      gx.strokeStyle = '#fb923c';
      gx.lineWidth = 1.5;
      gx.beginPath();
      gx.roundRect(E.W * 0.12, E.H * 0.16, 175, 28, 6);
      gx.fill();
      gx.stroke();
      gx.font = '800 12px "JetBrains Mono", monospace';
      gx.fillStyle = '#fb923c';
      gx.fillText('IDENTITY: FATHER', E.W * 0.12 + 14, E.H * 0.16 + 18);
      gx.restore();

      gx.font = '700 13px "JetBrains Mono", monospace';
      gx.fillStyle = '#fb923c';
      gx.fillText('GENETIC OVERLAP: 50.0%', E.W * 0.12, E.H * 0.24);
      gx.fillText('WISDOM: +100 // DAD JOKES: READY', E.W * 0.12, E.H * 0.27);
    });
  }
});

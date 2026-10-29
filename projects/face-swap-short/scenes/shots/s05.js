// s05.js — The Hollywood Movie Star & Laughing Flex (10.3s – 14.5s)
// Line: "Or imagine waking up with your favorite movie star's face? (laughs)"
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';

preloadImages([BG.cyberpunkCity]);

registerShot('s05', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 4.2;
    const p = clamp(t / dur, 0, 1);

    // Camera: glamorous slow orbit / float
    const cam = {
      x: lerp(-15, 15, ease.inOut(p)),
      y: lerp(5, -10, ease.inOut(p)),
      z: lerp(1.12, 1.20, ease.inOut(p))
    };

    // Layer 1: Luxury Dark Gold Stage Background
    layer(g, cam, 0.3, (gx) => {
      const grad = gx.createLinearGradient(0, 0, 0, E.H);
      grad.addColorStop(0, '#0c0a09');
      grad.addColorStop(0.5, '#1c1917');
      grad.addColorStop(1, '#0c0a09');
      gx.fillStyle = grad;
      gx.fillRect(0, 0, E.W, E.H);
    });

    // Layer 2: Dramatic Golden Spotlight Cones
    layer(g, cam, 0.5, (gx) => {
      // Main central spotlight
      FX.lightCone(gx, E.W * 0.5, 0, {
        angle: Math.PI / 2,
        spread: 0.65,
        len: E.H * 0.9,
        color: '#fef08a',
        a: 0.18
      });
      // Side gold rim lights
      FX.lightCone(gx, E.W * 0.2, 0, {
        angle: Math.PI / 2 + 0.35,
        spread: 0.45,
        len: E.H * 0.85,
        color: '#fbbf24',
        a: 0.12
      });
      FX.lightCone(gx, E.W * 0.8, 0, {
        angle: Math.PI / 2 - 0.35,
        spread: 0.45,
        len: E.H * 0.85,
        color: '#fbbf24',
        a: 0.12
      });
    });

    // Layer 3: Golden Sparkles & Award Confetti Floating Down
    layer(g, cam, 0.7, (gx) => {
      FX.dust(gx, t, { count: 40, color: '#fbbf24', a: 0.35, seed: 99 });
    });

    // Layer 4: Character — Chiseled Movie Star with Flexing Pose during Laugh
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.5;
      const figY = E.H * 0.85;

      // When the chuckle begins (t > 2.5s), switch to flexing cheer pose!
      const isLaughing = t > 2.4;
      const pose = isLaughing ? POSES.cheer : POSES.relaxed;
      const laughShake = isLaughing ? Math.sin(t * 18) * 3 : 0;

      drawFigure(gx, {
        x: figX,
        y: figY + laughShake,
        s: 1.45,
        facing: 1,
        pose: pose,
        outfit: { top: 'suit', color: '#18181b' },
        rim: { dir: [-0.6, -0.6], w: 6, color: '#fbbf24' }
      });

      // Head position
      const hx = figX - 10;
      const hy = figY - 265 + laughShake;

      gx.save();

      // 1. Ultra-Chiseled Jawline & Smug Smirk
      gx.fillStyle = '#0f172a';
      gx.strokeStyle = '#fbbf24';
      gx.lineWidth = 2.5;

      // 2. Aviator Sunglasses dropping down onto face (animates down in first 0.8s)
      const shadesDropP = clamp(t / 0.8, 0, 1);
      const shadesY = hy - 4 - lerp(200, 0, ease.out(shadesDropP));

      gx.save();
      gx.translate(0, shadesY - (hy - 4));
      // Sunglasses frames
      gx.fillStyle = '#09090b';
      gx.strokeStyle = '#eab308';
      gx.lineWidth = 2.5;
      // Left lens
      gx.beginPath();
      gx.roundRect(hx - 26, hy - 8, 22, 16, [4, 4, 10, 10]);
      gx.fill();
      gx.stroke();
      // Right lens
      gx.beginPath();
      gx.roundRect(hx + 4, hy - 8, 22, 16, [4, 4, 10, 10]);
      gx.fill();
      gx.stroke();
      // Bridge
      gx.beginPath();
      gx.moveTo(hx - 4, hy - 4);
      gx.lineTo(hx + 4, hy - 4);
      gx.stroke();
      // Glass sheen reflection lines
      gx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      gx.lineWidth = 2;
      gx.beginPath();
      gx.moveTo(hx - 20, hy + 4);
      gx.lineTo(hx - 12, hy - 6);
      gx.moveTo(hx + 10, hy + 4);
      gx.lineTo(hx + 18, hy - 6);
      gx.stroke();
      gx.restore();

      // 3. Tooth Sparkle Ding ✨ (pulsing glint at the corner of mouth)
      if (t > 1.2 && t < 3.2) {
        const dingProg = (t - 1.2) % 1.0;
        const dingScale = Math.sin(dingProg * Math.PI) * 14;
        const sx = hx + 14;
        const sy = hy + 18;

        gx.save();
        gx.fillStyle = '#ffffff';
        gx.beginPath();
        gx.moveTo(sx - dingScale, sy);
        gx.lineTo(sx, sy - 3);
        gx.lineTo(sx + dingScale, sy);
        gx.lineTo(sx, sy + 3);
        gx.closePath();
        gx.fill();

        gx.beginPath();
        gx.moveTo(sx, sy - dingScale);
        gx.lineTo(sx - 3, sy);
        gx.lineTo(sx, sy + dingScale);
        gx.lineTo(sx + 3, sy);
        gx.closePath();
        gx.fill();
        gx.restore();
      }

      // 4. Laugh / Chuckle animated text bubbles ("Haha!", "Heh!")
      if (isLaughing) {
        const bubbleA = Math.sin((t - 2.4) * 8) * 0.5 + 0.5;
        gx.save();
        gx.font = '800 16px "Plus Jakarta Sans", sans-serif';
        gx.fillStyle = `rgba(253, 224, 71, ${bubbleA * 0.9})`;
        gx.fillText('HAHA!', hx + 45, hy - 40 - ((t * 20) % 30));
        gx.restore();
      }

      gx.restore();
    });

    // Layer 5: Luxury Movie Star HUD
    layer(g, cam, 1.15, (gx) => {
      gx.save();
      gx.fillStyle = 'rgba(234, 179, 8, 0.25)';
      gx.strokeStyle = '#fde047';
      gx.lineWidth = 1.5;
      gx.beginPath();
      gx.roundRect(E.W * 0.10, E.H * 0.14, 240, 28, 6);
      gx.fill();
      gx.stroke();
      gx.font = '800 12px "JetBrains Mono", monospace';
      gx.fillStyle = '#fde047';
      gx.fillText('IDENTITY: HOLLYWOOD A-LIST', E.W * 0.10 + 14, E.H * 0.14 + 18);
      gx.restore();

      gx.font = '700 13px "JetBrains Mono", monospace';
      gx.fillStyle = '#fef08a';
      gx.fillText('BOX OFFICE: $1.42 BILLION', E.W * 0.10, E.H * 0.22);
      gx.fillText('PAPARAZZI STATUS: SURROUNDED', E.W * 0.10, E.H * 0.25);
      gx.fillText('CHARISMA SCORE: 999 / 100', E.W * 0.10, E.H * 0.28);
    });
  }
});

// sets/void.js — philosophical void space with floating mirrors and identity motifs
import { E, V, mood, layer, backdrop, rr, ring, circle, linGrad, alpha, glow } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const voidGround = () => E.H * V(0.82, 0.68);

export function voidSpace(g, t, cam, o = {}) {
  const M = mood(o.mood || 'emerald'), GY = voidGround(), CX = E.W / 2;

  layer(g, cam, 0.1, (g) => {
    backdrop(g, ['#05080e', '#0e161c']);
    FX.stars(g, { count: 45, seed: 42 });
  });

  layer(g, cam, 0.5, (g) => {
    // Floating glowing frames / silhouettes drifting in the dark
    for (let i = 0; i < 5; i++) {
      const fx = CX + (i - 2) * V(280, 200);
      const fy = E.H * 0.42 + Math.sin(t * 1.5 + i * 1.2) * 25;
      rr(g, fx - 45, fy - 65, 90, 130, 8);
      g.fillStyle = 'rgba(12, 22, 28, 0.6)'; g.fill();
      g.strokeStyle = alpha(i % 2 === 0 ? M.rim : '#e76f51', 0.35);
      g.lineWidth = 2; g.stroke();
      glow(g, fx, fy, 80, i % 2 === 0 ? M.rim : '#e76f51', 0.2);
    }
  });

  layer(g, cam, 0.85, (g) => {
    // Dark reflective glass floor
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, ['#0a1218', '#04070a']);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.pool(g, CX, GY + 30, V(450, 320), 40, M.rim, 0.2);
  });

  return { GY, CX, M };
}


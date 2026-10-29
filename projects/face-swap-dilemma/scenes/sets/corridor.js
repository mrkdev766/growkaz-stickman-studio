// sets/corridor.js — high-security corporate/government corridor
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, alpha, shade, glow } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const corridorGround = () => E.H * V(0.82, 0.68);

export function corridor(g, t, cam, o = {}) {
  const M = mood(o.mood || 'dusk'), GY = corridorGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.3), wallDark = shade(M.wall, -0.6);

  layer(g, cam, 0.4, (g) => { // Sleek modern corridor wall & heavy double doors
    const top = GY - V(580, 880), left = CX - 1500, w = 3000;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.1), wall, wallDark]);
    g.fillRect(left, top, w, GY - top + 4);

    // Frosted glass double doors in center
    const dw = V(340, 280), dh = V(420, 480);
    const doorOpen = o.open ?? 0;
    rr(g, CX - dw / 2 - 12, GY - dh - 12, dw + 24, dh + 16, 12);
    g.fillStyle = '#141820'; g.fill();

    // Left door leaf
    rr(g, CX - dw / 2 - doorOpen * 60, GY - dh, dw / 2 - 4, dh, 6);
    g.fillStyle = alpha('#457b9d', 0.35); g.fill();
    g.strokeStyle = '#2a3b4c'; g.lineWidth = 4; g.stroke();

    // Right door leaf
    rr(g, CX + 4 + doorOpen * 60, GY - dh, dw / 2 - 4, dh, 6);
    g.fillStyle = alpha('#457b9d', 0.35); g.fill();
    g.strokeStyle = '#2a3b4c'; g.lineWidth = 4; g.stroke();

    // Badge scanner on right door jamb
    const bx = CX + dw / 2 + 35, by = GY - dh * 0.45;
    rr(g, bx - 14, by - 24, 28, 48, 6); g.fillStyle = '#1e2430'; g.fill();
    circle(g, bx, by, 8, doorOpen > 0 ? '#2a9d8f' : '#e63946');
    glow(g, bx, by, 30, doorOpen > 0 ? '#2a9d8f' : '#e63946', 0.6);
  });

  layer(g, cam, 0.85, (g) => { // Polished marble floor with reflections
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.1), shade(M.dark, -0.3)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.2)', 0.08);

    // Overhead strip light reflections
    FX.pool(g, CX, GY + 30, V(360, 260), 40, '#a8dadc', 0.2);
  });

  return { GY, CX, M };
}


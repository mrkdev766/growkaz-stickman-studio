// sets/home.js — cozy family living room & front door entry
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, alpha, shade, glow } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const homeGround = () => E.H * V(0.82, 0.68);

export function home(g, t, cam, o = {}) {
  const M = mood(o.mood || 'interiorWarm'), GY = homeGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.2), wallDark = shade(M.wall, -0.5);

  layer(g, cam, 0.4, (g) => { // Living room wall with photos & front door
    const top = GY - V(580, 880), left = CX - 1500, w = 3000;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.15), wall, wallDark]);
    g.fillRect(left, top, w, GY - top + 4);

    // Front door on left
    FX.door(g, { x: CX - V(520, 320), y: GY, w: 140, h: V(320, 380), color: wallDark, open: o.doorOpen ?? 0.25, light: M.practical });

    // Family photo frames on the wall
    for (let i = 0; i < 3; i++) {
      const px = CX - 100 + i * 120, py = GY - V(360, 480);
      rr(g, px - 35, py - 45, 70, 90, 6);
      g.fillStyle = '#2c1e18'; g.fill();
      g.strokeStyle = alpha(M.rim, 0.4); g.lineWidth = 2; g.stroke();
      g.fillStyle = i === 1 ? '#e9c46a' : (i === 0 ? '#2a9d8f' : '#f28482');
      circle(g, px, py - 10, 16); // abstract face in portrait
      seg(g, [[px, py + 6], [px, py + 26]], 6);
    }

    // Floor lamp on right
    const lx = CX + V(480, 320), ly = GY - V(280, 340);
    seg(g, [[lx, GY], [lx, ly]], 8, '#241a18');
    poly(g, [[lx - 35, ly + 25], [lx + 35, ly + 25], [lx + 20, ly - 30], [lx - 20, ly - 30]], '#ffdf9e');
    circle(g, lx, ly, 12, '#ffffff');
    glow(g, lx, ly, 220, M.practical, 0.45);
  });

  layer(g, cam, 0.85, (g) => { // Living room floor & sofa
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.1), shade(M.dark, -0.3)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.25)', 0.08);

    // Warm rug
    rr(g, CX - V(320, 220), GY + 15, V(640, 440), 90, 20);
    g.fillStyle = shade(M.floor, 0.15); g.fill();

    // Pool of light from floor lamp
    FX.pool(g, CX + V(480, 320), GY + 25, 260, 45, M.practical, 0.35);
  });

  return { GY, CX, M };
}

// sets/bedroom.js — bedroom with vanity mirror and pre-dawn window view
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, radGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const bedroomGround = () => E.H * V(0.82, 0.68);

export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), GY = bedroomGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.4), wallDark = shade(M.wall, -0.7);

  layer(g, cam, 0.1, (g) => { // Pre-dawn sky & distant silhouette
    backdrop(g, M.sky);
    FX.stars(g, { count: 35, seed: 12 });
    FX.skyline(g, { x: -E.W, y: GY - V(460, 750), w: E.W * 3, minH: 70, maxH: V(240, 400), color: wallDark, windowColor: alpha(M.practical, 0.4), lit: 0.12, seed: 5 });
  });

  layer(g, cam, 0.45, (g) => { // Bedroom wall with window & door
    const top = GY - V(580, 880), left = CX - 1500, w = 3000;
    g.fillStyle = linGrad(g, 0, top, 0, GY, [shade(wall, 0.1), wall, wallDark]);
    g.fillRect(left, top, w, GY - top + 4);

    // Bedroom window
    const wx = CX - V(480, 260), wy = GY - V(460, 680), ww = V(260, 200), wh = V(340, 380);
    FX.windowFrame(g, { x: wx, y: wy, w: ww, h: wh, cols: 2, rows: 2, frame: wallDark, bar: 8 }, (g, x, y, w, h) => {
      g.fillStyle = linGrad(g, 0, y, 0, y + h, [M.sky[0], M.sky[1]]);
      g.fillRect(x, y, w, h);
    });

    // Bed in background left
    FX.bed(g, { x: CX - V(620, 360), y: GY, w: V(320, 260), color: shade(M.floor, -0.2), frame: wallDark });

    // Bedside lamp warm glow
    const lx = CX - V(680, 400), ly = GY - V(160, 200);
    glow(g, lx, ly, 180, M.practical, 0.4);
    circle(g, lx, ly, 8, '#fff3d6');
  });

  layer(g, cam, 0.85, (g) => { // Floor & rug
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.2), shade(M.dark, -0.4)]);
    g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 500, 'rgba(0,0,0,.3)', 0.08);

    // Soft warm light pool in front of mirror
    FX.pool(g, CX, GY + 25, V(280, 220), 40, M.practical, 0.3);
  });

  return { GY, CX, M };
}

// Vanity mirror frame anchored to the scene
export function vanityMirror(g, x, y, w, h, M) {
  // Mirror outer frame
  rr(g, x - w / 2 - 12, y - h - 12, w + 24, h + 24, 14);
  g.fillStyle = '#1c1622';
  g.fill();
  g.strokeStyle = alpha(M.rim, 0.4);
  g.lineWidth = 3;
  g.stroke();

  // Reflective mirror surface gradient
  const mGrad = linGrad(g, x - w / 2, y - h, x + w / 2, y, [
    shade(M.sky[0], -0.2),
    shade(M.sky[1], 0.1),
    alpha(M.practical, 0.2)
  ]);
  rr(g, x - w / 2, y - h, w, h, 8);
  g.fillStyle = mGrad;
  g.fill();

  // Glass diagonal sheen line
  g.save();
  g.beginPath();
  rr(g, x - w / 2, y - h, w, h, 8);
  g.clip();
  g.fillStyle = 'rgba(255,255,255,0.08)';
  g.beginPath();
  g.moveTo(x - w / 2, y - h + 40);
  g.lineTo(x + w / 2 - 40, y);
  g.lineTo(x + w / 2 - 10, y);
  g.lineTo(x - w / 2, y - h + 10);
  g.fill();
  g.restore();

  // Vanity light bulbs on sides
  for (let i = 0; i < 4; i++) {
    const by = y - h + 30 + i * ((h - 60) / 3);
    for (const bx of [x - w / 2 - 6, x + w / 2 + 6]) {
      circle(g, bx, by, 6, '#fff4db');
      glow(g, bx, by, 35, M.practical, 0.35);
    }
  }
}

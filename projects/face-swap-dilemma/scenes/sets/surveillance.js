// sets/surveillance.js — digital blueprint & security surveillance grid
import { E, V, mood, layer, backdrop, rr, ring, circle, seg, linGrad, alpha, glow } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function surveillance(g, t, cam, o = {}) {
  const M = mood('arctic'), CX = E.W / 2, CY = E.H / 2;

  layer(g, cam, 0.2, (g) => {
    backdrop(g, ['#050811', '#0b1424']);

    // Digital grid lines
    g.strokeStyle = 'rgba(42, 157, 143, 0.12)';
    g.lineWidth = 1;
    for (let x = 0; x < E.W; x += 60) {
      g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke();
    }
    for (let y = 0; y < E.H; y += 60) {
      g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke();
    }
  });

  layer(g, cam, 0.5, (g) => {
    // CCTV camera upper corner
    const ccx = CX + V(540, 360), ccy = CY - V(320, 260);
    seg(g, [[ccx, 0], [ccx, ccy]], 10, '#1c2838');
    rr(g, ccx - 40, ccy, 80, 45, 8); g.fillStyle = '#223246'; g.fill();
    circle(g, ccx + 20, ccy + 22, 14, '#101a26');
    circle(g, ccx + 20, ccy + 22, 5, '#e63946'); // blinking red recording light
    if (Math.sin(t * 4) > 0) glow(g, ccx + 20, ccy + 22, 25, '#e63946', 0.8);

    // Conical light scan beam from camera
    g.save();
    g.globalCompositeOperation = 'lighter';
    const scanGrad = linGrad(g, ccx, ccy, ccx - 300, ccy + 500, ['rgba(42, 157, 143, 0.25)', 'transparent']);
    g.fillStyle = scanGrad;
    g.beginPath();
    g.moveTo(ccx + 20, ccy + 22);
    g.lineTo(ccx - 450, ccy + 600);
    g.lineTo(ccx - 100, ccy + 650);
    g.closePath();
    g.fill();
    g.restore();
  });

  return { CX, CY, M };
}

// Facial biometric target mesh
export function faceScannerHUD(g, cx, cy, r, t, match = true) {
  const col = match ? '#2a9d8f' : '#e63946';
  ring(g, cx, cy, r, 2.5, col);
  ring(g, cx, cy, r * 1.15, 1.5, alpha(col, 0.4));

  // Corner brackets
  const b = r * 0.9;
  for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
    seg(g, [[cx + sx * b, cy + sy * (b - 25)], [cx + sx * b, cy + sy * b], [cx + sx * (b - 25), cy + sy * b]], 3, col);
  }

  // Scanning laser line moving vertically
  const scanY = cy - r + ((t * 1.5) % 1) * (r * 2);
  g.strokeStyle = col; g.lineWidth = 2;
  g.beginPath(); g.moveTo(cx - r * 0.8, scanY); g.lineTo(cx + r * 0.8, scanY); g.stroke();
  glow(g, cx, scanY, 30, col, 0.5);

  // Status text
  g.fillStyle = col;
  g.font = '600 20px monospace';
  g.textAlign = 'center';
  g.fillText(match ? 'MATCH: 98.4%' : 'MISMATCH / REJECTED', cx, cy + r + 38);
}


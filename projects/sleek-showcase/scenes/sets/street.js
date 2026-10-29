import { E, V, poly, seg, circle, rr, alpha, shade, S } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export function drawStreet(g, cam) {
  const st = S();
  // Deep night sky gradient
  const sky = g.createLinearGradient(0, 0, 0, E.H * 0.7);
  sky.addColorStop(0, '#0a0d16');
  sky.addColorStop(1, '#151d2e');
  g.fillStyle = sky;
  g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);

  // Distant skyline buildings
  const bldgCol = '#111522';
  for (let i = 0; i < 8; i++) {
    const bx = i * 180 - 100;
    const bh = 260 + (i % 3) * 80;
    g.fillStyle = bldgCol;
    g.fillRect(bx, E.H * 0.7 - bh, 140, bh);
    // Lit office windows
    g.fillStyle = alpha(st.ui.gold, 0.45);
    for (let r = 0; r < bh - 40; r += 32) {
      for (let c = 16; c < 120; c += 28) {
        if ((i + r + c) % 5 === 0) {
          g.fillRect(bx + c, E.H * 0.7 - bh + 20 + r, 14, 18);
        }
      }
    }
  }

  // Street ground plane
  const groundY = E.H * 0.68;
  const gr = g.createLinearGradient(0, groundY, 0, E.H);
  gr.addColorStop(0, '#12141c');
  gr.addColorStop(1, '#08090d');
  g.fillStyle = gr;
  g.fillRect(-E.W, groundY, E.W * 3, E.H - groundY);

  // Sidewalk curb
  seg(g, [[-E.W, groundY], [E.W * 2, groundY]], 4, '#303445');

  // Road lane markers
  g.strokeStyle = alpha('#ffffff', 0.25);
  g.lineWidth = 4;
  g.setLineDash([40, 30]);
  g.beginPath();
  g.moveTo(-E.W, groundY + 120);
  g.lineTo(E.W * 2, groundY + 120);
  g.stroke();
  g.setLineDash([]);

  // Streetlamp with warm conical beam
  const lampX = E.W * 0.72;
  seg(g, [[lampX, groundY], [lampX, groundY - 320]], 6, '#282b3a');
  seg(g, [[lampX, groundY - 320], [lampX - 40, groundY - 310]], 5, '#282b3a');
  circle(g, lampX - 40, groundY - 305, 8, '#ffeaa7');

  // Downward volumetric cone of light
  const cone = g.createRadialGradient(lampX - 40, groundY - 305, 10, lampX - 40, groundY, 340);
  cone.addColorStop(0, alpha('#ffeaa7', 0.25));
  cone.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = cone;
  poly(g, [[lampX - 40, groundY - 305], [lampX - 160, groundY + 80], [lampX + 80, groundY + 80]], cone);
}

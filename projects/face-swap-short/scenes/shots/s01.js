// s01.js — Smart Mirror & Biometric Face Mesh Scan (0.0s – 5.0s)
// Line: "Have you ever imagined, what if you could swap faces with anyone?"
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG, SFX } from '/assets/index.js';
import { ACTORS } from '../cast.js';

preloadImages([BG.serverDatacenter]);

registerShot('s01', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 5.0;
    const p = t / dur;

    // Camera: smooth cinematic push toward the smart mirror
    const cam = {
      x: lerp(-30, 20, ease.inOut(p)),
      y: lerp(10, -5, ease.inOut(p)),
      z: lerp(1.0, 1.05, ease.inOut(p))
    };

    // Layer 1: Ambient High-Tech Room Background
    layer(g, cam, 0.25, (gx) => {
      imagePlate(gx, BG.serverDatacenter, 0, 0, E.W, E.H, {
        fit: 'cover',
        filter: 'brightness(0.35) contrast(1.2) blur(2px)'
      });
      // Dark moody gradient veil
      const grad = gx.createLinearGradient(0, 0, 0, E.H);
      grad.addColorStop(0, 'rgba(7, 10, 19, 0.7)');
      grad.addColorStop(1, 'rgba(7, 10, 19, 0.95)');
      gx.fillStyle = grad;
      gx.fillRect(0, 0, E.W, E.H);
    });

    // Layer 2: Atmospheric cyan floating particles
    layer(g, cam, 0.5, (gx) => {
      FX.dust(gx, t, { count: 35, color: '#00e5ff', a: 0.25, seed: 12 });
    });

    // Layer 3: The Smart Vanity Mirror Frame & Reflection Plane
    layer(g, cam, 0.8, (gx) => {
      const mx = E.W * 0.52;
      const my = E.H * 0.16;
      const mw = E.W * 0.38;
      const mh = E.H * 0.68;

      // Outer glow and mirror border
      gx.save();
      gx.shadowColor = 'rgba(0, 229, 255, 0.35)';
      gx.shadowBlur = 30;
      gx.strokeStyle = '#00e5ff';
      gx.lineWidth = 4;
      gx.strokeRect(mx, my, mw, mh);

      // Mirror surface with glass gradient
      const glassGrad = gx.createLinearGradient(mx, my, mx + mw, my + mh);
      glassGrad.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      glassGrad.addColorStop(1, 'rgba(2, 6, 23, 0.95)');
      gx.fillStyle = glassGrad;
      gx.fillRect(mx, my, mw, mh);

      // Diagonal glass reflection streak
      gx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      gx.lineWidth = 12;
      gx.beginPath();
      gx.moveTo(mx + 40, my);
      gx.lineTo(mx + 180, my + mh);
      gx.moveTo(mx + 90, my);
      gx.lineTo(mx + 230, my + mh);
      gx.stroke();
      gx.restore();

      // UI HUD elements inside the mirror
      // Corner brackets
      gx.save();
      gx.strokeStyle = '#00e5ff';
      gx.lineWidth = 2.5;
      const blen = 30;
      const bx1 = mx + 20, by1 = my + 20, bx2 = mx + mw - 20, by2 = my + mh - 20;
      // top-left
      gx.beginPath(); gx.moveTo(bx1, by1 + blen); gx.lineTo(bx1, by1); gx.lineTo(bx1 + blen, by1); gx.stroke();
      // top-right
      gx.beginPath(); gx.moveTo(bx2 - blen, by1); gx.lineTo(bx2, by1); gx.lineTo(bx2, by1 + blen); gx.stroke();
      // bottom-left
      gx.beginPath(); gx.moveTo(bx1, by2 - blen); gx.lineTo(bx1, by2); gx.lineTo(bx1 + blen, by2); gx.stroke();
      // bottom-right
      gx.beginPath(); gx.moveTo(bx2 - blen, by2); gx.lineTo(bx2, by2); gx.lineTo(bx2, by2 - blen); gx.stroke();

      // Status badge
      gx.font = '800 12px "JetBrains Mono", monospace';
      gx.fillStyle = 'rgba(0, 229, 255, 0.15)';
      gx.strokeStyle = '#00e5ff';
      gx.lineWidth = 1.5;
      gx.beginPath();
      gx.roundRect(mx + 40, my + 35, 190, 26, 6);
      gx.fill();
      gx.stroke();
      gx.fillStyle = '#00e5ff';
      gx.fillText('BIOMETRIC ID: ACTIVE', mx + 50, my + 52);
      gx.restore();

      // Live scanning line moving down the mirror
      const scanY = my + 40 + ((t * 120) % (mh - 80));
      gx.save();
      gx.strokeStyle = 'rgba(0, 229, 255, 0.7)';
      gx.lineWidth = 2;
      gx.setLineDash([8, 6]);
      gx.beginPath();
      gx.moveTo(mx + 25, scanY);
      gx.lineTo(mx + mw - 25, scanY);
      gx.stroke();
      gx.restore();

      // Mirror reflection of the protagonist with biometric face mesh
      const reflX = mx + mw * 0.48;
      const reflY = my + mh * 0.88;
      drawFigure(gx, {
        x: reflX,
        y: reflY,
        s: 1.15,
        facing: -1,
        pose: POSES.relaxed,
        outfit: { top: 'hoodie', color: '#00e5ff' },
        alpha: 0.85,
        shadow: false
      });

      // Biometric wireframe face mesh on the reflection head
      const headX = reflX;
      const headY = reflY - 215;
      const meshP = (Math.sin(t * 3) + 1) * 0.5;

      gx.save();
      gx.strokeStyle = 'rgba(0, 229, 255, 0.85)';
      gx.lineWidth = 1.8;
      // Head bounding circle with target brackets
      gx.beginPath();
      gx.arc(headX, headY, 38, 0, Math.PI * 2);
      gx.stroke();

      // Polygonal facial mesh points
      const pts = [
        [headX - 18, headY - 12], [headX + 18, headY - 12],
        [headX, headY - 5],
        [headX - 12, headY + 12], [headX + 12, headY + 12],
        [headX, headY + 24]
      ];
      gx.fillStyle = '#00e5ff';
      pts.forEach(([px, py]) => {
        gx.beginPath();
        gx.arc(px, py, 3, 0, Math.PI * 2);
        gx.fill();
      });

      // Connect mesh lines
      gx.beginPath();
      gx.moveTo(pts[0][0], pts[0][1]);
      gx.lineTo(pts[1][0], pts[1][1]);
      gx.lineTo(pts[2][0], pts[2][1]);
      gx.lineTo(pts[0][0], pts[0][1]);
      gx.lineTo(pts[3][0], pts[3][1]);
      gx.lineTo(pts[5][0], pts[5][1]);
      gx.lineTo(pts[4][0], pts[4][1]);
      gx.lineTo(pts[1][0], pts[1][1]);
      gx.stroke();

      // Facial coordinates text tag
      gx.font = '700 12px "JetBrains Mono", monospace';
      gx.fillStyle = '#00e5ff';
      gx.fillText(`MESH_CONFIDENCE: 98.${Math.floor(meshP * 9)}%`, mx + 40, my + mh - 35);
      gx.fillText(`TARGET: UNLOCKED`, mx + 40, my + mh - 18);
      gx.restore();
    });

    // Layer 4: Real-world Foreground Protagonist (Back turned, looking into mirror)
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.32;
      const figY = E.H * 0.88;
      const headBob = Math.sin(t * 2) * 2;

      // Draw protagonist from rear/side angle
      drawFigure(gx, {
        x: figX,
        y: figY + headBob,
        s: 1.35,
        facing: 1,
        pose: POSES.think,
        outfit: { top: 'hoodie', color: '#00e5ff' },
        rim: { dir: [-0.6, -0.6], w: 5, color: '#00e5ff' }
      });
    });

    // Layer 5: High-Impact Question Title Banner (Appears at 2.2s: "WHAT IF YOU COULD SWAP?")
    layer(g, cam, 1.1, (gx) => {
      const textP = clamp(prog(t, 2.0, 3.2), 0, 1);
      if (textP > 0) {
        gx.save();
        gx.globalAlpha = ease.out(textP);
        gx.translate(0, lerp(30, 0, ease.out(textP)));

        // Glow tag banner
        gx.fillStyle = 'rgba(0, 229, 255, 0.12)';
        gx.strokeStyle = '#00e5ff';
        gx.lineWidth = 1.5;
        const bx = E.W * 0.08, by = E.H * 0.14, bw = 480, bh = 54;
        gx.beginPath();
        gx.roundRect(bx, by, bw, bh, 12);
        gx.fill();
        gx.stroke();

        gx.font = '800 20px "Plus Jakarta Sans", sans-serif';
        gx.fillStyle = '#ffffff';
        gx.fillText('THE IDENTITY PARADOX', bx + 22, by + 34);

        gx.font = '700 13px "JetBrains Mono", monospace';
        gx.fillStyle = '#00e5ff';
        gx.fillText('PROTOCOL // 01', bx + bw - 140, by + 34);
        gx.restore();
      }
    });
  }
});

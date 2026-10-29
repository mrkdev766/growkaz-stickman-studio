// s02.js — Cyberpunk City Street
// Features: imagePlate parallax BG, technologist walking with cowl, CRT scanlines, speedLines
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, glow, veil, preloadImages } from '/engine/core.js';
import { drawFigure, walkPose, POSES, EXPR } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';
import { crtScanlines, vignette } from '/assets/overlays/overlays.js';
import { ACTORS } from '../cast.js';

// Preload the cyberpunk city background plate
preloadImages([BG.cyberpunkCity]);

registerShot('s02', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 5.0;
    const p = t / dur;

    // Camera: lateral tracking shot following the walker
    const cam = {
      x: lerp(-80, 100, ease.inOut(p)),
      y: lerp(0, -15, p),
      z: lerp(1.0, 1.05, p)
    };

    // Far BG layer: cyberpunk city (slow parallax)
    layer(g, cam, 0.2, (gx) => {
      imagePlate(gx, BG.cyberpunkCity, -120, 0, E.W + 240, E.H, {
        fit: 'cover',
        filter: 'brightness(0.5) contrast(1.2) saturate(1.3)'
      });
    });

    // Neon glow spots in the background
    layer(g, cam, 0.35, (gx) => {
      glow(gx, E.W * 0.15, E.H * 0.35, 200, '#ff00ff', 0.12);
      glow(gx, E.W * 0.75, E.H * 0.25, 180, '#00ffff', 0.10);
      glow(gx, E.W * 0.55, E.H * 0.6, 150, '#ff3366', 0.08);
    });

    // Rain effect
    layer(g, cam, 0.7, (gx) => {
      FX.rain(gx, t, { count: 200, color: '#88ccff', speed: 1200, seed: 12 });
    });

    // Character layer: Technologist (hooded figure) walking
    layer(g, cam, 1.0, (gx) => {
      const charX = lerp(E.W * 0.25, E.W * 0.65, ease.inOut(p));
      const charY = E.H * 0.72;
      const pose = walkPose(t * 3.2);

      // Subtle glance: looking forward, then left toward camera
      const lookX = p < 0.7 ? 0.3 : lerp(0.3, -0.5, ease.out(prog(p, 0.7, 0.85)));

      drawFigure(gx, {
        x: charX,
        y: charY,
        s: V(1.45, 1.5),
        facing: 1,
        pose,
        outfit: ACTORS.technologist,
        expr: 'neutral',
        look: [lookX, 0],
        rim: { color: '#00ffff', dir: [-0.8, -0.3], w: 4 }
      });
    });

    // Foreground rain puddle reflections (faint glows at ground level)
    layer(g, cam, 1.3, (gx) => {
      for (let i = 0; i < 5; i++) {
        const px = E.W * (0.1 + i * 0.2);
        glow(gx, px, E.H * 0.88, 60 + i * 15, i % 2 ? '#ff00ff' : '#00ffff', 0.06);
      }
    });

    // Readout: data scrolling on-screen
    UI.readout(g, {
      lines: ['SYS://ENCRYPTED', 'NODE_42: ACTIVE', '> TRACE ROUTE...'],
      x: E.W * 0.04,
      y: E.H * 0.08,
      size: V(22, 28)
    });

    // Title — bottom
    UI.titleCard(g, t, {
      line1: 'THE CYBER',
      line2: 'UNDERGROUND',
      dur: 3.5,
      y: E.H * 0.88
    });

    // Post-processing: CRT scanlines + vignette
    crtScanlines(g, 0.12);
    vignette(g, 0.45);
  }
});


// s01.js — Noir Detective Office
// Features: imagePlate BG, investigator cast preset, vignette, letterbox, lightCone, callout
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, circle, glow, veil, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, face, EXPR } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';
import { letterbox, vignette } from '/assets/overlays/overlays.js';
import { ACTORS } from '../cast.js';

// Preload the detective office background plate
preloadImages([BG.detectiveOffice]);

registerShot('s01', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 5.0;
    const p = t / dur;

    // Camera: slow push-in with subtle vertical drift
    const cam = {
      x: lerp(-20, 30, ease.inOut(p)),
      y: lerp(5, -10, ease.inOut(p)),
      z: lerp(1.0, 1.06, ease.inOut(p))
    };

    // BG layer: AI-generated detective office plate
    layer(g, cam, 0.3, (gx) => {
      imagePlate(gx, BG.detectiveOffice, 0, 0, E.W, E.H, {
        fit: 'cover',
        filter: 'brightness(0.55) contrast(1.15) saturate(0.6)'
      });
    });

    // Atmospheric dust particles (dim amber)
    layer(g, cam, 0.6, (gx) => {
      FX.dust(gx, t, { count: 50, color: '#ffd59a', a: 0.3, seed: 7 });
    });

    // Desk lamp light cone from top-right
    layer(g, cam, 0.5, (gx) => {
      FX.lightCone(gx, E.W * 0.72, E.H * 0.08, {
        angle: Math.PI / 2 + 0.35,
        spread: 0.55,
        len: 620,
        color: '#ffe2a8',
        a: 0.14
      });
    });

    // Pool of warm light on desk area
    layer(g, cam, 0.5, (gx) => {
      FX.pool(gx, E.W * 0.55, E.H * 0.72, 340, 90, '#ffd59a', 0.18);
    });

    // Character layer: Investigator standing, studying documents
    layer(g, cam, 1.0, (gx) => {
      const figX = lerp(E.W * 0.38, E.W * 0.42, ease.inOut(p));
      const figY = E.H * 0.72;

      // Look down at desk then slowly look up
      const lookX = lerp(0.2, -0.1, ease.inOut(clamp((p - 0.4) / 0.3)));
      const lookY = lerp(0.3, -0.1, ease.inOut(clamp((p - 0.5) / 0.3)));

      drawFigure(gx, {
        x: figX,
        y: figY,
        s: V(1.5, 1.55),
        facing: 1,
        pose: POSES.present,
        outfit: ACTORS.investigator,
        expr: p < 0.5 ? 'cartoonFocused' : 'cartoon',
        look: [lookX, lookY],
        rim: { color: '#ffd166', dir: [0.6, -0.5], w: 3.5 }
      });
    });

    // Callout annotation — appears mid-shot
    UI.callout(g, t, {
      at: [E.W * 0.32, E.H * 0.35],
      to: [E.W * 0.12, E.H * 0.18],
      str: 'CASE #4471',
      start: 1.0
    });

    // Second callout — "CLASSIFIED"
    UI.callout(g, t, {
      at: [E.W * 0.62, E.H * 0.52],
      to: [E.W * 0.82, E.H * 0.28],
      str: 'CLASSIFIED',
      start: 2.0
    });

    // Title card — fade in at the beginning
    UI.titleCard(g, t, {
      line1: 'CASE FILE',
      line2: 'THE DARK WEB',
      dur: 3.5,
      y: E.H * 0.88
    });

    // Post-processing overlays
    vignette(g, 0.55);
    letterbox(g, 2.39);
  }
});


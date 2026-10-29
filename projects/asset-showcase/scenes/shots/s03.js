// s03.js — Breaking Newsroom Broadcast
// Features: imagePlate BG, host cast, breakingNewsDesk, worldDataMap, liveCounter, badge
import { E, V, ease, prog, lerp, clamp, layer, registerShot, imagePlate, S, alpha, glow, veil, preloadImages } from '/engine/core.js';
import { drawFigure, POSES, EXPR } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { BG } from '/assets/index.js';
import { vignette } from '/assets/overlays/overlays.js';
import { ACTORS } from '../cast.js';

// Preload the broadcast newsroom background plate
preloadImages([BG.broadcastNewsroom]);

registerShot('s03', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 5.0;
    const p = t / dur;

    // Camera: very slow zoom-in on anchor desk
    const cam = {
      x: lerp(-10, 10, ease.inOut(p)),
      y: 0,
      z: lerp(1.0, 1.04, ease.inOut(p))
    };

    // BG layer: AI-generated newsroom studio
    layer(g, cam, 0.3, (gx) => {
      imagePlate(gx, BG.broadcastNewsroom, 0, 0, E.W, E.H, {
        fit: 'cover',
        filter: 'brightness(0.6) contrast(1.1) saturate(0.85)'
      });
    });

    // World data map hologram in the upper-right area (behind anchor)
    layer(g, cam, 0.5, (gx) => {
      UI.worldDataMap(gx, t, {
        cx: E.W * 0.72,
        cy: E.H * 0.32,
        w: E.W * 0.45,
        h: E.H * 0.42,
        color: '#00f0ff',
        hotspots: [
          { x: 0.28, y: 0.42 },
          { x: 0.52, y: 0.25 },
          { x: 0.75, y: 0.55 },
          { x: 0.15, y: 0.60 }
        ]
      });
    });

    // Character layer: news host / anchor at desk
    layer(g, cam, 1.0, (gx) => {
      const figX = E.W * 0.30;
      const figY = E.H * 0.72;

      // Host gestures: stand → present
      const gestureP = ease.inOut(clamp((p - 0.2) / 0.3));

      drawFigure(gx, {
        x: figX,
        y: figY,
        s: V(1.5, 1.55),
        facing: 1,
        pose: POSES.present,
        outfit: ACTORS.host,
        expr: 'cartoon',
        look: [0.2, -0.1],
        rim: { color: '#ff4444', dir: [-0.5, -0.4], w: 3 }
      });
    });

    // Live counter — bottom right
    UI.liveCounter(g, t, {
      x: E.W * 0.82,
      y: E.H * 0.58,
      value: 2847391,
      speed: 4200,
      label: 'RECORDS EXPOSED',
      color: '#ff3333'
    });

    // Breaking news desk overlay — bottom bar
    UI.breakingNewsDesk(g, t, {
      headline: 'BREAKING: MASSIVE DATA BREACH AFFECTS 2.8M USERS',
      ticker: '  •  AUTHORITIES INVESTIGATING  •  SERVERS SEIZED IN 12 COUNTRIES  •  CEO DENIES KNOWLEDGE  •  STOCKS PLUNGE 18%  •  ',
      y: E.H * 0.84
    });

    // "LIVE" badge top-left
    UI.badge(g, {
      str: '● LIVE',
      x: V(130, 100),
      y: V(60, 80),
      color: '#ff3333',
      size: V(32, 38)
    });

    // Post-processing
    vignette(g, 0.3);
  }
});


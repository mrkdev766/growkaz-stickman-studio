import { E, V, ease, lerp, layer, registerShot } from '/engine/core.js';
import { drawFigure, POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { ACTORS } from '../cast.js';

registerShot('s02', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 3.5;
    const p = t / dur;

    // Slow cinematic push-in
    const cam = {
      x: 0,
      y: lerp(10, -10, p),
      z: lerp(1.0, 1.05, ease.inOut(p))
    };

    // Background Studio Grid & Hologram Map
    layer(g, cam, 0.4, (gx) => {
      // Deep studio background
      gx.fillStyle = '#090b12';
      gx.fillRect(-E.W, -E.H, E.W * 3, E.H * 3);

      // Hologram World Data Map
      UI.worldDataMap(gx, t, {
        x: E.W * 0.12,
        y: E.H * 0.12,
        w: E.W * 0.76,
        h: E.H * 0.46,
        color: '#00e5ff'
      });

      // Rapidly ticking live population / data counter
      UI.liveCounter(gx, t, {
        val: 8045210920,
        rate: -85000,
        label: 'GLOBAL POPULATION ACTIVE',
        x: E.W / 2,
        y: E.H * 0.22,
        size: V(46, 52),
        color: '#ffd13b'
      });
    });

    // Anchor Character Plane
    layer(g, cam, 0.85, (gx) => {
      drawFigure(gx, {
        x: E.W * 0.76,
        y: E.H * 0.65,
        s: V(1.4, 1.45),
        facing: -1,
        pose: POSES.present,
        outfit: ACTORS.anchor,
        expr: 'cartoonShocked',
        look: [-0.6, 0.2],
        talk: Math.sin(t * 8) > 0 ? 0.7 : 0,
        rim: { color: '#00e5ff', dir: [-0.6, -0.5], w: 3 }
      });
    });

    // Foreground News Desk & Lower-Third Breaking News
    UI.breakingNewsDesk(g, t, {
      headline: 'GLOBAL PROTOCOL: TIMELINE DIVERGENCE DETECTED',
      ticker: 'EMERGENCY BROADCAST SYSTEM ACTIVE • POPULATION MONITORS FLUCTUATING • VERIFY SENSOR DATA • MAINTAIN RADIO SILENCE',
      deskY: E.H - V(150, 180),
      deskW: E.W * 0.88
    });
  }
});


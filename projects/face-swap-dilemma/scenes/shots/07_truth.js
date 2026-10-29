// shots/07_truth.js — Act 6: the real twist, connection, mirror outro (s060 - s074)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { bedroom, bedroomGround, vanityMirror } from '../sets/bedroom.js';
import { voidSpace, voidGround } from '../sets/void.js';
import { HERO, MOM, FRIEND, PARTNER, ACTOR, LEADER } from '../cast.js';

// s060: "The most valuable thing about your face was never your appearance."
registerShot('s060', { draw(g, t, info) {
  const { CX, GY, M } = voidSpace(g, t, { z: 1, x: 0, y: 0 });
  drawFigure(g, {
    x: CX, y: GY, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'thoughtful', rim: { color: M.rim, dir: [0, -1] }
  });
} });

// s061: "It was the connection people built around it."
registerShot('s061', { draw(g, t, info) {
  backdrop(g, ['#060c14', '#0d1824']);
  const cx = E.W / 2, cy = E.H * 0.5;
  // Hero center, warm connecting glowing lines to nodes around
  circle(g, cx, cy, 32, '#2a9d8f'); glow(g, cx, cy, 80, '#2a9d8f', 0.5);
  const nodes = [[cx - 240, cy - 80, '#e9c46a'], [cx + 240, cy - 80, '#457b9d'], [cx, cy + 160, '#f28482']];
  for (const [nx, ny, col] of nodes) {
    g.strokeStyle = alpha(col, 0.45); g.lineWidth = 2.5;
    g.beginPath(); g.moveTo(cx, cy); g.lineTo(nx, ny); g.stroke();
    circle(g, nx, ny, 24, col); glow(g, nx, ny, 60, col, 0.4);
  }
} });

// s062: "Your face was how your family recognized you, how friends remembered you,"
registerShot('s062', { draw(g, t, info) {
  backdrop(g, ['#08121a', '#10222e']);
  const s = V(1.4, 1.5);
  // Family and friend together smiling
  drawFigure(g, { x: E.W * 0.3, y: E.H * 0.82, s, facing: 1, outfit: MOM, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: { color: '#e9c46a', dir: [0, -1] } });
  drawFigure(g, { x: E.W * 0.5, y: E.H * 0.82, s, facing: 1, outfit: HERO, pose: breathe(POSES.stand, t), expr: 'smile', rim: { color: '#2a9d8f', dir: [0, -1] } });
  drawFigure(g, { x: E.W * 0.7, y: E.H * 0.82, s, facing: -1, outfit: FRIEND, pose: breathe(POSES.wave, t), expr: 'smile', rim: { color: '#457b9d', dir: [-1, -1] } });
} });

// s063: "and how strangers began to trust or distrust you."
registerShot('s063', { draw(g, t, info) {
  backdrop(g, ['#070d14', '#0e1822']);
  const s = V(1.5, 1.6);
  drawFigure(g, { x: E.W * 0.4, y: E.H * 0.8, s, facing: 1, outfit: HERO, pose: breathe(POSES.explain, t), expr: 'neutral', rim: { color: '#2a9d8f', dir: [0, -1] } });
  drawFigure(g, { x: E.W * 0.6, y: E.H * 0.8, s, facing: -1, outfit: { top: 'tshirt', color: '#64748b' }, pose: breathe(POSES.think, t), expr: 'thoughtful', rim: { color: '#64748b', dir: [-1, -1] } });
} });

// s064: "Change that face, and you might change how the world treats you,"
registerShot('s064', { draw(g, t, info) {
  backdrop(g, ['#09121a', '#12202c']);
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: HERO, expr: 'neutral', rimColor: '#2a9d8f', rimSide: 1
  });
} });

// s065: "but you don't automatically change your memories,"
registerShot('s065', { draw(g, t, info) {
  backdrop(g, ['#060a10', '#0b1420']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'thoughtful', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  // Glowing brain / memory ring
  circle(g, E.W / 2, E.H * 0.45, 45, 'rgba(42, 157, 143, 0.25)');
  glow(g, E.W / 2, E.H * 0.45, 90, '#2a9d8f', 0.5);
} });

// s066: "your choices, or the person you've become."
registerShot('s066', { draw(g, t, info) {
  backdrop(g, ['#05080e', '#091018']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: HERO,
    pose: breathe(POSES.ready, t), expr: 'determined', rim: { color: '#ffd166', dir: [0, -1], w: 5 }
  });
  glow(g, E.W / 2, E.H * 0.48, 180, '#ffd166', 0.3);
} });

// s067: "And if nobody can recognize you anymore, you'll discover something terrifying:"
registerShot('s067', { draw(g, t, info) {
  backdrop(g, ['#04060c', '#080c16']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.facepalm, t), expr: 'troubled', rim: { color: '#e63946', dir: [0, -1] }
  });
} });

// s068: "being known and being seen are not the same thing."
registerShot('s068', { draw(g, t, info) {
  backdrop(g, ['#05080e', '#0a101a']);
  // Two distinct silhouettes side by side: "SEEN" (bright empty mask) vs "KNOWN" (warm deep figure)
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W * 0.35, y: E.H * 0.8, s, facing: 1, outfit: { top: 'none' },
    pose: breathe(POSES.stand, t), alpha: 0.4, rim: { color: '#64748b', dir: [0, -1] }
  });
  drawFigure(g, {
    x: E.W * 0.65, y: E.H * 0.8, s, facing: -1, outfit: HERO,
    pose: breathe(POSES.stand, t), expr: 'neutral', rim: { color: '#2a9d8f', dir: [-1, -1], w: 5 }
  });
} });

// s069: "So if you could swap faces with anyone on earth for just 24 hours,"
registerShot('s069', { draw(g, t, info) {
  backdrop(g, ['#060c14', '#0d1824']);
  // 24H badge HUD
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'thoughtful', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  rr(g, E.W / 2 - 80, E.H * 0.28, 160, 50, 12);
  g.fillStyle = '#102230'; g.fill();
  g.fillStyle = '#ffd166'; g.font = '800 28px monospace'; g.textAlign = 'center';
  g.fillText('24 HOURS', E.W / 2, E.H * 0.315);
} });

// s070: "who would you choose?"
registerShot('s070', { draw(g, t, info) {
  backdrop(g, ['#070d14', '#0f1b26']);
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: HERO, expr: 'neutral', look: [0, 0], rimColor: '#2a9d8f', rimSide: 1
  });
} });

// s071: "And more importantly, would you use that power to experience another life,"
registerShot('s071', { draw(g, t, info) {
  backdrop(g, ['#08121a', '#10202e']);
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W * 0.4, y: E.H * 0.8, s, facing: 1, outfit: ACTOR,
    pose: breathe(POSES.cheer, t), expr: 'smile', rim: { color: '#ffd166', dir: [0, -1] }
  });
  drawFigure(g, {
    x: E.W * 0.6, y: E.H * 0.8, s, facing: -1, outfit: LEADER,
    pose: breathe(POSES.ready, t), expr: 'smile', rim: { color: '#e76f51', dir: [-1, -1] }
  });
} });

// s072: "or to escape your own?"
registerShot('s072', { draw(g, t, info) {
  backdrop(g, ['#05080e', '#091018']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: HERO,
    pose: breathe(POSES.sad, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s073: "Tell me in the comments, because the next time you look in a mirror, remember this:"
registerShot('s073', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.05 + 0.05 * p, x: -10, y: 0 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'emerald' });
  const s = V(1.5, 1.6);

  layer(g, cam, 0.7, (g) => {
    vanityMirror(g, CX, GY - 30, V(320, 260), V(400, 360), M);
    drawFigure(g, {
      x: CX, y: GY - 20, s: s * 0.95, facing: -1, outfit: HERO,
      pose: breathe(POSES.stand, t), expr: 'thoughtful', rim: { color: '#2a9d8f', dir: [0, -1], w: 5 }
    });
  });

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX - 60, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.stand, t), expr: 'thoughtful', rim: { color: M.rim, dir: [0, -1] }
    });
  });
} });

// s074: "your face might be what the world sees first, but it isn't everything you are."
registerShot('s074', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  blurLayer(g, 10, (g) => bedroom(g, t, { z: 1.3, x: 0, y: -20 }, { mood: 'emerald' }));
  veil(g, '#060c12', 0.4);

  // Big face of genuine HERO smiling peacefully into camera
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310) * (1 + 0.03 * ease.inOut(p)), {
    outfit: HERO, expr: 'smile', rimColor: '#2a9d8f', rimSide: 1
  });

  FX.dust(g, t, { count: 35, color: '#2a9d8f', a: 0.3 });
  FX.sparkle(g, E.W * 0.25, E.H * 0.35, 20, '#ffd166');
  FX.sparkle(g, E.W * 0.75, E.H * 0.35, 20, '#ffd166');
} });

// shots/03_cafe.js — Act 2: the café experiment & the hollow high (s016 - s026)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { cafe, cafeGround, cafeTable } from '../sets/cafe.js';
import { HERO, ACTOR, FRIEND } from '../cast.js';

// s016: "On day one, you experiment."
registerShot('s016', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1 + 0.05 * p, x: -20, y: 0 };
  const { GY, CX, M } = cafe(g, t, cam, { mood: 'golden' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.ready, t), expr: 'determined', rim: { color: M.rim, dir: [0, -1] }
    });
  });
  FX.dust(g, t, { count: 25, color: '#ffe2bd', a: 0.25 });
} });

// s017: "You walk into a café looking like a famous actor."
registerShot('s017', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.05, x: -30 + 50 * p, y: 0 };
  const { GY, CX, M } = cafe(g, t, cam, { mood: 'golden' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    FX.chair(g, CX - 300, GY, s, '#24181e');
    drawFigure(g, { x: CX - 280, y: GY, s, facing: 1, outfit: FRIEND, pose: breathe(POSES.sit, t), expr: 'surprised', rim: { color: M.rim, dir: [0, -1] } });
    drawFigure(g, {
      x: CX - 80 + p * 160, y: GY, s, facing: 1, outfit: ACTOR,
      pose: walkPose(t * 1.8), expr: 'smile', rim: { color: '#ffd166', dir: [0, -1], w: 5 }, shadow: true
    });
  });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });

// s018: "People recognize the face instantly."
registerShot('s018', { draw(g, t, info) {
  const cam = { z: 1.2, x: 10, y: -20 };
  const { GY, CX, M } = cafe(g, t, cam, { mood: 'golden' });
  const s = V(1.6, 1.7);
  layer(g, cam, 1.0, (g) => {
    drawFigure(g, { x: CX - 120, y: GY, s, facing: 1, outfit: FRIEND, pose: breathe(POSES.shrug, t), expr: 'shocked', rim: { color: M.rim, dir: [-1, -1] } });
    drawFigure(g, { x: CX + 120, y: GY, s, facing: -1, outfit: { top: 'tshirt', color: '#6d597a' }, pose: breathe(POSES.point, t), expr: 'surprised', rim: { color: M.rim, dir: [-1, -1] } });
  });
  FX.dust(g, t, { count: 20, color: '#ffe2bd', a: 0.2 });
} });

// s019: "They stare, whisper, and ask for selfies."
registerShot('s019', { draw(g, t, info) {
  const cam = { z: 1.1, x: 0, y: 0 };
  const { GY, CX, M } = cafe(g, t, cam, { mood: 'golden' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    drawFigure(g, { x: CX, y: GY, s, facing: 1, outfit: ACTOR, pose: breathe(POSES.cheer, t), expr: 'smile', rim: { color: '#ffd166', dir: [0, -1], w: 5 } });
    drawFigure(g, { x: CX + 110, y: GY, s, facing: -1, outfit: FRIEND, pose: breathe(POSES.phone, t), prop: 'phone', expr: 'grin', rim: { color: M.rim, dir: [0, -1] } });
  });
  for (const ft of [1.2, 2.8]) {
    if (t > ft && t < ft + 0.2) {
      const flashP = 1 - (t - ft) / 0.2;
      veil(g, '#ffffff', 0.4 * flashP);
      circle(g, CX + 100, GY - 160 * s, 40 * flashP, '#ffffff');
      glow(g, CX + 100, GY - 160 * s, 120, '#ffffff', 0.8 * flashP);
    }
  }
} });

// s020: "For the first time, strangers treat you like someone important."
registerShot('s020', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  blurLayer(g, 10, (g) => cafe(g, t, { z: 1.3, x: 0, y: -20 }, { mood: 'golden' }));
  veil(g, '#1a1008', 0.35);
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: ACTOR, expr: 'smirk', rimColor: '#ffd166', rimSide: 1
  });
  FX.sparkle(g, E.W * 0.3, E.H * 0.4, 25, '#ffd166');
  FX.sparkle(g, E.W * 0.7, E.H * 0.35, 20, '#ffd166');
} });

// s021: "Then you change back."
registerShot('s021', { draw(g, t, info) {
  backdrop(g, ['#0d141c', '#152430']);
  const M = mood('emerald');
  const morph = t > 0.8;
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: morph ? HERO : ACTOR, expr: 'surprised',
    rimColor: morph ? '#2a9d8f' : '#ffd166', rimSide: -1
  });
  if (t > 0.6 && t < 1.2) {
    const waveP = (t - 0.6) / 0.6;
    ring(g, E.W / 2, E.H * 0.55, 300 * waveP, 4, alpha('#2a9d8f', 1 - waveP));
  }
} });

// s022: "Suddenly, you're invisible again."
registerShot('s022', { draw(g, t, info) {
  const cam = { z: 1.0, x: 0, y: 0 };
  const { GY, CX, M } = cafe(g, t, cam, { mood: 'emerald' });
  const s = V(1.4, 1.5);
  layer(g, cam, 1.0, (g) => {
    // Hero in center, faded / dim, patrons walking right past ignoring
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.relaxed, t), expr: 'sad', alpha: 0.65,
      rim: { color: M.rim, dir: [0, -1] }
    });
    // Two blurry patrons walking past in foreground
    drawFigure(g, { x: CX - 180, y: GY, s, facing: -1, outfit: { top: 'tshirt', color: '#334155' }, pose: walkPose(t * 1.5), shadow: true });
    drawFigure(g, { x: CX + 180, y: GY, s, facing: 1, outfit: { top: 'jacket', color: '#475569' }, pose: walkPose(t * 1.4), shadow: true });
  });
  veil(g, '#04080e', 0.35);
} });

// s023: "And you realize something uncomfortable."
registerShot('s023', { draw(g, t, info) {
  backdrop(g, ['#080f14', '#101c24']);
  const M = mood('emerald');
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: HERO,
    pose: breathe(POSES.crossArms, t), expr: 'thoughtful', rim: { color: M.rim, dir: [0, -1] }
  });
  FX.fog(g, E.H * 0.75, 140, '#2a9d8f', 0.25);
} });

// s024: "People haven't changed their behavior because of who you are,"
registerShot('s024', { draw(g, t, info) {
  backdrop(g, ['#070d12', '#0e1820']);
  const s = V(1.5, 1.6);
  // Real hero silhouette on left
  drawFigure(g, {
    x: E.W * 0.35, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'neutral', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  // Empty pedestal / glowing mask outline on right
  rr(g, E.W * 0.65 - 40, E.H * 0.65, 80, 120, 10);
  g.fillStyle = '#141e26'; g.fill();
  circle(g, E.W * 0.65, E.H * 0.55, 35, '#e76f51');
  glow(g, E.W * 0.65, E.H * 0.55, 90, '#e76f51', 0.4);
} });

// s025: "they've changed it because of what your face represents."
registerShot('s025', { draw(g, t, info) {
  backdrop(g, ['#091218', '#14222c']);
  const r = V(280, 310);
  bigFace(g, E.W / 2, E.H * 0.55, r, {
    outfit: ACTOR, expr: 'neutral', rimColor: '#ffd166', rimSide: 1
  });
  // Wireframe holographic grid projection over the face
  g.strokeStyle = 'rgba(255, 209, 102, 0.35)'; g.lineWidth = 1.5;
  for (let i = -3; i <= 3; i++) {
    g.beginPath(); g.moveTo(E.W / 2 - r, E.H * 0.55 + i * 40); g.lineTo(E.W / 2 + r, E.H * 0.55 + i * 40); g.stroke();
  }
} });

// s026: "But that's only the beginning."
registerShot('s026', { draw(g, t, info) {
  backdrop(g, ['#04080c', '#091016']);
  const s = V(1.6, 1.7);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.82, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.ready, t), expr: 'determined', rim: { color: '#2a9d8f', dir: [0, -1], w: 5 }
  });
  FX.fog(g, E.H * 0.78, 180, '#2a9d8f', 0.3);
} });

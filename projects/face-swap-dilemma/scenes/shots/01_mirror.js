// shots/01_mirror.js — opening bedroom mirror discovery sequence (s001 - s008)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, talkAmount, circle, ring, rr, glow, alpha, shade, linGrad } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedroomGround, vanityMirror } from '../sets/bedroom.js';
import { HERO, LEADER } from '../cast.js';

const S = () => V(1.5, 1.6);

// s001: "Imagine waking up tomorrow with the face of the most powerful person on earth."
registerShot('s001', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1 + 0.08 * ease.inOut(p), x: -20 * ease.inOut(p), y: -10 * ease.inOut(p) };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'night' });
  const s = S(), rim = { color: M.rim, dir: [0, -1], w: 4 };

  layer(g, cam, 0.7, (g) => {
    vanityMirror(g, CX + 40, GY - 30, V(320, 260), V(400, 360), M);
    drawFigure(g, {
      x: CX + 40, y: GY - 20, s: s * 0.95, facing: -1, outfit: LEADER,
      pose: breathe(POSES.ready, t), expr: t > 1.8 ? 'shocked' : 'neutral',
      rim: { color: '#ffdf9e', dir: [0, -1], w: 5 }, alpha: 0.9
    });
  });

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX - 60, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(posesAt(t, [[0, 'stand'], [1.2, 'handsOnHead']]), t),
      expr: 'shocked', rim, shadow: true
    });
  });

  FX.dust(g, t, { count: 30, color: '#ffecbd', a: 0.25 });
  FX.lensStreak(g, CX + 40, GY - V(280, 260), E.W, '#ffe5b4', 0.15);
} });

// s002: "Your reflection is no longer yours." — giant face close-up
registerShot('s002', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  blurLayer(g, 12, (g) => bedroom(g, t, { z: 1.4, x: -80, y: -40 }, { mood: 'night' }));
  veil(g, '#0c0a14', 0.45);

  const M = mood('night');
  const r = V(280, 310) * (1 + 0.04 * ease.inOut(p));
  const tilt = Math.sin(t * 1.5) * 0.03;

  bigFace(g, E.W / 2, E.H * V(0.58, 0.52), r, {
    outfit: LEADER, expr: t > 2.0 ? 'shocked' : 'neutral',
    look: [Math.sin(t * 1.2) * 0.15, -0.1], rimColor: M.rim, rimSide: 1, tilt
  });

  FX.dust(g, t, { count: 25, color: '#e8f0fe', a: 0.3 });
} });

// s003: "Your voice is the same."
registerShot('s003', { draw(g, t, info) {
  const cam = { z: 1.15, x: 10, y: -20 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'night' });
  const s = S() * 1.15, rim = { color: M.rim, dir: [-1, -1], w: 4 };

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.phone, t), expr: 'talk', talk: 0.8, rim, shadow: true
    });
  });

  const ripP = (t * 2.5) % 1;
  circle(g, CX + 15, GY - 180 * s, 20 + ripP * 40, alpha(M.rim, 0.5 * (1 - ripP)));
  FX.dust(g, t, { count: 20, color: '#ffecbd', a: 0.2 });
} });

// s004: "Your memories are intact, but your face... completely different."
registerShot('s004', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.05 + 0.05 * p, x: -10, y: 0 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'night' });
  const s = S(), rim = { color: M.rim, dir: [0, -1], w: 4 };

  layer(g, cam, 0.7, (g) => {
    vanityMirror(g, CX, GY - 30, V(300, 240), V(380, 340), M);
    const morph = Math.sin(t * 3) > 0;
    drawFigure(g, {
      x: CX, y: GY - 20, s: s * 0.95, facing: -1, outfit: morph ? LEADER : HERO,
      pose: breathe(POSES.think, t), expr: 'troubled',
      rim: { color: morph ? '#f4a261' : M.rim, dir: [0, -1], w: 4 }, alpha: 0.85
    });
  });

  FX.dust(g, t, { count: 25, color: '#ffecbd', a: 0.2 });
} });

// s005: "completely different."
registerShot('s005', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  blurLayer(g, 10, (g) => bedroom(g, t, { z: 1.3, x: 0, y: -30 }, { mood: 'night' }));
  veil(g, '#080810', 0.5);
  const M = mood('night');
  const r = V(290, 320);

  // Split face: left side hero, right side leader
  bigFace(g, E.W / 2, E.H * V(0.58, 0.52), r, {
    outfit: t > 1.0 ? LEADER : HERO, expr: 'shocked',
    look: [0, 0], rimColor: '#f4a261', rimSide: -1
  });
} });

// s006: "And here's the terrifying part:"
registerShot('s006', { draw(g, t, info) {
  const cam = { z: 1.1 + 0.04 * t, x: -15, y: -10 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'night' });
  const s = S(), rim = { color: '#e63946', dir: [0, -1], w: 4 };

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.facepalm, t), expr: 'troubled', rim
    });
  });
  FX.fog(g, GY - 100, 180, '#e63946', 0.18);
} });

// s007: "nobody can prove who you really are."
registerShot('s007', { draw(g, t, info) {
  const cam = { z: 1.25, x: 0, y: -15 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'night' });
  const s = S() * 1.2, rim = { color: M.rim, dir: [0, -1], w: 4 };

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.shrug, t), expr: 'sad', rim
    });
  });
  FX.dust(g, t, { count: 30, color: '#e0e6ed', a: 0.25 });
} });

// s008: "Let's say you discover a strange ability."
registerShot('s008', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.0 + 0.1 * ease.inOut(p), x: 0, y: 0 };
  const { GY, CX, M } = bedroom(g, t, cam, { mood: 'emerald' });
  const s = S(), rim = { color: '#2a9d8f', dir: [0, -1], w: 5 };

  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: HERO,
      pose: breathe(POSES.reach, t), expr: 'surprised', rim
    });
  });

  // Glowing energy ring around hero's hands
  const pulse = Math.sin(t * 4) * 15;
  ring(g, CX + 35, GY - 160 * s, 45 + pulse, 3, '#2a9d8f');
  glow(g, CX + 35, GY - 160 * s, 90, '#2a9d8f', 0.5);
} });

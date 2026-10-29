// shots/04_home.js — Act 3: personal estrangement & the family door (s027 - s037)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { home, homeGround } from '../sets/home.js';
import { HERO, MOM, FRIEND, PARTNER } from '../cast.js';

// Stranger persona used for the home test
const STRANGER = { top: 'jacket', color: '#6d6875', head: 'none' };

// s027: "You decide to test something more personal."
registerShot('s027', { draw(g, t, info) {
  backdrop(g, ['#0a141a', '#12222c']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s028: "You swap faces with someone your family knows."
registerShot('s028', { draw(g, t, info) {
  backdrop(g, ['#091016', '#101d26']);
  const morph = t > 1.2;
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: morph ? STRANGER : HERO, expr: 'surprised',
    rimColor: morph ? '#e9c46a' : '#2a9d8f', rimSide: 1
  });
} });

// s029: "Then you walk through your own front door."
registerShot('s029', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.05, x: -30 + 40 * p, y: 0 };
  const { GY, CX, M } = home(g, t, cam, { mood: 'interiorWarm', doorOpen: 0.65 });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX - V(460, 280) + p * 120, y: GY, s, facing: 1, outfit: STRANGER,
      pose: walkPose(t * 1.5), expr: 'neutral', rim: { color: M.rim, dir: [0, -1] }, shadow: true
    });
  });
} });

// s030: "Your mother sees a stranger."
registerShot('s030', { draw(g, t, info) {
  const cam = { z: 1.15, x: 20, y: -10 };
  const { GY, CX, M } = home(g, t, cam, { mood: 'interiorWarm' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    // Mother with tea mug looking shocked/alarmed
    drawFigure(g, {
      x: CX, y: GY, s, facing: -1, outfit: MOM,
      pose: breathe(POSES.handsOnHead, t), expr: 'shocked', rim: { color: '#e9c46a', dir: [0, -1] }
    });
  });
} });

// s031: "Your best friend doesn't recognize you."
registerShot('s031', { draw(g, t, info) {
  const cam = { z: 1.15, x: -10, y: -10 };
  const { GY, CX, M } = home(g, t, cam, { mood: 'interiorWarm' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    drawFigure(g, {
      x: CX, y: GY, s, facing: 1, outfit: FRIEND,
      pose: breathe(POSES.crossArms, t), expr: 'suspicious', rim: { color: '#457b9d', dir: [-1, -1] }
    });
  });
} });

// s032: "Your partner steps back, wondering who just entered the room."
registerShot('s032', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.1, x: 10, y: 0 };
  const { GY, CX, M } = home(g, t, cam, { mood: 'interiorWarm' });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    // Partner stepping back in distrust
    const stepX = CX + 120 + ease.inOut(p) * 60;
    drawFigure(g, {
      x: stepX, y: GY, s, facing: -1, outfit: PARTNER,
      pose: breathe(POSES.crouch, t), expr: 'shocked', rim: { color: '#f28482', dir: [-1, -1] }
    });
    // You (stranger appearance) reaching out explaining
    drawFigure(g, {
      x: CX - 100, y: GY, s, facing: 1, outfit: STRANGER,
      pose: breathe(POSES.reach, t), expr: 'troubled', rim: { color: M.rim, dir: [0, -1] }
    });
  });
} });

// s033: "You know their birthdays, their secrets, the memories nobody else shares."
registerShot('s033', { draw(g, t, info) {
  backdrop(g, ['#091218', '#14222c']);
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: STRANGER,
    pose: breathe(POSES.explain, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  // Floating memory cards with dates & locks
  for (let i = 0; i < 3; i++) {
    const mx = E.W * (0.25 + i * 0.25), my = E.H * 0.35 + Math.sin(t * 2 + i) * 15;
    rr(g, mx - 40, my - 30, 80, 60, 8);
    g.fillStyle = 'rgba(24, 40, 52, 0.7)'; g.fill();
    g.strokeStyle = '#2a9d8f'; g.lineWidth = 2; g.stroke();
    circle(g, mx, my, 12, '#ffd166');
  }
} });

// s034: "But to them, you're an unfamiliar face,"
registerShot('s034', { draw(g, t, info) {
  backdrop(g, ['#060c12', '#0c161e']);
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: STRANGER, expr: 'neutral', rimColor: '#6d6875', rimSide: -1
  });
  veil(g, '#04070a', 0.3);
} });

// s035: "claiming to be someone they love."
registerShot('s035', { draw(g, t, info) {
  backdrop(g, ['#081016', '#101e28']);
  const s = V(1.5, 1.6);
  // Partner turning away
  drawFigure(g, {
    x: E.W * 0.65, y: E.H * 0.8, s, facing: -1, outfit: PARTNER,
    pose: breathe(POSES.sad, t), expr: 'sad', rim: { color: '#f28482', dir: [-1, -1] }
  });
  // You reaching hand
  drawFigure(g, {
    x: E.W * 0.35, y: E.H * 0.8, s, facing: 1, outfit: STRANGER,
    pose: breathe(POSES.reach, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s036: "You could tell them everything."
registerShot('s036', { draw(g, t, info) {
  backdrop(g, ['#080f14', '#101d24']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: STRANGER,
    pose: breathe(POSES.talk, t), expr: 'talk', talk: 0.85, rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s037: "Would they believe you?"
registerShot('s037', { draw(g, t, info) {
  backdrop(g, ['#05090e', '#0a1218']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: STRANGER,
    pose: breathe(POSES.facepalm, t), expr: 'sad', rim: { color: '#e63946', dir: [0, -1] }
  });
  FX.dust(g, t, { count: 35, color: '#e63946', a: 0.2 });
} });

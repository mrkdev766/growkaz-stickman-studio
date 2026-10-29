// shots/06_influence.js — Act 5: power, deception, corruption & loss of identity (s049 - s059)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { corridor, corridorGround } from '../sets/corridor.js';
import { HERO, LEADER, ACTOR } from '../cast.js';

// s049: "Now imagine discovering something even more dangerous."
registerShot('s049', { draw(g, t, info) {
  backdrop(g, ['#05080f', '#0c1220']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'troubled', rim: { color: '#e76f51', dir: [0, -1] }
  });
  FX.fog(g, E.H * 0.75, 160, '#e76f51', 0.25);
} });

// s050: "You can become someone people trust."
registerShot('s050', { draw(g, t, info) {
  backdrop(g, ['#08121a', '#10222c']);
  const s = V(1.5, 1.6);
  // Citizen shaking hands / bowing to Leader face
  drawFigure(g, {
    x: E.W * 0.35, y: E.H * 0.8, s, facing: 1, outfit: LEADER,
    pose: breathe(POSES.holdFront, t), expr: 'smile', rim: { color: '#ffd166', dir: [0, -1] }
  });
  drawFigure(g, {
    x: E.W * 0.65, y: E.H * 0.8, s, facing: -1, outfit: { top: 'tshirt', color: '#64748b' },
    pose: breathe(POSES.reach, t), expr: 'smile', rim: { color: '#2a9d8f', dir: [-1, -1] }
  });
} });

// s051: "Someone with influence."
registerShot('s051', { draw(g, t, info) {
  backdrop(g, ['#0c1420', '#162436']);
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: LEADER, expr: 'smirk', rimColor: '#ffd166', rimSide: 1
  });
  glow(g, E.W / 2, E.H * 0.55, 200, '#ffd166', 0.25);
} });

// s052: "Someone with access."
registerShot('s052', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.05, x: 0, y: 0 };
  const { GY, CX } = corridor(g, t, cam, { open: 0.8 * ease.inOut(p) });
  drawFigure(g, {
    x: CX, y: GY, s: V(1.4, 1.5), facing: 1, outfit: LEADER,
    pose: walkPose(t * 1.5), expr: 'neutral', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s053: "Someone whose face opens doors that would otherwise remain closed."
registerShot('s053', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  const cam = { z: 1.1 + 0.05 * p, x: -10, y: -10 };
  const { GY, CX } = corridor(g, t, cam, { open: 1.0 });
  const s = V(1.5, 1.6);
  layer(g, cam, 1.0, (g) => {
    // Guards standing aside at attention
    drawFigure(g, { x: CX - 180, y: GY, s, facing: 1, outfit: { top: 'suit', color: '#1e293b' }, pose: POSES.ready, rim: { color: '#64748b', dir: [0, -1] } });
    drawFigure(g, { x: CX + 180, y: GY, s, facing: -1, outfit: { top: 'suit', color: '#1e293b' }, pose: POSES.ready, rim: { color: '#64748b', dir: [0, -1] } });
    // Leader walking through doorway
    drawFigure(g, { x: CX, y: GY - 20, s: s * 0.9, facing: 1, outfit: LEADER, pose: walkPose(t * 1.4), shadow: true });
  });
} });

// s054: "But every time you use that power to deceive someone,"
registerShot('s054', { draw(g, t, info) {
  backdrop(g, ['#100a0e', '#1c1016']);
  const s = V(1.5, 1.6);
  // Leader face pulling away from person, two-faced illusion
  drawFigure(g, {
    x: E.W * 0.45, y: E.H * 0.8, s, facing: 1, outfit: LEADER,
    pose: breathe(POSES.crossArms, t), expr: 'smirk', rim: { color: '#e76f51', dir: [0, -1] }
  });
  drawFigure(g, {
    x: E.W * 0.55, y: E.H * 0.8, s, facing: -1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'sad', alpha: 0.5, rim: { color: '#2a9d8f', dir: [-1, -1] }
  });
} });

// s055: "you risk destroying the very thing that makes relationships meaningful."
registerShot('s055', { draw(g, t, info) {
  backdrop(g, ['#0e080b', '#180e14']);
  // Heart/connection thread snapping in two
  const cx = E.W / 2, cy = E.H * 0.5;
  const breakP = ease.inOut(prog(t, 0.5, 2.5));
  circle(g, cx - 80 - breakP * 50, cy, 35, '#2a9d8f');
  circle(g, cx + 80 + breakP * 50, cy, 35, '#f28482');
  g.strokeStyle = '#e63946'; g.lineWidth = 3;
  g.beginPath();
  g.moveTo(cx - 45 - breakP * 50, cy);
  g.lineTo(cx - 10, cy - 15);
  g.lineTo(cx + 10, cy + 15);
  g.lineTo(cx + 45 + breakP * 50, cy);
  g.stroke();
  if (breakP > 0.5) glow(g, cx, cy, 80, '#e63946', 0.5);
} });

// s056: "Trust."
registerShot('s056', { draw(g, t, info) {
  backdrop(g, ['#06080e', '#0b101a']);
  // Bold single word TRUST breaking apart
  g.fillStyle = '#2a9d8f';
  g.font = '800 64px monospace';
  g.textAlign = 'center';
  g.fillText('T R U S T', E.W / 2, E.H * 0.52);
  glow(g, E.W / 2, E.H * 0.52, 120, '#2a9d8f', 0.4);
} });

// s057: "And then comes the question you never expected to ask yourself."
registerShot('s057', { draw(g, t, info) {
  backdrop(g, ['#05080c', '#091016']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
} });

// s058: "If you can become anyone,"
registerShot('s058', { draw(g, t, info) {
  backdrop(g, ['#080e14', '#101c26']);
  const morph = Math.floor(t * 3) % 4;
  const outfits = [HERO, LEADER, ACTOR, { top: 'trench', color: '#6d6875' }];
  bigFace(g, E.W / 2, E.H * 0.55, V(280, 310), {
    outfit: outfits[morph], expr: 'neutral', rimColor: '#2a9d8f', rimSide: 1
  });
} });

// s059: "how long before you stop knowing who you are? Here's the real twist."
registerShot('s059', { draw(g, t, info) {
  backdrop(g, ['#04060a', '#080c14']);
  // Hero face fading into pure silhouette with a question mark
  const s = V(1.6, 1.7);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.facepalm, t), expr: 'sad', rim: { color: '#e63946', dir: [0, -1], w: 4 }
  });
  FX.fog(g, E.H * 0.75, 180, '#e63946', 0.35);
} });

// shots/05_surveillance.js — Act 4: surveillance, biometrics & vulnerability (s038 - s048)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { surveillance, faceScannerHUD } from '../sets/surveillance.js';
import { HERO, LEADER } from '../cast.js';

// s038: "Now imagine the consequences outside your home."
registerShot('s038', { draw(g, t, info) {
  const { CX, CY, M } = surveillance(g, t, { z: 1, x: 0, y: 0 });
  drawFigure(g, {
    x: CX, y: E.H * 0.8, s: V(1.5, 1.6), facing: 1, outfit: HERO,
    pose: breathe(POSES.ready, t), expr: 'troubled', rim: { color: M.rim, dir: [0, -1] }
  });
} });

// s039: "Your phone unlocks with your face."
registerShot('s039', { draw(g, t, info) {
  backdrop(g, ['#060c14', '#0d1824']);
  const cx = E.W / 2, cy = E.H * 0.5;
  // Giant smartphone UI
  rr(g, cx - 120, cy - 200, 240, 400, 24); g.fillStyle = '#101c28'; g.fill();
  g.strokeStyle = '#2a9d8f'; g.lineWidth = 4; g.stroke();
  // Face scan HUD inside phone screen
  faceScannerHUD(g, cx, cy - 20, 75, t, t > 1.0);
} });

// s040: "Security cameras record you."
registerShot('s040', { draw(g, t, info) {
  const { CX, CY } = surveillance(g, t, { z: 1.1, x: -20, y: 0 });
  drawFigure(g, {
    x: CX - 60, y: E.H * 0.8, s: V(1.4, 1.5), facing: 1, outfit: HERO,
    pose: walkPose(t * 1.4), expr: 'neutral', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  // Camera HUD overlay (REC [●] 00:02:14)
  circle(g, 100, 80, 10, '#e63946');
  g.fillStyle = '#e63946'; g.font = '700 22px monospace'; g.fillText('REC', 125, 88);
} });

// s041: "People identify you through photographs."
registerShot('s041', { draw(g, t, info) {
  backdrop(g, ['#070e16', '#0f1c2a']);
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.holdFront, t), prop: 'paper', expr: 'neutral', rim: { color: '#2a9d8f', dir: [0, -1] }
  });
  // Multiple photo cards scattering
  for (let i = 0; i < 4; i++) {
    const px = E.W * (0.2 + i * 0.2), py = E.H * 0.35 + Math.sin(t * 3 + i) * 12;
    rr(g, px - 35, py - 45, 70, 90, 6); g.fillStyle = '#1a2634'; g.fill();
    g.strokeStyle = '#38bdf8'; g.lineWidth = 2; g.stroke();
    circle(g, px, py - 10, 16, '#38bdf8');
  }
} });

// s042: "But what happens when your face no longer matches your official identity?"
registerShot('s042', { draw(g, t, info) {
  const { CX, CY } = surveillance(g, t, { z: 1.0, x: 0, y: 0 });
  // Hero face with big red MISMATCH scan HUD
  bigFace(g, CX, CY, V(250, 280), {
    outfit: HERO, expr: 'shocked', rimColor: '#e63946', rimSide: 1
  });
  faceScannerHUD(g, CX, CY, 160, t, false);
} });

// s043: "Some systems might reject you."
registerShot('s043', { draw(g, t, info) {
  backdrop(g, ['#14070a', '#240c10']);
  const cx = E.W / 2, cy = E.H * 0.5;
  // Big red barrier / ACCESS DENIED stamp
  rr(g, cx - 220, cy - 70, 440, 140, 16); g.fillStyle = '#2a0c10'; g.fill();
  g.strokeStyle = '#e63946'; g.lineWidth = 4; g.stroke();
  g.fillStyle = '#e63946'; g.font = '800 38px monospace'; g.textAlign = 'center';
  g.fillText('ACCESS DENIED', cx, cy + 12);
  glow(g, cx, cy, 140, '#e63946', 0.5);
} });

// s044: "Others might mistake you for someone else."
registerShot('s044', { draw(g, t, info) {
  backdrop(g, ['#09111a', '#12202e']);
  const s = V(1.5, 1.6);
  // Guard pointing / questioning hero wearing leader face
  drawFigure(g, {
    x: E.W * 0.35, y: E.H * 0.8, s, facing: 1, outfit: { top: 'suit', color: '#1e293b', face: 'glasses' },
    pose: breathe(POSES.point, t), expr: 'suspicious', rim: { color: '#e63946', dir: [0, -1] }
  });
  drawFigure(g, {
    x: E.W * 0.65, y: E.H * 0.8, s, facing: -1, outfit: LEADER,
    pose: breathe(POSES.shrug, t), expr: 'troubled', rim: { color: '#2a9d8f', dir: [-1, -1] }
  });
} });

// s045: "And if someone commits a crime while wearing your face,"
registerShot('s045', { draw(g, t, info) {
  backdrop(g, ['#0e080a', '#1c0e12']);
  // Shadowy figure in hoodie committing crime / CCTV freeze frame
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.crouch, t), expr: 'troubled', rim: { color: '#e63946', dir: [0, -1], w: 5 }
  });
  // Red police siren strobe
  if (Math.sin(t * 8) > 0) {
    veil(g, '#e63946', 0.15);
    glow(g, E.W * 0.2, E.H * 0.2, 200, '#e63946', 0.6);
  }
} });

// s046: "how do you prove you weren't there?"
registerShot('s046', { draw(g, t, info) {
  backdrop(g, ['#0a0810', '#14101e']);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s: V(1.6, 1.7), facing: 1, outfit: HERO,
    pose: breathe(POSES.handsOnHead, t), expr: 'sad', rim: { color: '#e63946', dir: [0, -1] }
  });
  FX.dust(g, t, { count: 30, color: '#e63946', a: 0.25 });
} });

// s047: "In a world built around recognizing appearances,"
registerShot('s047', { draw(g, t, info) {
  backdrop(g, ['#060c14', '#0d1824']);
  // Row of floating ID cards with different faces
  for (let i = 0; i < 5; i++) {
    const x = E.W * (0.15 + i * 0.18), y = E.H * 0.5 + Math.sin(t * 2 + i) * 15;
    rr(g, x - 45, y - 65, 90, 130, 8); g.fillStyle = '#122030'; g.fill();
    g.strokeStyle = '#2a9d8f'; g.lineWidth = 2; g.stroke();
    circle(g, x, y - 15, 22, i % 2 === 0 ? '#2a9d8f' : '#e76f51');
  }
} });

// s048: "your greatest power becomes your greatest vulnerability."
registerShot('s048', { draw(g, t, info) {
  backdrop(g, ['#080a12', '#101422']);
  bigFace(g, E.W / 2, E.H * 0.55, V(290, 320), {
    outfit: HERO, expr: 'troubled', rimColor: '#e63946', rimSide: -1
  });
  // Shattered glass fracture lines across face
  g.strokeStyle = 'rgba(230, 57, 70, 0.45)'; g.lineWidth = 2.5;
  g.beginPath();
  g.moveTo(E.W * 0.35, E.H * 0.3); g.lineTo(E.W * 0.5, E.H * 0.55);
  g.lineTo(E.W * 0.65, E.H * 0.45); g.moveTo(E.W * 0.5, E.H * 0.55);
  g.lineTo(E.W * 0.48, E.H * 0.75); g.stroke();
} });

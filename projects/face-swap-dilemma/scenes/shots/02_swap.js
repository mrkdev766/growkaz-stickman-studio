// shots/02_swap.js — swap ability, identity spectrum, superpower premise (s009 - s015)
import { E, V, registerShot, mood, layer, blurLayer, veil, ease, prog, clamp, lerp, circle, ring, rr, glow, alpha, shade, linGrad, backdrop } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { HERO, LEADER, ACTOR, FRIEND } from '../cast.js';

// s009: "With a single thought, you can swap your face with anyone on the planet." (3D orbit)
registerShot('s009', {
  kind: '3d',
  init(T) {
    const M = mood('emerald');
    const st = T.stage({ mood: 'emerald', fov: V(36, 52), fog: [10, 40], keyPos: [0, 8, 5], keyIntensity: 2.5, ambient: 1.2 });
    st.add(T.ground(50, 50, M.floor, T.tiles(M.floor, 8, [8, 8])));
    const hero = T.figure3D(HERO, { rim: M.rim, pose: POSES.think });
    hero.position.set(0, 0, 0); st.add(hero);

    const cards = []; const radius = 2.4, count = 6;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const card = T.box(0.5, 0.7, 0.04, i % 2 === 0 ? '#2a9d8f' : '#e76f51', Math.cos(angle) * radius, 1.4, Math.sin(angle) * radius);
      st.add(card); cards.push(card);
    }
    return { stage: st, hero, cards, radius };
  },
  draw(s, t, info, T) {
    T.orbit(s.stage.camera, t, { target: [0, 1.2, 0], radius: V(5.5, 7.0), height: [2.2, 1.6], from: -1.2, to: 0.6, dur: info.dur });
    const angleOffset = t * 0.8;
    s.cards.forEach((card, i) => {
      const a = (i / s.cards.length) * Math.PI * 2 + angleOffset;
      card.position.x = Math.cos(a) * s.radius;
      card.position.z = Math.sin(a) * s.radius;
      card.position.y = 1.4 + Math.sin(t * 2 + i) * 0.15;
      card.rotation.y = -a + Math.PI / 2;
    });
  },
  overlay(g, t, info) {
    ring(g, E.W / 2, E.H * 0.45, 120 + Math.sin(t * 3) * 10, 2, 'rgba(42, 157, 143, 0.35)');
    FX.dust(g, t, { count: 20, color: '#2a9d8f', a: 0.25 });
  }
});

// s010: "Not a mask." — physical mask being held away
registerShot('s010', { draw(g, t, info) {
  const M = mood('emerald');
  backdrop(g, ['#091218', '#0f1f28']);
  const s = V(1.6, 1.7);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.holdFront, t), expr: 'neutral', rim: { color: M.rim, dir: [0, -1] }
  });
  // Crossed out mask icon
  rr(g, E.W / 2 + 70, E.H * 0.48, 55, 75, 12); g.fillStyle = '#1c2830'; g.fill();
  g.strokeStyle = '#e63946'; g.lineWidth = 4;
  g.beginPath(); g.moveTo(E.W / 2 + 55, E.H * 0.45); g.lineTo(E.W / 2 + 140, E.H * 0.58); g.stroke();
} });

// s011: "Not a photograph." — framed photo dissolving
registerShot('s011', { draw(g, t, info) {
  backdrop(g, ['#091218', '#0f1f28']);
  const cx = E.W / 2, cy = E.H * 0.5;
  rr(g, cx - 100, cy - 130, 200, 260, 10);
  g.fillStyle = '#1b2a36'; g.fill();
  g.strokeStyle = '#2a9d8f'; g.lineWidth = 3; g.stroke();
  circle(g, cx, cy - 30, 45, '#e76f51');
  // Red diagonal slash
  g.strokeStyle = '#e63946'; g.lineWidth = 5;
  g.beginPath(); g.moveTo(cx - 120, cy - 150); g.lineTo(cx + 120, cy + 150); g.stroke();
} });

// s012: "Your actual appearance changes." — morphing ripple
registerShot('s012', { draw(g, t, info) {
  const p = prog(t, 0, info.dur);
  backdrop(g, ['#070d12', '#0d1822']);
  const M = mood('emerald');
  const r = V(280, 310);
  const morph = t > 1.4;
  bigFace(g, E.W / 2, E.H * 0.55, r, {
    outfit: morph ? ACTOR : HERO, expr: 'surprised',
    rimColor: '#2a9d8f', rimSide: 1
  });
  // Ripple shockwave during change
  if (t > 1.2 && t < 2.0) {
    const waveP = (t - 1.2) / 0.8;
    ring(g, E.W / 2, E.H * 0.55, r * waveP * 1.5, 4, alpha('#2a9d8f', 1 - waveP));
  }
} });

// s013: "You could look like a celebrity, a billionaire, your best friend, or a complete stranger."
registerShot('s013', { draw(g, t, info) {
  backdrop(g, ['#060c12', '#0d1a24']);
  const M = mood('emerald');
  const s = V(1.4, 1.5);
  const roles = [ACTOR, LEADER, FRIEND, { top: 'trench', color: '#6d6875', head: 'fedora' }];
  const spacing = V(320, 220);
  for (let i = 0; i < 4; i++) {
    const x = E.W / 2 + (i - 1.5) * spacing;
    drawFigure(g, {
      x, y: E.H * 0.82, s, facing: 1, outfit: roles[i],
      pose: breathe(POSES.relaxed, t, 1, i), expr: 'smile',
      rim: { color: i === 1 ? '#e76f51' : M.rim, dir: [0, -1] }
    });
  }
} });

// s014: "At first, it sounds like the ultimate superpower."
registerShot('s014', { draw(g, t, info) {
  backdrop(g, ['#081218', '#10222a']);
  const M = mood('emerald');
  const s = V(1.6, 1.7);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.cheer, t), expr: 'grin',
    rim: { color: '#ffd166', dir: [0, -1], w: 5 }
  });
  // Glowing golden rays behind hero
  glow(g, E.W / 2, E.H * 0.45, 240, '#ffd166', 0.45);
} });

// s015: "But let's see what happens when you actually use it."
registerShot('s015', { draw(g, t, info) {
  backdrop(g, ['#060b10', '#0a141a']);
  const M = mood('emerald');
  const s = V(1.5, 1.6);
  drawFigure(g, {
    x: E.W / 2, y: E.H * 0.8, s, facing: 1, outfit: HERO,
    pose: breathe(POSES.think, t), expr: 'neutral',
    rim: { color: M.rim, dir: [0, -1] }
  });
  FX.fog(g, E.H * 0.75, 160, '#2a9d8f', 0.25);
} });

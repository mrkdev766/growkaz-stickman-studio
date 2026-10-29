// s04.js — 3D Cosmic Dimension (globe + tesseract)
// Features: 3D shot, globe3D, tesseract3D from asset library, cosmic starfield
import { E, V, registerShot, mood } from '/engine/core.js';
import * as UI from '/engine/ui2d.js';
import * as FX from '/engine/fx2d.js';
import { globe3D, tesseract3D } from '/assets/models/models3d.js';

registerShot('s04', {
  kind: '3d',
  init(T) {
    const st = T.stage({
      mood: 'emerald',
      fov: V(38, 48),
      fog: [10, 30],
      keyPos: [0, 6, 5],
      keyIntensity: 2.5,
      ambient: 0.8
    });

    // Reflective dark floor
    const gnd = T.ground(50, 50, '#050818', T.tiles('#0a0e22', 10, [10, 10]));
    st.add(gnd);

    // 3D Holographic Globe (left side)
    const globe = globe3D({ radius: 1.2, color: '#00f0ff', x: -2.0, y: 1.8, z: 0 });
    st.add(globe);

    // 3D Tesseract Hypercube (right side)
    const tess = tesseract3D({
      outerSize: 1.2,
      innerSize: 0.6,
      color: '#ff00ff',
      innerColor: '#00e5ff',
      x: 2.0,
      y: 2.0,
      z: 0
    });
    st.add(tess);

    // Vertical energy shafts
    const shaft1 = T.shaft(0.6, 12, '#00f0ff', 0.08);
    shaft1.position.set(-2.0, 6, 0);
    st.add(shaft1);

    const shaft2 = T.shaft(0.5, 10, '#ff00ff', 0.06);
    shaft2.position.set(2.0, 5, 0);
    st.add(shaft2);

    return { stage: st, globe, tess };
  },

  draw(s, t, info, T) {
    // Rotate globe continuously
    s.globe.rotation.y = t * 0.4;

    // Animate tesseract 4D rotation + core pulsing
    s.tess.animate(t);

    // Camera orbits slowly around both objects
    T.orbit(s.stage.camera, t, {
      target: [0, 1.8, 0],
      radius: V(6.0, 7.0),
      height: [1.8, 2.5],
      from: -0.5,
      to: 0.5,
      dur: info.dur
    });
  },

  overlay(g, t, info) {
    // Cosmic dust particles
    FX.dust(g, t, { count: 40, color: '#00f0ff', a: 0.35 });
    FX.dust(g, t, { count: 20, color: '#ff00ff', a: 0.25, seed: 99 });

    // Title
    UI.bigLine(g, t, {
      str: 'BEYOND THE DIMENSION',
      size: V(42, 48),
      color: '#e0d4ff',
      y: E.H * 0.88,
      dur: info.dur
    });
  }
});

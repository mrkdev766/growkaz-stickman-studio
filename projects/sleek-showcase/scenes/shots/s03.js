import { E, V, registerShot, mood } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import * as FX from '/engine/fx2d.js';
import { ACTORS } from '../cast.js';

registerShot('s03', {
  kind: '3d',
  init(T) {
    const M = mood('emerald');
    const st = T.stage({
      mood: 'emerald',
      fov: V(40, 50),
      fog: [8, 35],
      keyPos: [2, 6, 4],
      keyIntensity: 3.0,
      ambient: 1.0
    });

    // Dark reflective digital grid ground
    const gnd = T.ground(60, 60, '#07090e', T.tiles('#0c101a', 12, [12, 12]));
    st.add(gnd);

    // Hooded mystic figure conjuring the hypercube
    const figure = T.figure3D(ACTORS.hooded, { pose: POSES.reach, rim: '#00f0ff' });
    figure.position.set(-1.1, 0, 0.2);
    figure.rotation.y = 0.5;
    st.add(figure);

    // 4D Rotating Tesseract Wireframe
    const tesseract = T.tesseract3D({
      outerSize: 1.4,
      innerSize: 0.7,
      color: '#00e5ff',
      innerColor: '#ff00aa',
      x: 0.4,
      y: 1.6,
      z: 0
    });
    st.add(tesseract);

    // Surrounding hovering light shafts / energy pillars
    const shaft1 = T.shaft(0.8, 10, '#00e5ff', 0.12);
    shaft1.position.set(0.4, 5, 0);
    st.add(shaft1);

    return { stage: st, figure, tesseract };
  },
  draw(s, t, info, T) {
    // Continuous 4D hypercube rotation & core pulsing
    s.tesseract.animate(t);

    // Camera dynamic orbit around the scene
    T.orbit(s.stage.camera, t, {
      target: [0, 1.3, 0],
      radius: V(4.2, 5.2),
      height: [1.6, 2.0],
      from: -0.7,
      to: 0.3,
      dur: info.dur
    });
  },
  overlay(g, t, info) {
    // Subtle cosmic energy dust particles
    FX.dust(g, t, { count: 30, color: '#00e5ff', a: 0.4 });

    // Lower high-tech label
    UI.bigLine(g, t, {
      str: 'HYPER-DIMENSIONAL MATRIX',
      size: V(38, 44),
      color: '#00e5ff',
      y: E.H * 0.90,
      dur: info.dur
    });
  }
});


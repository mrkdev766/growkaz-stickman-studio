import { E, V, ease, prog, lerp, layer, registerShot } from '/engine/core.js';
import { drawFigure, walkPose, POSES } from '/engine/rig2d.js';
import * as UI from '/engine/ui2d.js';
import { drawStreet } from '../sets/street.js';
import { ACTORS } from '../cast.js';

registerShot('s01', {
  kind: '2d',
  draw(g, t, info) {
    const dur = info.dur || 3.5;
    const p = t / dur;

    // Smooth cinematic tracking shot
    const cam = {
      x: lerp(-60, 40, ease.inOut(p)),
      y: 0,
      z: lerp(1.02, 1.08, p)
    };

    // Parallax Background
    layer(g, cam, 0.35, (gx) => drawStreet(gx, cam));

    // Character Plane
    layer(g, cam, 1.0, (gx) => {
      // Walking investigator
      const charX = lerp(E.W * 0.32, E.W * 0.52, p);
      const charY = E.H * 0.68;
      const pose = walkPose(t * 3.8);

      // Pupil moves dynamically: looking forward, then glancing nervously toward camera
      const lookX = p < 0.6 ? 0.3 : lerp(0.3, -0.4, ease.out(prog(p, 0.6, 0.8)));
      const lookY = p < 0.6 ? 0.0 : -0.2;

      drawFigure(gx, {
        x: charX,
        y: charY,
        s: V(1.45, 1.5),
        facing: 1,
        pose,
        outfit: ACTORS.investigator,
        expr: p < 0.6 ? 'cartoon' : 'cartoonNervous',
        look: [lookX, lookY],
        rim: { color: '#ffd166', dir: [-0.7, -0.4], w: 3.5 }
      });
    });

    // Foreground cinematic UI
    UI.callout(g, t, {
      at: [E.W * 0.42, E.H * 0.42],
      to: [E.W * 0.22, E.H * 0.26],
      str: 'SUBJECT: UNIDENTIFIED',
      start: 0.4
    });
  }
});

// assets/models/models3d.js — Reusable 3D procedural models for Three.js
// Exports: globe3D, tesseract3D, serverRack3D, surveillanceCam3D, device3D, candlestickChart3D
import { THREE, mat, basic, box, cyl, sphere, plane, C } from '/engine/three-kit.js';

// 1. Holographic / Data 3D Rotating Globe
export function globe3D(o = {}) {
  const { radius = 1.4, color = '#00f0ff', landColor = '#1e3d59', x = 0, y = 1.6, z = 0 } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  // Base inner ocean sphere (semi-transparent dark core)
  const coreMat = new THREE.MeshBasicMaterial({ color: C('#040814'), transparent: true, opacity: 0.85 });
  const core = sphere(radius * 0.98, coreMat);
  grp.add(core);

  // Wireframe longitude / latitude grid
  const wireGeo = new THREE.SphereGeometry(radius, 24, 16);
  const wireMat = new THREE.MeshBasicMaterial({ color: C(color), wireframe: true, transparent: true, opacity: 0.35 });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  grp.add(wireMesh);

  // Outer glowing atmospheric halo
  const haloGeo = new THREE.SphereGeometry(radius * 1.08, 24, 16);
  const haloMat = new THREE.MeshBasicMaterial({ color: C(color), wireframe: false, transparent: true, opacity: 0.12, side: THREE.BackSide });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  grp.add(halo);

  // 2 Orbiting communication rings
  const ringGeo1 = new THREE.RingGeometry(radius * 1.35, radius * 1.38, 48);
  const ringMat1 = new THREE.MeshBasicMaterial({ color: C(color), transparent: true, opacity: 0.6, side: THREE.DoubleSide });
  const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
  ring1.rotation.x = Math.PI * 0.35;
  grp.add(ring1);

  const ringGeo2 = new THREE.RingGeometry(radius * 1.55, radius * 1.57, 48);
  const ringMat2 = new THREE.MeshBasicMaterial({ color: C('#ff00aa'), transparent: true, opacity: 0.5, side: THREE.DoubleSide });
  const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
  ring2.rotation.x = -Math.PI * 0.28;
  ring2.rotation.y = Math.PI * 0.15;
  grp.add(ring2);

  // Pinging satellite nodes
  const sat = sphere(0.06, basic('#ffffff'));
  sat.position.set(radius * 1.36, 0, 0);
  ring1.add(sat);

  grp.animate = (t) => {
    wireMesh.rotation.y = t * 0.35;
    core.rotation.y = t * 0.35;
    ring1.rotation.z = t * 0.5;
    ring2.rotation.z = -t * 0.4;
  };

  return grp;
}

// 2. 4D Tesseract (Hypercube) Wireframe
export function tesseract3D(o = {}) {
  const { outerSize = 1.5, innerSize = 0.75, color = '#00f0ff', innerColor = '#ff00aa', x = 0, y = 1.6, z = 0 } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  const makeEdges = (sz, col) => {
    const geo = new THREE.BoxGeometry(sz, sz, sz);
    const edges = new THREE.EdgesGeometry(geo);
    return new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: C(col), linewidth: 2, transparent: true, opacity: 0.9 }));
  };

  const outer = makeEdges(outerSize, color);
  const inner = makeEdges(innerSize, innerColor);
  grp.add(outer);
  grp.add(inner);

  const strutGeo = new THREE.BufferGeometry();
  const pos = [];
  const oH = outerSize / 2, iH = innerSize / 2;
  for (const sx of [-1, 1]) {
    for (const sy of [-1, 1]) {
      for (const sz of [-1, 1]) {
        pos.push(sx * oH, sy * oH, sz * oH);
        pos.push(sx * iH, sy * iH, sz * iH);
      }
    }
  }
  strutGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  const struts = new THREE.LineSegments(strutGeo, new THREE.LineBasicMaterial({ color: C(color), transparent: true, opacity: 0.7 }));
  grp.add(struts);

  const core = sphere(innerSize * 0.25, basic(innerColor, { transparent: true, opacity: 0.7 }));
  grp.add(core);

  grp.animate = (t) => {
    outer.rotation.x = t * 0.35; outer.rotation.y = t * 0.55;
    inner.rotation.x = -t * 0.45; inner.rotation.z = t * 0.65;
    struts.rotation.x = t * 0.35; struts.rotation.y = t * 0.55;
    core.scale.setScalar(1 + 0.15 * Math.sin(t * 3));
  };
  return grp;
}

// 3. Enterprise Server Rack Mainframe
export function serverRack3D(o = {}) {
  const { w = 0.9, h = 2.4, d = 0.8, x = 0, y = 1.2, z = 0 } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  // Outer cabinet
  const cabinet = box(w, h, d, mat('#15161e', { metalness: 0.6, roughness: 0.4 }), 0, 0, 0);
  grp.add(cabinet);

  // Server blade slots
  const numBlades = 12;
  const bladeH = (h * 0.86) / numBlades;
  const leds = [];
  for (let i = 0; i < numBlades; i++) {
    const by = -h * 0.42 + i * bladeH + bladeH / 2;
    const blade = box(w * 0.88, bladeH * 0.85, 0.04, mat('#222430'), 0, by, d / 2 + 0.01);
    grp.add(blade);
    // 3 LED dots per blade
    for (let k = 0; k < 3; k++) {
      const ledCol = (i + k) % 3 === 0 ? '#00e676' : (i + k) % 3 === 1 ? '#00e5ff' : '#ffd13b';
      const led = sphere(0.015, basic(ledCol), -w * 0.35 + k * 0.06, by, d / 2 + 0.03);
      grp.add(led);
      leds.push(led);
    }
  }

  grp.animate = (t) => {
    // Blinking server LEDs
    leds.forEach((led, idx) => {
      led.visible = Math.sin(t * 6 + idx * 1.5) > -0.2;
    });
  };

  return grp;
}

// 4. CCTV Surveillance Security Camera
export function surveillanceCam3D(o = {}) {
  const { x = 0, y = 2.5, z = 0 } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  // Mount arm
  const mount = cyl(0.04, 0.04, 0.5, '#2b2d3c', 0, 0.1, 0);
  mount.rotation.z = Math.PI * 0.25;
  grp.add(mount);

  // Camera swivel head
  const head = new THREE.Group();
  head.position.set(0.18, -0.08, 0);
  const body = box(0.2, 0.2, 0.5, mat('#eaecee'), 0, 0, 0);
  const lens = cyl(0.08, 0.08, 0.12, mat('#111116'), 0, 0, 0.26);
  lens.rotation.x = Math.PI / 2;
  head.add(body);
  head.add(lens);

  // Red recording LED
  const recLed = sphere(0.02, basic('#ff1744'), 0.07, 0.07, 0.26);
  head.add(recLed);
  grp.add(head);

  grp.animate = (t) => {
    // Smooth panning sweep
    head.rotation.y = Math.sin(t * 0.8) * 0.6;
    recLed.visible = Math.sin(t * 4) > 0;
  };

  return grp;
}

// 5. Sleek Smartphone / Tablet Device Frame
export function device3D(o = {}) {
  const { w = 1.0, h = 1.8, d = 0.06, x = 0, y = 1.2, z = 0, screenColor = '#00e5ff' } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  // Chassis
  const chassis = box(w, h, d, mat('#1a1a24', { metalness: 0.8, roughness: 0.2 }), 0, 0, 0);
  grp.add(chassis);

  // Bezel / glass screen
  const screen = plane(w * 0.92, h * 0.94, basic(screenColor, { transparent: true, opacity: 0.85 }), 0, 0, d / 2 + 0.005);
  grp.add(screen);

  grp.setScreen = (materialOrTex) => {
    screen.material = materialOrTex;
  };

  return grp;
}

// 6. 3D Stock Market / Crypto Candlestick Chart
export function candlestickChart3D(o = {}) {
  const { count = 10, w = 3.0, h = 1.5, x = 0, y = 1.0, z = 0 } = o;
  const grp = new THREE.Group();
  grp.position.set(x, y, z);

  // Grid base plane
  const grid = plane(w, 0.8, basic('#111625', { transparent: true, opacity: 0.6 }));
  grid.rotation.x = -Math.PI / 2;
  grp.add(grid);

  const candles = [];
  const barW = (w / count) * 0.65;
  for (let i = 0; i < count; i++) {
    const isGreen = (i * 7 + 3) % 11 > 4;
    const col = isGreen ? '#00e676' : '#ff1744';
    const barH = 0.3 + (i % 5) * 0.15;
    const by = barH / 2;
    const bx = -w / 2 + (i + 0.5) * (w / count);

    // Candle body
    const body = box(barW, barH, barW, basic(col), bx, by, 0);
    // Wick cylinder
    const wickH = barH * 1.5;
    const wick = cyl(0.015, 0.015, wickH, col, bx, by, 0);
    grp.add(body);
    grp.add(wick);
    candles.push({ body, wick, bx, baseH: barH, phase: i * 0.6 });
  }

  grp.animate = (t) => {
    candles.forEach((c) => {
      const fl = 1 + 0.2 * Math.sin(t * 2.5 + c.phase);
      c.body.scale.y = fl;
      c.wick.scale.y = fl;
    });
  };

  return grp;
}


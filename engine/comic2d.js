// engine/comic2d.js — High-energy 2D comic vector stickman rigs, rubber-hose limb physics, and stylized props
import { E, V, clamp, lerp, prog, ease } from './core.js';

/**
 * 1. Expressive Comic Stickman Character
 * Features:
 *  - Bold black comic ink strokes (14–22px)
 *  - Expressive comic eye shapes & mouth states: 'neutral' | 'curious' | 'excited' | 'proud' | 'shocked' | 'dizzy'
 *  - Dynamic poses: 'sitting' | 'flying' | 'crashed' | 'stand' | 'running'
 *  - Head squash/stretch and body tilt
 */
export function drawStickmanCharacter(g, opts = {}) {
  const {
    x = E.W / 2,
    y = E.H * 0.7,
    pose = 'sitting',
    expression = 'neutral',
    lookDir = 1,
    headScale = 1,
    bodyTilt = 0,
    hideRightArm = false,
    s = 1
  } = opts;

  g.save();
  g.translate(x, y);
  g.rotate(bodyTilt);
  g.scale(s, s);

  g.strokeStyle = '#000000';
  g.lineWidth = 22;
  g.lineCap = 'round';
  g.lineJoin = 'round';

  if (pose === 'sitting') {
    // Torso
    g.beginPath();
    g.moveTo(0, -165);
    g.lineTo(0, 0);
    g.stroke();

    // Sitting Legs (bent at 90 degrees)
    g.beginPath();
    g.moveTo(0, 0);
    g.lineTo(75, 10);
    g.lineTo(75, 115);
    g.moveTo(0, 0);
    g.lineTo(45, 22);
    g.lineTo(45, 120);
    g.stroke();

    // Left Arm (relaxed on lap)
    g.beginPath();
    g.moveTo(0, -130);
    g.lineTo(-55, -60);
    g.lineTo(-20, -15);
    g.stroke();

    // Right Arm (normal or hidden if stretching)
    if (!hideRightArm) {
      g.beginPath();
      g.moveTo(0, -130);
      g.lineTo(50, -65);
      g.lineTo(85, -85);
      g.stroke();
    }
  } else if (pose === 'flying') {
    // Horizontal Superman flying pose
    g.beginPath();
    g.moveTo(0, -140);
    g.lineTo(-160, -90);
    g.stroke();

    g.beginPath();
    g.moveTo(-160, -90);
    g.lineTo(-270, -145);
    g.moveTo(-160, -90);
    g.lineTo(-265, -35);
    g.stroke();

    g.beginPath();
    g.moveTo(-40, -125);
    g.lineTo(-150, -195);
    g.stroke();
  } else if (pose === 'crashed') {
    // Sprawled out impact pose
    g.beginPath();
    g.moveTo(0, -135);
    g.lineTo(-35, 0);
    g.stroke();

    g.beginPath();
    g.moveTo(-35, 0);
    g.lineTo(-125, -95);
    g.moveTo(-35, 0);
    g.lineTo(65, -110);
    g.stroke();

    g.beginPath();
    g.moveTo(-15, -90);
    g.lineTo(-110, 15);
    g.stroke();
  } else {
    // Default stand
    g.beginPath();
    g.moveTo(0, -165);
    g.lineTo(0, 0);
    g.moveTo(0, 0);
    g.lineTo(-40, 140);
    g.moveTo(0, 0);
    g.lineTo(40, 140);
    g.stroke();

    g.beginPath();
    g.moveTo(0, -130);
    g.lineTo(-50, -60);
    g.lineTo(-30, 0);
    if (!hideRightArm) {
      g.moveTo(0, -130);
      g.lineTo(50, -60);
      g.lineTo(30, 0);
    }
    g.stroke();
  }

  // Head
  g.save();
  g.translate(0, -245);
  g.scale(headScale, headScale);

  g.fillStyle = '#ffffff';
  g.strokeStyle = '#000000';
  g.lineWidth = 14;
  g.beginPath();
  g.arc(0, 0, 78, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  const eyeOffsetX = lookDir * 14;

  if (expression === 'curious') {
    g.fillStyle = '#000000';
    g.beginPath();
    g.ellipse(-18 + eyeOffsetX, -10, 11, 20, 0, 0, Math.PI * 2);
    g.ellipse(24 + eyeOffsetX, -10, 14, 24, 0, 0, Math.PI * 2);
    g.fill();
    g.beginPath();
    g.arc(10 + eyeOffsetX, 34, 14, 0, Math.PI * 2);
    g.fill();
  } else if (expression === 'excited' || expression === 'proud') {
    g.fillStyle = '#000000';
    g.beginPath();
    g.ellipse(-18 + eyeOffsetX, -12, 10, 17, 0, 0, Math.PI * 2);
    g.ellipse(22 + eyeOffsetX, -12, 10, 17, 0, 0, Math.PI * 2);
    g.fill();

    g.lineWidth = 7;
    g.beginPath();
    g.moveTo(-34 + eyeOffsetX, -36);
    g.lineTo(-6 + eyeOffsetX, -42);
    g.moveTo(8 + eyeOffsetX, -42);
    g.lineTo(36 + eyeOffsetX, -36);
    g.stroke();

    g.fillStyle = '#000000';
    g.beginPath();
    g.arc(4 + eyeOffsetX, 16, 30, 0, Math.PI);
    g.closePath();
    g.fill();
  } else if (expression === 'shocked') {
    // Huge wide comic eyes with tiny dot pupils
    g.fillStyle = '#ffffff';
    g.strokeStyle = '#000000';
    g.lineWidth = 8;
    g.beginPath();
    g.ellipse(-20 + eyeOffsetX, -12, 22, 30, 0, 0, Math.PI * 2);
    g.ellipse(24 + eyeOffsetX, -12, 22, 30, 0, 0, Math.PI * 2);
    g.fill();
    g.stroke();

    g.fillStyle = '#000000';
    g.beginPath();
    g.arc(-20 + eyeOffsetX, -12, 6, 0, Math.PI * 2);
    g.arc(24 + eyeOffsetX, -12, 6, 0, Math.PI * 2);
    g.fill();

    // Dropped jaw ellipse
    g.beginPath();
    g.ellipse(4 + eyeOffsetX, 38, 20, 26, 0, 0, Math.PI * 2);
    g.fill();
  } else if (expression === 'dizzy') {
    // X Eyes
    g.strokeStyle = '#000000';
    g.lineWidth = 8;
    [-22, 22].forEach((ex) => {
      g.beginPath();
      g.moveTo(ex - 12, -24);
      g.lineTo(ex + 12, 0);
      g.moveTo(ex + 12, -24);
      g.lineTo(ex - 12, 0);
      g.stroke();
    });

    g.beginPath();
    g.moveTo(-28, 32);
    g.quadraticCurveTo(-10, 18, 0, 32);
    g.quadraticCurveTo(10, 46, 28, 32);
    g.stroke();
  } else {
    // Neutral comic
    g.fillStyle = '#000000';
    g.beginPath();
    g.ellipse(-18 + eyeOffsetX, -10, 9, 15, 0, 0, Math.PI * 2);
    g.ellipse(22 + eyeOffsetX, -10, 9, 15, 0, 0, Math.PI * 2);
    g.fill();

    g.lineWidth = 8;
    g.beginPath();
    g.arc(4 + eyeOffsetX, 20, 18, 0.15 * Math.PI, 0.85 * Math.PI);
    g.stroke();
  }

  g.restore();
  g.restore();
}

/**
 * 2. Rubber-Hose Stretchy Arm with Procedural Wave & Pinch Physics
 */
export function drawStretchyArm(g, opts = {}) {
  const {
    startX = 225,
    startY = 1105,
    endX = 845,
    endY = 1095,
    waveAmp = 0,
    t = 0,
    holdingItem = 'drink',
    pinchedX = null,
    itemScale = 1
  } = opts;

  g.save();

  const drawPath = () => {
    g.beginPath();
    g.moveTo(startX, startY);

    if (pinchedX !== null) {
      g.quadraticCurveTo(
        (startX + pinchedX) * 0.5,
        startY + waveAmp,
        pinchedX,
        1345
      );
      g.lineTo(endX, endY);
    } else {
      const cp1x = lerp(startX, endX, 0.33);
      const cp1y = lerp(startY, endY, 0.33) - waveAmp * Math.sin(t * 18);
      const cp2x = lerp(startX, endX, 0.66);
      const cp2y = lerp(startY, endY, 0.66) + waveAmp * Math.sin(t * 18);
      g.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
    }
  };

  // Outer white highlight core
  g.strokeStyle = '#ffffff';
  g.lineWidth = 34;
  g.lineCap = 'round';
  g.lineJoin = 'round';
  drawPath();
  g.stroke();

  // Bold black comic contour
  g.strokeStyle = '#000000';
  g.lineWidth = 22;
  drawPath();
  g.stroke();

  // Hand & Item at end point
  g.save();
  g.translate(endX, endY);

  if (holdingItem === 'drink') {
    drawRedDrink(g, 12, 55, itemScale, -0.08, false);
  } else if (holdingItem === 'burger') {
    drawGiantBurger(g, 15, 45, itemScale * 0.85);
  }

  // Cartoon 4-finger hand fist
  g.fillStyle = '#ffffff';
  g.strokeStyle = '#000000';
  g.lineWidth = 10;
  g.beginPath();
  g.arc(0, 0, 26, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  g.beginPath();
  g.roundRect(8, -22, 26, 14, 7);
  g.roundRect(10, -6, 28, 14, 7);
  g.roundRect(8, 10, 24, 14, 7);
  g.fill();
  g.stroke();

  g.restore();
  g.restore();
}

/**
 * 3. Comic Red Takeout Drink with Bendy Straw
 */
export function drawRedDrink(g, x, y, scale = 1, tilt = 0, highlightGlow = false) {
  g.save();
  g.translate(x, y);
  g.rotate(tilt);
  g.scale(scale, scale);

  if (highlightGlow) {
    g.fillStyle = 'rgba(254, 240, 138, 0.35)';
    g.beginPath();
    g.arc(0, -65, 105, 0, Math.PI * 2);
    g.fill();
  }

  g.strokeStyle = '#000000';
  g.lineWidth = 10;
  g.lineJoin = 'round';
  g.lineCap = 'round';

  // Yellow bendy straw
  g.beginPath();
  g.moveTo(10, -110);
  g.lineTo(24, -168);
  g.lineTo(56, -158);
  g.strokeStyle = '#000000';
  g.lineWidth = 18;
  g.stroke();
  g.strokeStyle = '#fde047';
  g.lineWidth = 8;
  g.stroke();

  // Cup body
  g.strokeStyle = '#000000';
  g.lineWidth = 10;
  g.fillStyle = '#ef4444';
  g.beginPath();
  g.moveTo(-48, -115);
  g.lineTo(48, -115);
  g.lineTo(36, 0);
  g.lineTo(-36, 0);
  g.closePath();
  g.fill();
  g.stroke();

  // Highlight reflection streak
  g.fillStyle = '#fca5a5';
  g.beginPath();
  g.roundRect(-30, -98, 14, 80, 7);
  g.fill();

  // White lid
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.roundRect(-55, -130, 110, 22, 11);
  g.fill();
  g.stroke();

  g.restore();
}

/**
 * 4. Giant Delicious Comic Burger
 */
export function drawGiantBurger(g, x, y, scale = 1) {
  g.save();
  g.translate(x, y);
  g.scale(scale, scale);
  g.strokeStyle = '#000000';
  g.lineWidth = 12;
  g.lineJoin = 'round';

  // Top Bun
  g.fillStyle = '#d97706';
  g.beginPath();
  g.arc(0, -40, 95, Math.PI, 0, false);
  g.closePath();
  g.fill();
  g.stroke();

  // Sesame seeds
  g.fillStyle = '#fef08a';
  [-45, -15, 20, 50].forEach(sx => {
    g.beginPath();
    g.ellipse(sx, -65, 8, 4, 0.3, 0, Math.PI * 2);
    g.fill();
    g.stroke();
  });

  // Lettuce
  g.fillStyle = '#22c55e';
  g.beginPath();
  g.roundRect(-105, -28, 210, 24, 12);
  g.fill();
  g.stroke();

  // Melted Cheese & Meat Patty
  g.fillStyle = '#eab308';
  g.beginPath();
  g.roundRect(-100, -8, 200, 18, 6);
  g.fill();
  g.stroke();

  g.fillStyle = '#78350f';
  g.beginPath();
  g.roundRect(-110, 8, 220, 36, 14);
  g.fill();
  g.stroke();

  // Bottom Bun
  g.fillStyle = '#d97706';
  g.beginPath();
  g.roundRect(-115, 40, 230, 42, 16);
  g.fill();
  g.stroke();

  g.restore();
}

/**
 * 5. Giant Stomping Sneaker Shoe
 */
export function drawGiantShoe(g, x, y, scale = 1) {
  g.save();
  g.translate(x, y);
  g.scale(scale, scale);
  g.strokeStyle = '#000000';
  g.lineWidth = 14;
  g.lineJoin = 'round';

  // Leg cuff
  g.fillStyle = '#1e293b';
  g.beginPath();
  g.roundRect(-85, -420, 170, 320, 20);
  g.fill();
  g.stroke();

  // Shoe orange body
  g.fillStyle = '#f97316';
  g.beginPath();
  g.moveTo(-110, -120);
  g.lineTo(85, -120);
  g.quadraticCurveTo(230, -95, 245, -20);
  g.lineTo(-125, -20);
  g.closePath();
  g.fill();
  g.stroke();

  // White rubber sole
  g.fillStyle = '#ffffff';
  g.beginPath();
  g.roundRect(-135, -30, 390, 44, 18);
  g.fill();
  g.stroke();

  // Laces
  g.lineWidth = 10;
  g.beginPath();
  g.moveTo(-20, -100);
  g.lineTo(25, -35);
  g.moveTo(35, -95);
  g.lineTo(80, -35);
  g.stroke();

  g.restore();
}

/**
 * 6. Streetlamp Prop
 */
export function drawStreetlamp(g, x, y, scale = 1) {
  g.save();
  g.translate(x, y);
  g.scale(scale, scale);
  g.strokeStyle = '#000000';
  g.lineWidth = 16;
  g.lineJoin = 'round';

  // Pole
  g.fillStyle = '#334155';
  g.beginPath();
  g.roundRect(-24, -750, 48, 850, 14);
  g.fill();
  g.stroke();

  // Lamp head
  g.fillStyle = '#fde047';
  g.beginPath();
  g.arc(0, -770, 55, 0, Math.PI * 2);
  g.fill();
  g.stroke();

  g.restore();
}

/**
 * 7. Comic Starburst / Impact Flash
 */
export function comicBurst(g, x, y, radius = 100, spikes = 12, color = '#f97316', strokeColor = '#000000', rot = 0) {
  g.save();
  g.fillStyle = color;
  g.strokeStyle = strokeColor;
  g.lineWidth = 8;
  g.beginPath();
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? radius : radius * 0.55;
    const a = (i * Math.PI) / spikes + rot;
    const bx = x + Math.cos(a) * r;
    const by = y + Math.sin(a) * r;
    if (i === 0) g.moveTo(bx, by);
    else g.lineTo(bx, by);
  }
  g.closePath();
  g.fill();
  g.stroke();
  g.restore();
}

/**
 * 8. Comic Speed Lines
 */
export function speedLinesComic(g, t, opts = {}) {
  const { count = 12, startY = 700, spacing = 55, speed = 2000, len = 220, color = 'rgba(255,255,255,0.4)', lw = 14 } = opts;
  g.save();
  g.strokeStyle = color;
  g.lineWidth = lw;
  g.lineCap = 'round';
  for (let i = 0; i < count; i++) {
    const sy = startY + i * spacing;
    const sx = ((i * 210 + t * speed) % (E.W + 400)) - 200;
    g.beginPath();
    g.moveTo(sx, sy);
    g.lineTo(sx + len, sy);
    g.stroke();
  }
  g.restore();
}

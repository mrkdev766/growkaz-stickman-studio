// engine/themes.js — High-level Production Style Combos for GrowKaz Stickman Studio
// Combines Art Direction, Character Rig, Background Engine, Color Grade, and Sound Palette.

export const THEME_COMBOS = {
  // 1. Viral Comic & Slapstick (Alan Becker / TikTok Shorts Style)
  'comic-slapstick': {
    id: 'comic-slapstick',
    name: 'Comic Slapstick (Shorts Viral)',
    desc: 'High-energy cartoon with rubber-hose stretchy limbs, 22px bold outlines, giant comic props, and snap comedic timing.',
    aspect: '9:16',
    rig: 'elastic-comic',        // Uses /engine/comic2d.js (drawStickmanCharacter, drawStretchyArm)
    bgMode: 'vector-flat',        // Bold colorful vector rooms & outdoor street
    props: 'comic-clipart',       // Giant burgers, red takeout cups, sneakers, streetlamps
    grade: 'comic-pop',           // High saturation, bold contrast, warm punch
    sfxKit: ['pop', 'whoosh', 'stomp', 'slide', 'crash', 'slingshotSnap', 'sting'],
    safeZoneGuide: true,
    styleId: 'ember',
    defaultResolution: '1080p'
  },

  // 2. High-Impact Journalistic Documentary (Vox / Johnny Harris / Magnets Media Style)
  'vox-documentary': {
    id: 'vox-documentary',
    name: 'Vox Documentary (Journalistic)',
    desc: 'Cinematic documentary explainer with AI background plates, tailored character rigs, holographic data maps, live counters, and breaking news banners.',
    aspect: '16:9',
    rig: 'stickman-sleek',        // Uses /engine/rig2d.js (drawFigure with tailored suits/hoodies)
    bgMode: 'ai-cinematic',       // Nano Banana Pro / Imagen plates (newsroom, courthouse, boardroom)
    props: 'infographic-hud',     // worldDataMap, liveCounter, breakingNewsDesk, compareBars
    grade: 'emerald',             // Rich forest green shadows, gold key, lime rim
    sfxKit: ['cameraShutter', 'paperSlide', 'subBoom', 'whooshDeep', 'buttonClick'],
    safeZoneGuide: false,
    styleId: 'emerald',
    defaultResolution: '1080p'
  },

  // 3. Cyberpunk & Tech Thriller (IFinity / Dark Web / AI Conspiracy Style)
  'cyberpunk-thriller': {
    id: 'cyberpunk-thriller',
    name: 'Cyberpunk Thriller (Dark Tech)',
    desc: 'Midnight neon cyber world with hooded mystic/hacker characters, 3D rotating tesseracts, CRT scanlines, and encrypted terminal feeds.',
    aspect: '16:9',
    rig: 'technologist-cowl',     // Hooded cowl rig with electric cyan/magenta rim lighting
    bgMode: 'hybrid-cyber',       // AI cyberpunk city plates + Three.js 3D spatial models
    props: 'cyber-hud',           // crtScanlines, readout feeds, target reticles, 3D tesseract
    grade: 'arctic',              // Deep navy/cyan shadows, glowing magenta & cyan neon
    sfxKit: ['digitalGlitch', 'riserTension', 'subBoom', 'whooshFast'],
    safeZoneGuide: false,
    styleId: 'arctic',
    defaultResolution: '1080p'
  },

  // 4. Gritty Noir & True Crime (Awaken / Detective Investigation Style)
  'noir-mystery': {
    id: 'noir-mystery',
    name: 'Noir Mystery (Investigation)',
    desc: 'Moody detective story with tungsten desk lamps, classified case file callouts, warm dust particles, and heavy cinematic letterbox.',
    aspect: '16:9',
    rig: 'investigator-suit',     // Suit, wavy hair, gold tie, observant eye tracking
    bgMode: 'ai-cinematic',       // AI detective office with venetian blinds, mahogany, dim lamps
    props: 'noir-evidence',       // Callout annotations, case numbers, letterbox, vignette
    grade: 'retro',               // Warm sepia tungsten, deep shadow contrast, vintage grain
    sfxKit: ['paperSlide', 'cameraShutter', 'subBoom', 'riserTension'],
    safeZoneGuide: false,
    styleId: 'retro',
    defaultResolution: '1080p'
  },

  // 5. Clean Scientific Explainer (Kurzgesagt Style)
  'kurzgesagt-explainer': {
    id: 'kurzgesagt-explainer',
    name: 'Kurzgesagt Explainer (Clean Science)',
    desc: 'Lush flat geometric vector art, pastel color palettes, planetary & microscopic scales, smooth orbital cameras, and friendly typography.',
    aspect: '16:9',
    rig: 'geometric-flat',        // Minimalist colorful geometric figures
    bgMode: 'vector-gradient',    // Rich multi-stop gradient skies & planetary horizons
    props: 'scientific-diagram',  // Orbiting atom models, 3D data globes, scale meters
    grade: 'sakura',              // Soft pastel pinks, teals, warm cream glow
    sfxKit: ['pop', 'whooshFast', 'buttonClick'],
    safeZoneGuide: false,
    styleId: 'sakura',
    defaultResolution: '1080p'
  },

  // 6. Minimalist Whiteboard & Sketch (MinutePhysics / AsapSCIENCE Style)
  'whiteboard-sketch': {
    id: 'whiteboard-sketch',
    name: 'Whiteboard Sketch (Fast Doodle)',
    desc: 'Hand-drawn marker doodle aesthetic on parchment or whiteboard paper, rapid snappy gestures, lightbulb ideas, and doodle arrows.',
    aspect: '16:9',
    rig: 'line-doodle',           // Minimal line figures with marker stroke textures
    bgMode: 'paper-whiteboard',   // Textured cream paper or clean whiteboard
    props: 'hand-drawn-doodle',   // Doodle speech bubbles, hand-drawn arrows, scribbled graphs
    grade: 'retro',               // Warm monochrome ink on paper
    sfxKit: ['buttonClick', 'paperSlide', 'whooshFast'],
    safeZoneGuide: false,
    styleId: 'retro',
    defaultResolution: '1080p'
  },

  // 7. Fintech, Wealth & Crypto Markets (Coin Bureau / ColdFusion Style)
  'fintech-bull': {
    id: 'fintech-bull',
    name: 'Fintech & Wealth (Market Bull)',
    desc: 'Ultra-modern financial aesthetic with glowing emerald candlesticks, floating 3D gold coins, animated percentage gains, luxury dark slate, and executive character rig.',
    aspect: '16:9',
    rig: 'executive-smart',       // Minimalist sharp suit, holographic tablet, glowing wristwatch
    bgMode: 'ai-cinematic',       // High-rise trading floor, luxury penthouse skyline, dark glass
    props: 'finance-hud',         // Candlestick charts, ticker tape, 3D bullion, upward green arrows
    grade: 'emerald',             // Deep luxury emerald & 24k gold lighting
    sfxKit: ['cashRegister', 'cameraShutter', 'buttonClick', 'subBoom'],
    safeZoneGuide: false,
    styleId: 'emerald',
    defaultResolution: '1080p'
  },

  // 8. Anime Impact & Shonen Action (High Intensity / Manga Style)
  'anime-impact': {
    id: 'anime-impact',
    name: 'Anime Impact (Shonen Action)',
    desc: 'High-octane manga speed lines, sudden high-contrast monochrome impact frames, flaming energy auras, diagonal dramatic camera cuts, and sound effect onomatopoeia.',
    aspect: '9:16',
    rig: 'anime-shonen',          // Dynamic spiky hair stickman, combat stances, aura glow
    bgMode: 'action-speedlines',  // Radial speed lines, inverted color flashes, crater floor
    props: 'anime-effects',       // Energy auras, impact shockwaves, lightning sparks
    grade: 'ember',               // Blazing orange, stark stark black and pure white flashes
    sfxKit: ['whooshFast', 'slingshotSnap', 'crash', 'subBoom'],
    safeZoneGuide: true,
    styleId: 'ember',
    defaultResolution: '1080p'
  },

  // 9. Analog Horror & Classified Files (Mandela / SCP Foundation Style)
  'analog-horror': {
    id: 'analog-horror',
    name: 'Analog Horror (Classified Glitch)',
    desc: 'Eerie low-fi broadcast dread with CRT scanlines, tracking artifacts, silhouette entities with glowing white eyes, redacted text blocks, and CCTV REC counters.',
    aspect: '16:9',
    rig: 'shadow-entity',         // Inky silhouette, uncanny proportions, piercing white eyes
    bgMode: 'cctv-static',        // Grainy surveillance room, abandoned basement, static noise
    props: 'redacted-archive',    // Black redaction bars, caution stripes, glitch stamps, REC dot
    grade: 'retro',               // Desaturated monochrome with ominous blood red glow
    sfxKit: ['digitalGlitch', 'riserTension', 'subBoom', 'deepDrone'],
    safeZoneGuide: false,
    styleId: 'retro',
    defaultResolution: '1080p'
  },

  // 10. OverSimplified History & Strategy (Epic Chronicles Style)
  'oversimplified-history': {
    id: 'oversimplified-history',
    name: 'OverSimplified History (Epic Map)',
    desc: 'Humorous historical chronicle with antique parchment map movements, marching unit banners, funny hats (Napoleon bicorne, crowns), and humorous territorial conquest arrows.',
    aspect: '16:9',
    rig: 'historical-figure',     // Expressive stickman with historic hats, swords, flags
    bgMode: 'parchment-map',      // Aged paper texture, topographical continents, compass rose
    props: 'conquest-markers',    // Red vs Blue dashed movement arrows, battle clashing icons
    grade: 'retro',               // Warm sepia, aged parchment paper, dark ink
    sfxKit: ['paperSlide', 'pop', 'stomp', 'buttonClick', 'sting'],
    safeZoneGuide: false,
    styleId: 'retro',
    defaultResolution: '1080p'
  },

  // 11. Pixel Arcade & Retro Gaming (8-Bit / 16-Bit Boss Battle)
  'pixel-arcade': {
    id: 'pixel-arcade',
    name: 'Pixel Arcade (16-Bit Gaming)',
    desc: 'Vibrant retrowave arcade aesthetic with pixel grid floors, retro health bars, floating XP numbers (+100 XP), item inventory bubbles, and boss battle alerts.',
    aspect: '9:16',
    rig: 'pixel-hero',            // Blocky chunky stickman with pixel cape and sword
    bgMode: 'synthwave-grid',     // Glowing neon grid floor, retrowave purple sunset horizon
    props: 'arcade-gui',          // Floating hearts, boss HP bar, level-up banners, coin counters
    grade: 'arctic',              // Electric cyan, neon magenta, deep synthwave indigo
    sfxKit: ['pop', 'buttonClick', 'digitalGlitch', 'whooshFast'],
    safeZoneGuide: true,
    styleId: 'arctic',
    defaultResolution: '1080p'
  },

  // 12. Philosophical Cinema & Cosmic Wonder (Einzelgänger Style)
  'philosophical-cinema': {
    id: 'philosophical-cinema',
    name: 'Philosophical Cinema (Cosmic Wonder)',
    desc: 'Poetic, contemplative pacing with vast starry nebulas, golden hour silhouettes, meditative slow pans, floating stardust particles, and quote title cards.',
    aspect: '16:9',
    rig: 'wanderer-silhouette',   // Elegant solitary silhouette figure with coat tail breeze
    bgMode: 'ai-cinematic',       // Vast mountain ridge at twilight, swirling galaxy, ocean edge
    props: 'philosophical-quotes',// Minimalist serif typography, stardust particles, golden halo
    grade: 'ember',               // Golden twilight amber meets deep midnight indigo
    sfxKit: ['riserTension', 'subBoom', 'whooshDeep'],
    safeZoneGuide: false,
    styleId: 'ember',
    defaultResolution: '1080p'
  }
};

export const THEME_IDS = Object.keys(THEME_COMBOS);

export function getTheme(id) {
  return THEME_COMBOS[id] || THEME_COMBOS['comic-slapstick'];
}

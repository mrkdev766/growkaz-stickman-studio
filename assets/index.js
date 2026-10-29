// assets/index.js — Master unified entry point for GrowKaz Stickman Studio Asset Library
import * as MODELS from './models/models3d.js';
import * as OVERLAYS from './overlays/overlays.js';
import { CAST } from './characters/cast_presets.js';

export const BG = {
  cyberpunkCity: '/assets/bg/cyberpunk_city.jpg',
  broadcastNewsroom: '/assets/bg/broadcast_newsroom.jpg',
  serverDatacenter: '/assets/bg/server_datacenter.jpg',
  detectiveOffice: '/assets/bg/detective_office.jpg',
  cosmicVoid: '/assets/bg/cosmic_void.jpg'
};

export const SFX = {
  whooshFast: '/assets/sfx/whoosh_fast.wav',
  whooshDeep: '/assets/sfx/whoosh_deep.wav',
  subBoom: '/assets/sfx/sub_boom.wav',
  digitalGlitch: '/assets/sfx/digital_glitch.wav',
  cameraShutter: '/assets/sfx/camera_shutter.wav',
  paperSlide: '/assets/sfx/paper_slide.wav',
  buttonClick: '/assets/sfx/button_click.wav',
  riserTension: '/assets/sfx/riser_tension.wav'
};

export { MODELS, OVERLAYS, CAST };


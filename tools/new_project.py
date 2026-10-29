"""tools/new_project.py — create a project folder for one video.

  python tools/new_project.py --name my-video --voice "path/voiceover.mp3" [--script path] \
      [--theme comic-slapstick|vox-documentary|cyberpunk-thriller|noir-mystery|kurzgesagt-explainer|whiteboard-sketch|fintech-bull|anime-impact|analog-horror|oversimplified-history|pixel-arcade|philosophical-cinema] \
      [--aspect 16:9|9:16] [--resolution 720p|1080p|1440p|2160p] [--style emerald] [--fps 24] [--captions]
"""
import argparse, os, shutil, sys
sys.path.insert(0, os.path.dirname(__file__))
from common import probe_duration, save_json

THEME_DEFAULTS = {
    "comic-slapstick": {"aspect": "9:16", "style": "ember", "captions": True},
    "vox-documentary": {"aspect": "16:9", "style": "emerald", "captions": False},
    "cyberpunk-thriller": {"aspect": "16:9", "style": "arctic", "captions": False},
    "noir-mystery": {"aspect": "16:9", "style": "retro", "captions": False},
    "kurzgesagt-explainer": {"aspect": "16:9", "style": "sakura", "captions": False},
    "whiteboard-sketch": {"aspect": "16:9", "style": "retro", "captions": False},
    "fintech-bull": {"aspect": "16:9", "style": "emerald", "captions": False},
    "anime-impact": {"aspect": "9:16", "style": "ember", "captions": True},
    "analog-horror": {"aspect": "16:9", "style": "retro", "captions": False},
    "oversimplified-history": {"aspect": "16:9", "style": "retro", "captions": False},
    "pixel-arcade": {"aspect": "9:16", "style": "arctic", "captions": True},
    "philosophical-cinema": {"aspect": "16:9", "style": "ember", "captions": False},
}

ap = argparse.ArgumentParser()
ap.add_argument("--name", required=True)
ap.add_argument("--voice", required=True)
ap.add_argument("--script")
ap.add_argument("--theme", choices=list(THEME_DEFAULTS.keys()), default=None, help="High-level production style combo")
ap.add_argument("--aspect", default=None, choices=["16:9", "9:16"])
ap.add_argument("--resolution", default="1080p", choices=["720p", "1080p", "1440p", "2160p", "4k"])
ap.add_argument("--style", default=None)
ap.add_argument("--fps", type=int, default=24)
ap.add_argument("--title", default="")
ap.add_argument("--captions", action="store_true", help="burn word-by-word captions (recommended for 9:16)")
a = ap.parse_args()

# Apply theme defaults if specified
theme_cfg = THEME_DEFAULTS.get(a.theme, {}) if a.theme else {}
aspect = a.aspect or theme_cfg.get("aspect", "16:9")
style = a.style or theme_cfg.get("style", "emerald")
captions = a.captions or theme_cfg.get("captions", False)

root = os.path.join("projects", a.name)
for d in ["input", "timeline", "story", "scenes/sets", "scenes/shots", "build", "out", "audio"]:
    os.makedirs(os.path.join(root, d), exist_ok=True)
voice_dst = os.path.join("input", "voiceover" + os.path.splitext(a.voice)[1].lower())
shutil.copy2(a.voice, os.path.join(root, voice_dst))
script_dst = None
if a.script:
    script_dst = os.path.join("input", "script" + os.path.splitext(a.script)[1].lower())
    shutil.copy2(a.script, os.path.join(root, script_dst))
dur = probe_duration(os.path.join(root, voice_dst))
cfg = {
    "title": a.title or a.name,
    "theme": a.theme or "vox-documentary",
    "aspect": aspect,
    "resolution": a.resolution,
    "fps": a.fps,
    "style": style,
    "voiceover": voice_dst.replace("\\", "/"),
    "script": script_dst.replace("\\", "/") if script_dst else None,
    "duration": round(dur, 3),
    "captions": bool(captions),
    "bars": None,
    "fadeIn": 0.5,
    "fadeOut": 0.8,
    "music": {"enabled": True, "gainDb": -17},
    "sfx": {"enabled": True, "gainDb": -6},
    "loudness": -14
}
save_json(os.path.join(root, "config.json"), cfg)
print(f"created {root}  (theme: {cfg['theme']}, {aspect} {a.resolution} @ {a.fps}fps, style {style}, duration {dur:.1f}s)")

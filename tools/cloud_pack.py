#!/usr/bin/env python3
"""
cloud_pack.py — Package projects and generate 1-click cloud rendering workflows
for GitHub Actions (100% free matrix parallel), Google Colab, and Kaggle.
"""
import os
import sys
import json
import shutil
import zipfile
import argparse
from pathlib import Path

STUDIO_ROOT = Path(__file__).resolve().parent.parent

def build_github_workflow(project_name, num_chunks=4, resolution="720p", fps=24):
    return f"""name: Cloud Render - {project_name}

on:
  workflow_dispatch:
    inputs:
      chunks:
        description: 'Number of parallel runners'
        required: false
        default: '{num_chunks}'

jobs:
  inspect:
    runs-on: ubuntu-latest
    outputs:
      matrix: ${{{{ steps.set-matrix.outputs.matrix }}}}
      duration: ${{{{ steps.set-matrix.outputs.duration }}}}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Calculate chunk intervals
        id: set-matrix
        run: |
          npm install --save-dev playwright
          node -e '
            const fs = require("fs");
            const cfg = JSON.parse(fs.readFileSync("projects/{project_name}/config.json", "utf8"));
            const dur = cfg.duration || 60;
            const N = parseInt("${{{{ github.event.inputs.chunks || {num_chunks} }}}}") || {num_chunks};
            const chunkDur = dur / N;
            const matrix = [];
            for (let i = 0; i < N; i++) {{
              const from = (i * chunkDur).toFixed(2);
              const to = ((i + 1) * chunkDur).toFixed(2);
              matrix.push({{ chunk: i, from, to }});
            }}
            console.log("duration=" + dur);
            fs.appendFileSync(process.env.GITHUB_OUTPUT, "duration=" + dur + "\\n");
            fs.appendFileSync(process.env.GITHUB_OUTPUT, "matrix=" + JSON.stringify(matrix) + "\\n");
          '

  render-chunk:
    needs: inspect
    runs-on: ubuntu-latest
    strategy:
      matrix:
        chunk_info: ${{{{ fromJson(needs.inspect.outputs.matrix) }}}}
      fail-fast: false
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Install dependencies & Playwright Chromium
        run: |
          npm ci || npm install
          npx playwright install --with-deps chromium
          sudo apt-get update && sudo apt-get install -y ffmpeg
      - name: Render Video Chunk ${{{{ matrix.chunk_info.chunk }}}}
        run: |
          mkdir -p projects/{project_name}/build/chunks
          node render.mjs --project projects/{project_name} \\
            --from ${{{{ matrix.chunk_info.from }}}} \\
            --to ${{{{ matrix.chunk_info.to }}}} \\
            --format jpeg \\
            --gl swiftshader \\
            --workers 4 \\
            --out projects/{project_name}/build/chunks/chunk_${{{{ matrix.chunk_info.chunk }}}}.mp4
      - name: Upload Chunk Artifact
        uses: actions/upload-artifact@v4
        with:
          name: chunk-${{{{ matrix.chunk_info.chunk }}}}
          path: projects/{project_name}/build/chunks/chunk_${{{{ matrix.chunk_info.chunk }}}}.mp4
          retention-days: 1

  assemble:
    needs: [inspect, render-chunk]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - name: Install ffmpeg
        run: sudo apt-get update && sudo apt-get install -y ffmpeg
      - name: Download all chunks
        uses: actions/download-artifact@v4
        with:
          path: downloaded_chunks
      - name: Concat Chunks and Mux Final Soundtrack
        run: |
          mkdir -p dist
          find downloaded_chunks -name "*.mp4" | sort -V > chunks_found.txt
          echo "Found chunks:"
          cat chunks_found.txt
          sed 's/^/file \\x27/' chunks_found.txt | sed 's/$/\\x27/' > concat_list.txt
          ffmpeg -f concat -safe 0 -i concat_list.txt -c copy dist/{project_name}_silent.mp4
          
          # Check for audio file in project
          AUDIO_SRC=$(find projects/{project_name}/audio -name "*.wav" -o -name "*.mp3" | head -n 1)
          if [ -n "$AUDIO_SRC" ]; then
            echo "Muxing audio from $AUDIO_SRC"
            ffmpeg -y -i dist/{project_name}_silent.mp4 -i "$AUDIO_SRC" -c:v copy -c:a aac -b:a 192k -shortest dist/{project_name}_finished.mp4
          else
            cp dist/{project_name}_silent.mp4 dist/{project_name}_finished.mp4
          fi
      - name: Publish Finished Video
        uses: actions/upload-artifact@v4
        with:
          name: {project_name}-final-video
          path: dist/{project_name}_finished.mp4
          retention-days: 14
"""

def build_colab_notebook(project_name):
    nb = {
        "nbformat": 4,
        "nbformat_minor": 0,
        "metadata": {
            "accelerator": "GPU",
            "colab": {"name": f"Render_{project_name}_GPU.ipynb", "provenance": []},
            "language_info": {"name": "python"}
        },
        "cells": [
            {
                "cell_type": "markdown",
                "metadata": {},
                "source": [
                    f"# 🚀 Cloud Video Render: **{project_name}**\n",
                    "### Accelerated GPU Rendering using Free Google Colab / Kaggle T4 GPU\n",
                    "This notebook renders the GrowKaz Stickman Studio project at hardware-accelerated speeds (30–60+ fps).\n",
                    "Ensure runtime is set to **GPU** (`Runtime > Change runtime type > T4 GPU`)."
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# 1. Setup Node.js, FFmpeg, and Playwright Chromium with GPU drivers\n",
                    "!apt-get update -qq && apt-get install -y -qq ffmpeg xvfb mesa-utils\n",
                    "!curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs\n",
                    "!npm install playwright\n",
                    "!npx playwright install --with-deps chromium"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    "# 2. Upload and extract project cloud bundle\n",
                    "from google.colab import files\n",
                    "import os, zipfile, glob\n",
                    "\n",
                    "zips = glob.glob('*.zip')\n",
                    "if not os.path.exists('render.mjs') and not zips:\n",
                    "    print('Please upload your project cloud bundle zip:')\n",
                    "    uploaded = files.upload()\n",
                    "    zips = [f for f in uploaded.keys() if f.endswith('.zip')]\n",
                    "\n",
                    "for fn in zips:\n",
                    "    with zipfile.ZipFile(fn, 'r') as zip_ref:\n",
                    "        zip_ref.extractall('.')\n",
                    "    print(f'Extracted {fn} successfully!')\n",
                    "if os.path.exists('render.mjs'):\n",
                    "    print('✅ render.mjs and project ready!')\n",
                    "else:\n",
                    "    print('⚠️ render.mjs not found yet. Please upload the .zip file.')"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    f"# 3. Run High-Speed Hardware Accelerated GPU Render\n",
                    f"!xvfb-run --auto-servernum --server-args='-screen 0 1920x1080x24' node render.mjs \\\n",
                    f"    --project projects/{project_name} \\\n",
                    f"    --format jpeg \\\n",
                    f"    --gl gpu \\\n",
                    f"    --workers 4 \\\n",
                    f"    --out build/{project_name}_silent.mp4"
                ]
            },
            {
                "cell_type": "code",
                "execution_count": None,
                "metadata": {},
                "outputs": [],
                "source": [
                    f"# 4. Audio Mux & Download Final MP4\n",
                    f"import glob, subprocess\n",
                    f"audio_files = glob.glob('projects/{project_name}/audio/*.wav') + glob.glob('projects/{project_name}/audio/*.mp3')\n",
                    f"out_file = '{project_name}_finished.mp4'\n",
                    f"if audio_files:\n",
                    f"    cmd = f'ffmpeg -y -i build/{project_name}_silent.mp4 -i \"{{audio_files[0]}}\" -c:v copy -c:a aac -b:a 192k -shortest \"{{out_file}}\"'\n",
                    f"    subprocess.run(cmd, shell=True, check=True)\n",
                    f"else:\n",
                    f"    subprocess.run(f'cp build/{project_name}_silent.mp4 \"{{out_file}}\"', shell=True, check=True)\n",
                    f"\n",
                    f"print(f'✅ Video successfully rendered: {{out_file}}')\n",
                    f"files.download(out_file)"
                ]
            }
        ]
    }
    return json.dumps(nb, indent=2)

def package_bundle(project_path, out_zip):
    project_path = Path(project_path).resolve()
    project_name = project_path.name
    print(f"📦 Packaging project '{project_name}' into {out_zip}...")

    Path(out_zip).parent.mkdir(parents=True, exist_ok=True)
    temp_zip = Path(out_zip).with_suffix('.tmp.zip')
    if temp_zip.exists():
        temp_zip.unlink()

    skip_dirs = {'build', 'out', 'cloud', '.git', '__pycache__', 'node_modules'}

    with zipfile.ZipFile(temp_zip, 'w', zipfile.ZIP_DEFLATED) as z:
        # Include studio root essentials
        for f in ['package.json', 'player.html', 'render.mjs']:
            fp = STUDIO_ROOT / f
            if fp.exists():
                z.write(fp, arcname=f)

        # Include engine/
        engine_dir = STUDIO_ROOT / 'engine'
        for root, dirs, files in os.walk(engine_dir):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for file in files:
                fp = Path(root) / file
                rel = fp.relative_to(STUDIO_ROOT)
                z.write(fp, arcname=str(rel))

        # Include tools/
        tools_dir = STUDIO_ROOT / 'tools'
        for root, dirs, files in os.walk(tools_dir):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for file in files:
                fp = Path(root) / file
                rel = fp.relative_to(STUDIO_ROOT)
                z.write(fp, arcname=str(rel))

        # Include assets/ library
        assets_dir = STUDIO_ROOT / 'assets'
        if assets_dir.exists():
            for root, dirs, files in os.walk(assets_dir):
                dirs[:] = [d for d in dirs if d not in skip_dirs]
                for file in files:
                    fp = Path(root) / file
                    rel = fp.relative_to(STUDIO_ROOT)
                    z.write(fp, arcname=str(rel))

        # Include project dir (excluding build, out, and cloud)
        for root, dirs, files in os.walk(project_path):
            dirs[:] = [d for d in dirs if d not in skip_dirs]
            for file in files:
                fp = Path(root) / file
                rel = f"projects/{project_name}/{fp.relative_to(project_path)}"
                z.write(fp, arcname=rel)

    shutil.move(temp_zip, out_zip)
    print(f"✅ Created cloud bundle: {out_zip} ({os.path.getsize(out_zip) / (1024*1024):.2f} MB)")

def main():
    parser = argparse.ArgumentParser(description="Package project for zero-cost cloud rendering")
    parser.add_argument("--project", required=True, help="Path to project directory (e.g. projects/face-swap-dilemma)")
    parser.add_argument("--zip", action="store_true", help="Generate self-contained cloud bundle zip")
    parser.add_argument("--workflow", action="store_true", help="Generate GitHub Actions workflow file")
    parser.add_argument("--colab", action="store_true", help="Generate Google Colab notebook")
    parser.add_argument("--all", action="store_true", help="Generate zip, workflow, and notebook")
    args = parser.parse_args()

    project_dir = Path(args.project).resolve()
    if not project_dir.exists():
        print(f"Error: Project directory not found: {project_dir}")
        sys.exit(1)

    project_name = project_dir.name
    cloud_dir = project_dir / "cloud"
    cloud_dir.mkdir(exist_ok=True)

    if args.workflow or args.all or not (args.zip or args.colab):
        wf_content = build_github_workflow(project_name)
        wf_path = cloud_dir / "github_workflow.yml"
        wf_path.write_text(wf_content)
        print(f"📄 Created GitHub Actions workflow: {wf_path}")

    if args.colab or args.all or not (args.zip or args.workflow):
        colab_content = build_colab_notebook(project_name)
        colab_path = cloud_dir / f"render_{project_name}_colab.ipynb"
        colab_path.write_text(colab_content)
        print(f"📓 Created Google Colab notebook: {colab_path}")

    if args.zip or args.all:
        zip_path = cloud_dir / f"{project_name}_cloud_bundle.zip"
        package_bundle(project_dir, zip_path)

if __name__ == "__main__":
    main()

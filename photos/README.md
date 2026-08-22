# Photo originals

Full-size originals live here. They are the masters — the site never serves them
directly. `tools/optimize-photos.py` reads them and writes the resized, compressed
`.jpg` + `.webp` pairs into `public/assets/img/`, which is what the pages load.

Upload straight from a phone; the optimizer handles EXIF rotation and resizing.
Any filename is fine — files are matched to their slot when they are processed.

    pip install pillow
    python3 tools/optimize-photos.py
    node build.js

Keeping the originals here means a photo can be re-cropped or re-exported at a
different size later without having to find the source again.

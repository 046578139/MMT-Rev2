#!/usr/bin/env python3
"""
Turn full-size photos into the optimized pairs the site uses.

Drop originals (straight off a phone is fine) into photos/ named after the slot
they fill, then run:

    pip install pillow
    python3 tools/optimize-photos.py

Each photos/<slot>.jpg becomes public/assets/img/<slot>.jpg and .webp, resized to
the width that slot is actually displayed at and compressed to suit. The site's
<picture> tags serve the webp and fall back to the jpg.

Originals stay in photos/ and are not published — that folder is git-ignored, so
keep the masters somewhere safe as well.

Add a new slot by adding a line to SLOTS, then reference it from build.js with
picture('<slot>', 'alt text', {...}).
"""

import os
import sys

try:
    from PIL import Image, ImageOps
except ImportError:
    sys.exit("Pillow is required:  pip install pillow")

SRC = "photos"
OUT = os.path.join("public", "assets", "img")

# slot -> (max width in px, jpeg/webp quality)
#
# Widths are the largest the slot is ever displayed at, doubled where the image
# is small on screen so it stays sharp on retina displays. The hero sits at 34%
# opacity behind a dark scrim, so it takes heavy compression without showing it.
SLOTS = {
    "hero-range":    (1600, 60),   # home hero background
    "range-lesson":  (1000, 82),   # live-fire instruction, shown as a figure
    "classroom":     (1400, 80),   # classroom session
    "shop-interior": (1400, 80),   # counter and branded sign
    "gun-wall":      (1100, 80),   # rack of long guns
    "trooper":       (700,  82),   # instructor portrait
    "deployment":    (900,  82),   # instructor portrait
    "checklist":     (900,  85),   # wear & carry checklist graphic
    "lawshield":     (520,  85),   # partner badge
}

EXTS = (".jpg", ".jpeg", ".png", ".webp", ".heic", ".HEIC")


def main():
    if not os.path.isdir(SRC):
        sys.exit(f"No {SRC}/ folder. Create it and drop your photos in, named e.g. "
                 f"range-lesson.jpg (slots: {', '.join(sorted(SLOTS))}).")

    os.makedirs(OUT, exist_ok=True)
    done, skipped = 0, []

    for name in sorted(os.listdir(SRC)):
        stem, ext = os.path.splitext(name)
        if ext not in EXTS:
            continue
        if stem not in SLOTS:
            skipped.append(name)
            continue

        width, quality = SLOTS[stem]
        path = os.path.join(SRC, name)

        with Image.open(path) as im:
            # Phone photos carry EXIF rotation; bake it in or they come out sideways.
            im = ImageOps.exif_transpose(im)
            im = im.convert("RGB")
            if im.width > width:
                im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)

            jpg = os.path.join(OUT, f"{stem}.jpg")
            webp = os.path.join(OUT, f"{stem}.webp")
            im.save(jpg, quality=quality, optimize=True, progressive=True)
            im.save(webp, quality=quality, method=6)

        print(f"  {stem:14s} {im.width}x{im.height}  "
              f"jpg {os.path.getsize(jpg)//1024:>4d} KB   "
              f"webp {os.path.getsize(webp)//1024:>4d} KB")
        done += 1

    print(f"\n{done} photo(s) written to {OUT}/")
    if skipped:
        print(f"Ignored (name is not a known slot): {', '.join(skipped)}")
        print(f"Known slots: {', '.join(sorted(SLOTS))}")
    if done:
        print("Now run:  node build.js")


if __name__ == "__main__":
    main()

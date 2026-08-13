#!/usr/bin/env python3
"""Bofa skin: saggy two-lobe cartoon balls with a Time Cop mouth."""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "themes" / "bofa"
SIZE = 640
BG = (18, 14, 12)
OUTLINE = (8, 5, 5)
MID = (220, 110, 104)
DARK = (156, 52, 54)
CREASE = (112, 36, 40)
MOUTH = (20, 8, 10)
GUM = (118, 34, 38)
TOOTH = (236, 214, 118)
TOOTH_EDGE = (90, 64, 28)
HAIR = (32, 16, 12)

# Two round bags. Right hangs lower. Deep saddle so it cannot read as one fruit.
LEFT = (228, 350, 168, 128)
RIGHT = (418, 500, 162, 122)


def d_ell(x: float, y: float, cx: float, cy: float, rx: float, ry: float) -> float:
    return ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2


def inside(x: float, y: float) -> bool:
    return d_ell(x, y, *LEFT) <= 1.0 or d_ell(x, y, *RIGHT) <= 1.0


def cel_body() -> Image.Image:
    img = Image.new("RGB", (SIZE, SIZE), BG)
    px = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            dl = d_ell(x, y, *LEFT)
            dr = d_ell(x, y, *RIGHT)
            if dl > 1.0 and dr > 1.0:
                continue
            d = min(dl, dr)
            cx, cy, rx, ry = LEFT if dl < dr else RIGHT
            ly = (y - cy) / ry
            underside = ly > 0.28
            saddle = abs(x - 330) < 28 and 300 < y < 540
            if d > 0.86 or underside or saddle:
                px[x, y] = DARK
            else:
                px[x, y] = MID
    return img


def outline(img: Image.Image) -> Image.Image:
    mask = Image.new("L", (SIZE, SIZE), 0)
    m = mask.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if inside(x, y):
                m[x, y] = 255
    grow = mask.filter(ImageFilter.MaxFilter(13))
    shrink = mask.filter(ImageFilter.MinFilter(5))
    gp, sp, ip = grow.load(), shrink.load(), img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if gp[x, y] and not sp[x, y]:
                ip[x, y] = OUTLINE
    return img


def details(draw: ImageDraw.ImageDraw, rng: random.Random) -> None:
    # cleft
    draw.line([(318, 250), (330, 330), (312, 410), (338, 500), (322, 560)], fill=CREASE, width=9, joint="curve")
    draw.arc((90, 280, 370, 540), 50, 150, fill=CREASE, width=6)
    draw.arc((280, 400, 590, 640), 40, 160, fill=CREASE, width=6)
    draw.arc((120, 210, 350, 400), 200, 330, fill=CREASE, width=5)
    draw.arc((320, 340, 560, 530), 200, 340, fill=CREASE, width=5)

    # Time Cop mouth across the sag
    box = (248, 470, 430, 600)
    draw.ellipse(box, fill=MOUTH, outline=OUTLINE, width=9)
    draw.arc((256, 476, 422, 530), 200, 340, fill=GUM, width=14)
    draw.arc((262, 536, 416, 594), 20, 160, fill=GUM, width=12)
    top = [
        (262, 492, 288, 532, 3),
        (290, 486, 316, 538, -4),
        (318, 482, 344, 540, 5),
        (346, 486, 372, 536, -3),
        (374, 492, 398, 528, 4),
    ]
    bot = [
        (268, 586, 292, 550, -3),
        (294, 590, 320, 546, 5),
        (322, 592, 348, 544, -4),
        (350, 588, 376, 548, 3),
        (378, 582, 402, 554, -3),
    ]
    for x0, y0, x1, y1, lean in top:
        draw.polygon(
            [(x0 + lean, y0), (x1 + lean, y0), (x1, y1), (x0, y1 - 6)],
            fill=TOOTH,
            outline=TOOTH_EDGE,
        )
    for x0, y0, x1, y1, lean in bot:
        draw.polygon(
            [(x0, y1), (x1, y1), (x1 + lean, y0), (x0 + lean, y0)],
            fill=TOOTH,
            outline=TOOTH_EDGE,
        )

    # curly pubes from the top of each bag
    roots = [
        (180, 230), (210, 214), (248, 208), (280, 218),
        (360, 300), (400, 340), (440, 360), (470, 390),
        (160, 260), (490, 420),
    ]
    for x, y in roots:
        if not inside(x, y):
            continue
        ang = rng.uniform(-2.7, -0.4)
        pts = [(x, y)]
        px, py = x, y
        for _ in range(6):
            ang += rng.uniform(-0.7, 0.7)
            px += math.cos(ang) * 5.5
            py += math.sin(ang) * 5.5
            pts.append((px, py))
        draw.line(pts, fill=HAIR, width=5, joint="curve")


def render() -> None:
    rng = random.Random(4)
    OUT.mkdir(parents=True, exist_ok=True)
    img = cel_body()
    img = outline(img)
    details(ImageDraw.Draw(img), rng)
    bust = img.resize((640, 640), Image.Resampling.LANCZOS)
    bust.save(OUT / "bust.jpg", "JPEG", quality=92, optimize=True)
    mark = img.crop((20, 150, 620, 640)).resize((256, 256), Image.Resampling.LANCZOS)
    mark.save(OUT / "mark.jpg", "JPEG", quality=92, optimize=True)
    print("wrote", OUT / "bust.jpg", OUT / "mark.jpg")


if __name__ == "__main__":
    render()

#!/usr/bin/env python3
"""Draw the Bofa skin: a cartoon pair of very hairy balls. No person."""
from __future__ import annotations

import math
import random
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "themes" / "bofa"
SIZE = 640
BG = (16, 12, 9)
SKIN = (201, 148, 108)
SKIN_LIT = (232, 188, 148)
SKIN_DARK = (118, 72, 44)
SEAM = (86, 50, 32)
OUTLINE = (10, 7, 5)
HAIR_COLORS = [
    (12, 8, 5),
    (28, 18, 11),
    (46, 30, 18),
    (22, 14, 9),
    (8, 6, 4),
    (58, 38, 22),
]


def ball(cx: float, cy: float, rx: float, ry: float) -> tuple[float, float, float, float]:
    return cx, cy, rx, ry


LEFT = ball(248, 332, 168, 186)
RIGHT = ball(412, 348, 160, 178)


def inside_pair(x: float, y: float) -> bool:
    for cx, cy, rx, ry in (LEFT, RIGHT):
        dx = (x - cx) / rx
        dy = (y - cy) / ry
        if dx * dx + dy * dy <= 1:
            return True
    return False


def nearest_ball(x: float, y: float):
    best = None
    best_d = 9e9
    for b in (LEFT, RIGHT):
        cx, cy, rx, ry = b
        d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
        if d < best_d:
            best_d = d
            best = b
    return best, best_d


def shade_pair() -> Image.Image:
    img = Image.new("RGB", (SIZE, SIZE), BG)
    px = img.load()
    light = (210, 160)
    for y in range(SIZE):
        for x in range(SIZE):
            if not inside_pair(x, y):
                continue
            (cx, cy, rx, ry), d = nearest_ball(x, y)
            nx = (x - cx) / rx
            ny = (y - cy) / ry
            lx = (light[0] - cx) / rx
            ly = (light[1] - cy) / ry
            ln = math.hypot(lx, ly) or 1
            lx, ly = lx / ln, ly / ln
            lambert = max(0.0, nx * lx + ny * ly)
            edge = min(1.0, d ** 0.5)
            t = 0.22 + 0.55 * lambert + 0.23 * (1 - edge)
            # cleft between the two
            mid = 1 - abs(x - 330) / 58
            if 0.15 < mid and abs(y - 348) < 170:
                t *= 0.62 + 0.38 * (1 - mid)
            r = int(SKIN_DARK[0] + (SKIN_LIT[0] - SKIN_DARK[0]) * t)
            g = int(SKIN_DARK[1] + (SKIN_LIT[1] - SKIN_DARK[1]) * t)
            b = int(SKIN_DARK[2] + (SKIN_LIT[2] - SKIN_DARK[2]) * t)
            px[x, y] = (r, g, b)
    return img


def outline_pair(img: Image.Image) -> None:
    draw = ImageDraw.Draw(img)
    mask = Image.new("L", (SIZE, SIZE), 0)
    m = mask.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if inside_pair(x, y):
                m[x, y] = 255
    ring = Image.new("L", (SIZE, SIZE), 0)
    grow = mask.filter(ImageFilter.MaxFilter(9))
    shrink = mask.filter(ImageFilter.MinFilter(5))
    rp = ring.load()
    gp = grow.load()
    sp = shrink.load()
    ip = img.load()
    for y in range(SIZE):
        for x in range(SIZE):
            if gp[x, y] and not sp[x, y]:
                ip[x, y] = OUTLINE
                rp[x, y] = 255
    # inner seam
    draw.line((328, 220, 318, 455), fill=SEAM, width=8)
    draw.line((332, 230, 342, 445), fill=(70, 40, 26), width=3)


def hair_from(x: float, y: float, rng: random.Random):
    _, d = nearest_ball(x, y)
    (cx, cy, rx, ry) = nearest_ball(x, y)[0]
    nx = (x - cx) / rx
    ny = (y - cy) / ry
    ang = math.atan2(ny, nx)
    # bias down and out
    ang += rng.uniform(-0.55, 0.55) + 0.35 * math.sin(ang + 1.2)
    length = rng.uniform(22, 72)
    if ny < -0.15:
        length *= 0.8
    else:
        length *= 1.15
    if d < 0.55:
        length *= 0.5
    return ang, length


def draw_hair(img: Image.Image, rng: random.Random) -> None:
    draw = ImageDraw.Draw(img)
    points = []
    for _ in range(6200):
        x = rng.uniform(70, 570)
        y = rng.uniform(110, 580)
        if not inside_pair(x, y):
            # allow a little outside so roots sit on the rim
            if not inside_pair(x, y - 6) and not inside_pair(x + 4, y + 4):
                continue
        points.append((x, y))
    # extra rim follicles
    for _ in range(2400):
        t = rng.random() * math.tau
        b = LEFT if rng.random() < 0.52 else RIGHT
        cx, cy, rx, ry = b
        x = cx + math.cos(t) * rx * rng.uniform(0.92, 1.02)
        y = cy + math.sin(t) * ry * rng.uniform(0.92, 1.02)
        points.append((x, y))

    for x, y in points:
        ang, length = hair_from(x, y, rng)
        color = rng.choice(HAIR_COLORS)
        width = rng.choice((1, 1, 1, 2, 2, 3))
        pts = [(x, y)]
        px, py = x, y
        a = ang
        steps = rng.randint(5, 9)
        for i in range(steps):
            a += rng.uniform(-0.7, 0.7)
            # curls droop
            a = 0.82 * a + 0.18 * (math.pi / 2)
            step = length / steps
            px += math.cos(a) * step
            py += math.sin(a) * step
            pts.append((px, py))
        draw.line(pts, fill=color, width=width, joint="curve")


def render() -> None:
    rng = random.Random(7)
    OUT.mkdir(parents=True, exist_ok=True)
    img = shade_pair()
    outline_pair(img)
    draw_hair(img, rng)
    img = img.filter(ImageFilter.SMOOTH)
    bust = img.resize((640, 640), Image.Resampling.LANCZOS)
    bust.save(OUT / "bust.jpg", "JPEG", quality=90, optimize=True)
    mark = img.crop((90, 120, 550, 580)).resize((256, 256), Image.Resampling.LANCZOS)
    mark.save(OUT / "mark.jpg", "JPEG", quality=90, optimize=True)
    print("wrote", OUT / "bust.jpg", OUT / "mark.jpg")


if __name__ == "__main__":
    render()

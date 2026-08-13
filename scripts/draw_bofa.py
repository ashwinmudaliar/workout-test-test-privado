#!/usr/bin/env python3
"""Bofa skin: two Rick-and-Morty-style Time Cops. Fan drawing, not a still."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "themes" / "bofa"
SIZE = 640
BG = (16, 12, 11)
INK = (14, 8, 8)
SKIN = (214, 92, 86)
SKIN_DARK = (156, 52, 50)
SKIN_LIT = (232, 132, 118)
ROBE = (228, 214, 176)
ROBE_DARK = (186, 168, 128)
SATCHEL = (122, 74, 42)
SATCHEL_DARK = (86, 50, 28)
MOUTH = (28, 10, 12)
TOOTH = (240, 216, 120)
TOOTH_EDGE = (120, 84, 36)
HAIR = (40, 18, 14)
VEIN = (168, 58, 56)


def outlined_ellipse(draw: ImageDraw.ImageDraw, box, fill, width=7):
    x0, y0, x1, y1 = box
    draw.ellipse((x0 - width, y0 - width, x1 + width, y1 + width), fill=INK)
    draw.ellipse(box, fill=fill)


def outlined_polygon(draw: ImageDraw.ImageDraw, pts, fill, width=6):
    draw.line(pts + [pts[0]], fill=INK, width=width, joint="curve")
    draw.polygon(pts, fill=fill)


def tooth_ring(draw: ImageDraw.ImageDraw, cx, cy, rx, ry, n=14, inward=22):
    for i in range(n):
        a0 = (i - 0.28) / n * math.tau
        a1 = (i + 0.28) / n * math.tau
        am = i / n * math.tau
        jitter = 0.7 + (i * 37 % 5) * 0.08
        p0 = (cx + math.cos(a0) * rx, cy + math.sin(a0) * ry)
        p1 = (cx + math.cos(a1) * rx, cy + math.sin(a1) * ry)
        p2 = (
            cx + math.cos(am) * (rx - inward * jitter),
            cy + math.sin(am) * (ry - inward * jitter),
        )
        draw.polygon([p0, p1, p2], fill=TOOTH, outline=TOOTH_EDGE)


def arm(draw: ImageDraw.ImageDraw, pts, hand, s):
    draw.line(pts, fill=INK, width=int(15 * s), joint="curve")
    draw.line(pts, fill=SKIN, width=int(9 * s), joint="curve")
    hx, hy = hand
    for dx, dy in ((-7, 4), (0, 8), (7, 3), (10, -2)):
        outlined_ellipse(
            draw,
            (hx + dx * s - 5 * s, hy + dy * s - 4 * s, hx + dx * s + 5 * s, hy + dy * s + 4 * s),
            SKIN,
            width=2,
        )


def time_cop(draw: ImageDraw.ImageDraw, cx: float, cy: float, s: float, face: int) -> None:
    # tattered robe hanging under the head
    robe = [
        (cx - 78 * s, cy + 62 * s),
        (cx + 78 * s, cy + 62 * s),
        (cx + 108 * s, cy + 210 * s),
        (cx + 62 * s, cy + 188 * s),
        (cx + 28 * s, cy + 224 * s),
        (cx - 8 * s, cy + 192 * s),
        (cx - 48 * s, cy + 226 * s),
        (cx - 88 * s, cy + 186 * s),
        (cx - 112 * s, cy + 216 * s),
    ]
    outlined_polygon(draw, robe, ROBE, width=6)
    draw.polygon(
        [
            (cx - 20 * s, cy + 80 * s),
            (cx + 70 * s, cy + 90 * s),
            (cx + 90 * s, cy + 200 * s),
            (cx + 10 * s, cy + 170 * s),
        ],
        fill=ROBE_DARK,
    )

    # satchel
    bag = [
        (cx + 18 * s, cy + 118 * s),
        (cx + 78 * s, cy + 112 * s),
        (cx + 84 * s, cy + 168 * s),
        (cx + 22 * s, cy + 174 * s),
    ]
    outlined_polygon(draw, bag, SATCHEL, width=4)
    draw.line(
        [(cx + 18 * s, cy + 70 * s), (cx + 48 * s, cy + 118 * s)],
        fill=INK,
        width=4,
    )
    draw.ellipse(
        (cx + 40 * s, cy + 128 * s, cx + 62 * s, cy + 150 * s),
        fill=SATCHEL_DARK,
        outline=INK,
        width=2,
    )

    # thin arms
    if face == 0:
        arm(
            draw,
            [(cx - 70 * s, cy + 40 * s), (cx - 130 * s, cy + 90 * s), (cx - 150 * s, cy + 150 * s)],
            (cx - 152 * s, cy + 156 * s),
            s,
        )
        arm(
            draw,
            [(cx + 72 * s, cy + 48 * s), (cx + 120 * s, cy + 110 * s), (cx + 96 * s, cy + 150 * s)],
            (cx + 94 * s, cy + 154 * s),
            s,
        )
    else:
        arm(
            draw,
            [(cx + 74 * s, cy + 38 * s), (cx + 140 * s, cy + 70 * s), (cx + 158 * s, cy + 140 * s)],
            (cx + 160 * s, cy + 146 * s),
            s,
        )
        arm(
            draw,
            [(cx - 72 * s, cy + 50 * s), (cx - 110 * s, cy + 120 * s), (cx - 70 * s, cy + 155 * s)],
            (cx - 66 * s, cy + 158 * s),
            s,
        )

    # testicle head
    head = (cx - 98 * s, cy - 108 * s, cx + 98 * s, cy + 102 * s)
    outlined_ellipse(draw, head, SKIN, width=8)
    draw.ellipse((cx - 20 * s, cy - 70 * s, cx + 90 * s, cy + 90 * s), fill=SKIN_DARK)
    draw.ellipse((cx - 80 * s, cy - 90 * s, cx - 10 * s, cy - 20 * s), fill=SKIN_LIT)
    draw.arc(
        (cx - 70 * s, cy - 40 * s, cx - 20 * s, cy + 40 * s),
        200,
        320,
        fill=VEIN,
        width=3,
    )
    draw.arc(
        (cx + 20 * s, cy - 10 * s, cx + 80 * s, cy + 70 * s),
        20,
        140,
        fill=VEIN,
        width=3,
    )

    # circular maw with inward fangs
    mx, my, mrx, mry = cx, cy + 18 * s, 62 * s, 58 * s
    outlined_ellipse(
        draw,
        (mx - mrx, my - mry, mx + mrx, my + mry),
        MOUTH,
        width=6,
    )
    tooth_ring(draw, mx, my, mrx - 2 * s, mry - 2 * s, n=13, inward=20 * s)

    # a few sparse hairs on top of the head
    for i, (dx, dy, ang) in enumerate(
        ((-40, -96, -1.9), (-12, -108, -1.6), (18, -104, -1.4), (48, -92, -1.1))
    ):
        x0, y0 = cx + dx * s, cy + dy * s
        x1 = x0 + math.cos(ang) * 16 * s
        y1 = y0 + math.sin(ang) * 16 * s
        draw.line((x0, y0, x1, y1), fill=HAIR, width=3)


def render() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGB", (SIZE, SIZE), BG)
    draw = ImageDraw.Draw(img)
    # two cops, left a hair bigger, right a step lower
    time_cop(draw, 214, 268, 1.02, face=0)
    time_cop(draw, 430, 292, 0.96, face=1)
    bust = img.resize((640, 640), Image.Resampling.LANCZOS)
    bust.save(OUT / "bust.jpg", "JPEG", quality=92, optimize=True)
    mark = img.crop((40, 80, 600, 500)).resize((256, 256), Image.Resampling.LANCZOS)
    mark.save(OUT / "mark.jpg", "JPEG", quality=92, optimize=True)
    print("wrote", OUT / "bust.jpg", OUT / "mark.jpg")


if __name__ == "__main__":
    render()

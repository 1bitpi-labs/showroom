import sys
import numpy as np
from PIL import Image

def cells(path, grid=4):
    # 16:10 aspect ratio (1600x1000)
    img = Image.open(path).convert("RGB").resize((256, 160)).convert("HSV")
    hsv = np.asarray(img).astype(float) / 255.0
    h, w = hsv.shape[:2]
    out = []
    for y in range(grid):
        for x in range(grid):
            c = hsv[y * h // grid:(y + 1) * h // grid, x * w // grid:(x + 1) * w // grid]
            out.append((c[..., 1].mean(), c[..., 2].mean()))
    return np.array(out)

if len(sys.argv) < 3:
    print("usage: python3 color_check.py ref.png render.png")
    sys.exit(1)

d = cells(sys.argv[2]) - cells(sys.argv[1])
for name, col in (("saturation", 0), ("brightness", 1)):
    worst = d[np.abs(d[:, col]).argmax(), col]
    print(f"{name}: mean delta {d[:, col].mean():+.3f}, worst cell {worst:+.3f}")

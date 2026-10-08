# inspect_assets.py
import os, json
from PIL import Image

assets = {
    "Background.jpeg": "images/Background.jpeg",
    "Tarot 1.jpeg": "images/Tarot 1.jpeg",
    "Fav2.mp4": "images/Fav2.mp4",
}

result = {}
for name, rel_path in assets.items():
    abs_path = os.path.abspath(rel_path)
    info = {"path": abs_path, "size_bytes": os.path.getsize(abs_path)}
    if rel_path.lower().endswith(('.png', '.jpg', '.jpeg', '.webp', '.gif')):
        with Image.open(abs_path) as img:
            info.update({
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "mode": img.mode,
                "aspect_ratio": round(img.width / img.height, 3) if img.height != 0 else None,
            })
    elif rel_path.lower().endswith('.mp4'):
        # For video, we just record dimensions if possible via Pillow (unlikely) – fallback to None.
        info.update({"width": None, "height": None, "duration_seconds": None})
    result[name] = info
print(json.dumps(result, indent=2))

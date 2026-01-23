import numpy as np
import cv2
from PIL import Image

def classify_damage(image: Image.Image):
    img = np.array(image)

    # Reject very small images (screenshots, UI images)
    if image.width < 300 or image.height < 300:
        return "invalid_input", 0.0

    gray = cv2.cvtColor(img, cv2.COLOR_RGB2GRAY)

    # Edge detection for cracks, rubble
    edges = cv2.Canny(gray, 50, 150)
    edge_density = edges.mean() / 255.0

    # Brightness measure
    brightness = gray.mean() / 255.0

    # Detect UI-like images (lots of straight lines)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=150, minLineLength=100, maxLineGap=10)
    if lines is not None and len(lines) > 15:
        return "invalid_input", 0.0

    # Damage classification logic
    if edge_density > 0.18 and brightness < 0.5:
        return "destroyed", 0.90
    elif edge_density > 0.12:
        return "major", 0.85
    elif brightness < 0.65:
        return "minor", 0.80
    else:
        return "no_damage", 0.88

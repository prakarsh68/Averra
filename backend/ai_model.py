import numpy as np
from PIL import Image

def predict_image(image: Image.Image):
    img = np.array(image)

    # Normalize pixel values
    img = img / 255.0

    # Calculate average color intensities
    red = img[:, :, 0].mean()
    green = img[:, :, 1].mean()
    blue = img[:, :, 2].mean()

    # Simple disaster logic
    if blue > red and blue > green:
        return "flood", 0.91
    elif red > blue and red > green:
        return "fire", 0.88
    else:
        return "earthquake", 0.85

import torch
from torchvision import models, transforms
from PIL import Image

# -----------------------------------
# Load pretrained model (dummy usage)
# -----------------------------------
model = models.efficientnet_b0(
    weights=models.EfficientNet_B0_Weights.DEFAULT
)
model.eval()

# -----------------------------------
# Image preprocessing
# -----------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor()
])

# -----------------------------------
# Damage prediction
# -----------------------------------
def predict_damage(image_path: str) -> dict:
    """
    Called by FastAPI after image upload
    Returns keys expected by frontend
    """

    img = Image.open(image_path).convert("RGB")
    img_tensor = transform(img).unsqueeze(0)

    # Forward pass (not used, dummy)
    with torch.no_grad():
        _ = model(img_tensor)

    # Simple heuristic (brightness-based)
    brightness = img_tensor.mean().item()

    if brightness > 0.6:
        severity = "No Damage"
        confidence = 0.9
    elif brightness > 0.45:
        severity = "Minor"
        confidence = 0.8
    elif brightness > 0.3:
        severity = "Major"
        confidence = 0.7
    else:
        severity = "Destroyed"
        confidence = 0.6

    return {
        "damage_severity": severity,
        "confidence": confidence
    }
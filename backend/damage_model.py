import torch
from torchvision import models, transforms
from PIL import Image
import torch.nn.functional as F

# Load pretrained EfficientNet (good for classification)
model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

damage_labels = ["no_damage", "minor", "major", "destroyed"]

def classify_damage(image: Image.Image):
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image)
        probs = F.softmax(outputs, dim=1)
        confidence, idx = torch.max(probs, 1)

    severity = damage_labels[idx.item() % len(damage_labels)]
    return severity, round(confidence.item(), 2)

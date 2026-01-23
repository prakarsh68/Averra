import torch
from torchvision import models, transforms
from PIL import Image
import torch.nn.functional as F

# Load pretrained ResNet18
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
])

# Disaster labels (mock mapping for now)
labels = ["flood", "fire", "earthquake"]

def predict_image(image: Image.Image):
    image = transform(image).unsqueeze(0)

    with torch.no_grad():
        outputs = model(image)
        probs = F.softmax(outputs, dim=1)
        confidence, idx = torch.max(probs, 1)

    disaster_type = labels[idx.item() % len(labels)]
    return disaster_type, round(confidence.item(), 2)

import torch
from torchvision import models, transforms
from PIL import Image
import os

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "disaster_classifier.pth")

model = models.resnet50(weights=None)
model.fc = torch.nn.Linear(model.fc.in_features, 6)
model.load_state_dict(torch.load(MODEL_PATH, map_location=device))
model.eval().to(device)

classes = [
    "Damaged_Infrastructure",
    "Fire_Disaster",
    "Human_Damage",
    "Land_Disaster",
    "Non_Damage",
    "Water_Disaster"
]

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

def severity_mapper(disaster_type):
    if disaster_type in ["Fire_Disaster", "Human_Damage"]:
        return "Critical"
    elif disaster_type in ["Water_Disaster", "Damaged_Infrastructure"]:
        return "High"
    elif disaster_type == "Land_Disaster":
        return "Medium"
    return "Low"

def predict_disaster(image_path):
    image = Image.open(image_path).convert("RGB")
    image = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():
        outputs = model(image)
        probs = torch.softmax(outputs, dim=1)
        conf, pred = torch.max(probs, 1)

    disaster_type = classes[pred.item()]
    severity = severity_mapper(disaster_type)

    return {
        "detected": disaster_type != "Non_Damage",
        "type": disaster_type,
        "severity": severity,
        "confidence": float(conf.item())
    }

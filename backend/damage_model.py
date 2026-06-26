import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image

# -----------------------------------
# Device
# -----------------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -----------------------------------
# Class Names (MUST match training)
# -----------------------------------
CLASS_NAMES = [
    "Damaged_Infrastructure",
    "Fire_Disaster",
    "Human_Damage",
    "Land_Disaster",
    "Non_Damage",
    "Water_Disaster"
]

# -----------------------------------
# Load Trained Model
# -----------------------------------
model = models.resnet50(weights=None)
model.fc = nn.Linear(model.fc.in_features, len(CLASS_NAMES))

model.load_state_dict(
    torch.load(
        "models/disaster_classifier.pth",
        map_location=device
    )
)

model.to(device)
model.eval()

# -----------------------------------
# Image Preprocessing
# -----------------------------------
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        [0.485, 0.456, 0.406],
        [0.229, 0.224, 0.225]
    )
])

# -----------------------------------
# Prediction Function
# -----------------------------------
def predict_damage(image_path: str):

    image = Image.open(image_path).convert("RGB")

    image_tensor = transform(image).unsqueeze(0).to(device)

    with torch.no_grad():

        outputs = model(image_tensor)

        probabilities = torch.softmax(outputs, dim=1)

        confidence, predicted = torch.max(probabilities, 1)

    predicted_class = CLASS_NAMES[predicted.item()]

    return {
        "damage_severity": predicted_class,
        "confidence": round(confidence.item(), 4)
    }
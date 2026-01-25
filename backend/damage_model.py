import torch
from torchvision import models, transforms
from PIL import Image

classes = ["No Damage", "Minor", "Major", "Destroyed"]

model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.DEFAULT)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor()
])

def predict_damage(image_path):
    img = Image.open(image_path).convert("RGB")
    img = transform(img).unsqueeze(0)

    with torch.no_grad():
        out = model(img)
        pred = torch.argmax(out, dim=1)

    return classes[pred.item() % len(classes)]

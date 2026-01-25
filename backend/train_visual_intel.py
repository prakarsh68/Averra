import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms
from torch.utils.data import DataLoader
from tqdm import tqdm
import os

# -------------------------
# CONFIG
# -------------------------
DATASET_PATH = "../EuroSAT"
BATCH_SIZE = 16
EPOCHS = 8
NUM_CLASSES = 10
MODEL_SAVE_PATH = "models/visual_intel.pth"
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# -------------------------
# TRAIN FUNCTION
# -------------------------
def main():
    transform = transforms.Compose([
        transforms.Resize((224,224)),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])

    dataset = datasets.ImageFolder(DATASET_PATH, transform=transform)
    print("Detected Classes:", dataset.classes)

    train_loader = DataLoader(
        dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0   # 🔧 VERY IMPORTANT FOR WINDOWS
    )

    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
    model.to(DEVICE)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.0001)

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0
        correct = 0
        total = 0

        loop = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for images, labels in loop:
            images, labels = images.to(DEVICE), labels.to(DEVICE)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, preds = torch.max(outputs, 1)
            correct += (preds == labels).sum().item()
            total += labels.size(0)

            loop.set_postfix(
                loss=loss.item(),
                acc=100 * correct / total
            )

        print(f"Epoch [{epoch+1}/{EPOCHS}] Loss: {running_loss/len(train_loader):.4f}, Accuracy: {100*correct/total:.2f}%")

    os.makedirs("models", exist_ok=True)
    torch.save(model.state_dict(), MODEL_SAVE_PATH)
    print(f"\n Visual Intel Model saved at: {MODEL_SAVE_PATH}")

# -------------------------
# ENTRY POINT (WINDOWS FIX)
# -------------------------
if __name__ == "__main__":
    main()

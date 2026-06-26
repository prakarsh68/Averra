import os
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
from tqdm import tqdm
from PIL import ImageFile
import multiprocessing

ImageFile.LOAD_TRUNCATED_IMAGES = True

def main():
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    DATASET_PATH = "../Comprehensive_Disaster_Dataset(CDD)"
    BATCH_SIZE = 16
    EPOCHS = 10
    LR = 0.0001
    IMG_SIZE = 224

    train_transforms = transforms.Compose([
        transforms.Resize((IMG_SIZE, IMG_SIZE)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),
        transforms.ToTensor(),
        transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
    ])

    train_dataset = datasets.ImageFolder(DATASET_PATH, transform=train_transforms)
    print("Classes found:")
    print(train_dataset.classes)
    train_loader = DataLoader(
        train_dataset,
        batch_size=BATCH_SIZE,
        shuffle=True,
        num_workers=0  # MUST be 0 for Windows stability
    )

    class_names = train_dataset.classes
    num_classes = len(class_names)

    print("Detected Classes:", class_names)

    model = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    model.fc = nn.Linear(model.fc.in_features, num_classes)
    model = model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=LR)

    for epoch in range(EPOCHS):
        model.train()
        running_loss = 0.0
        correct = 0
        total = 0

        loop = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

        for images, labels in loop:
            images, labels = images.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = model(images)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            running_loss += loss.item()
            _, predicted = torch.max(outputs, 1)
            correct += (predicted == labels).sum().item()
            total += labels.size(0)

            loop.set_postfix(loss=loss.item(), acc=100*correct/total)

        print(f"Epoch [{epoch+1}/{EPOCHS}] Loss: {running_loss/len(train_loader):.4f}, Accuracy: {100*correct/total:.2f}%")

    os.makedirs("models", exist_ok=True)
    model_path = "models/disaster_classifier.pth"
    torch.save(model.state_dict(), model_path)
    print(f"\nModel saved successfully at: {model_path}")

if __name__ == "__main__":
    multiprocessing.freeze_support()  # REQUIRED FOR WINDOWS
    main()

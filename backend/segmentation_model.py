import torch
from torchvision import models, transforms
from PIL import Image
import numpy as np

model = models.segmentation.deeplabv3_resnet50(
    weights=models.segmentation.DeepLabV3_ResNet50_Weights.COCO_WITH_VOC_LABELS_V1
)
model.eval()

transform = transforms.Compose([
    transforms.Resize((512, 512)),
    transforms.ToTensor()
])

def segment_image(image: Image.Image):
    image_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(image_tensor)["out"][0]
        mask = output.argmax(0).byte().cpu().numpy()

    binary_mask = (mask > 0).astype(np.uint8) * 255
    return binary_mask

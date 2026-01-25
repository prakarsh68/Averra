import torch
from torchvision import models, transforms
from PIL import Image

model = models.segmentation.deeplabv3_resnet50(
    weights=models.segmentation.DeepLabV3_ResNet50_Weights.DEFAULT
)
model.eval()

transform = transforms.Compose([
    transforms.Resize((512,512)),
    transforms.ToTensor()
])

def segment_image(image_path):
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    with torch.no_grad():
        output = model(input_tensor)['out'][0]

    mask = output.argmax(0).byte().cpu().numpy()
    return mask

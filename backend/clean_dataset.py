import os
from PIL import Image

DATASET_PATH = "../Comprehensive Disaster Dataset(CDD)"

def clean_images(root):
    removed = 0

    for folder in os.listdir(root):
        class_path = os.path.join(root, folder)

        if not os.path.isdir(class_path):
            continue

        for file in os.listdir(class_path):
            img_path = os.path.join(class_path, file)

            # Skip folders inside class folders
            if not os.path.isfile(img_path):
                continue

            try:
                img = Image.open(img_path)
                img.verify()
            except:
                print(f"Removing corrupted: {img_path}")
                try:
                    os.remove(img_path)
                    removed += 1
                except Exception as e:
                    print(f"Could not remove: {img_path} -> {e}")

    print(f"\nTotal removed corrupted images: {removed}")

if __name__ == "__main__":
    clean_images(DATASET_PATH)

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image
import shutil
import os
import random
import cv2

from ai_model import predict_disaster
from visual_intel import predict_area
from segmentation_model import segment_image
from damage_model import predict_damage   # ✅ NEW IMPORT

app = FastAPI(title="AVERRA AI Backend")

# --------------------
# CORS CONFIG
# --------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
TEMP_DIR = os.path.join(BASE_DIR, "temp")
os.makedirs(TEMP_DIR, exist_ok=True)

# --------------------
# ROOT
# --------------------
@app.get("/")
def root():
    return {"status": "AVERRA AI Backend Running"}

# --------------------
# ALERTS API
# --------------------
@app.get("/alerts")
def get_alerts():
    return [
        {"id": "A1", "message": "Severe Flood Warning in Mumbai", "severity": "high"},
        {"id": "A2", "message": "Wildfire detected near Delhi NCR", "severity": "critical"},
        {"id": "A3", "message": "Earthquake tremors in Kashmir", "severity": "medium"}
    ]

# --------------------
# DISASTERS API
# --------------------
@app.get("/disasters")
def get_disasters():
    return [
        {
            "id": "1",
            "type": "flood",
            "severity": "high",
            "description": "Severe flooding in Mumbai",
            "location": [19.076, 72.8777]
        },
        {
            "id": "2",
            "type": "fire",
            "severity": "critical",
            "description": "Wildfire in Delhi NCR",
            "location": [28.6139, 77.209]
        }
    ]

# --------------------
# DISASTER DETECTION
# --------------------
@app.post("/detect")
async def detect(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_disaster(file_path)
    os.remove(file_path)

    return result

# --------------------
# VISUAL INTEL
# --------------------
@app.post("/visual-intel")
async def visual_intel(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_area(file_path)
    os.remove(file_path)

    return result

# --------------------
# DAMAGE SEGMENTATION
# --------------------
@app.post("/segment")
async def segment(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    mask = segment_image(image)

    _, buffer = cv2.imencode(".png", mask)
    return Response(content=buffer.tobytes(), media_type="image/png")

# --------------------
# DAMAGE CLASSIFICATION  ✅ NEW
# --------------------
@app.post("/classify-damage")
async def classify_damage(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_damage(file_path)
    os.remove(file_path)

    return result

# --------------------
# RISK PREDICTION
# --------------------
@app.post("/predict-risk")
def predict_risk(region: str):
    return {
        "region": region,
        "risk_level": random.choice(["low", "medium", "high"]),
        "probability": round(random.uniform(0.4, 0.9), 2)
    }
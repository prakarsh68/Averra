from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from pydantic import BaseModel
from typing import List
import random
from PIL import Image
import cv2

# AI imports
from ai_model import predict_image
from damage_model import classify_damage
from segmentation_model import segment_image

app = FastAPI(title="AVERRA AI Backend")

# -----------------------------
# CORS CONFIG
# -----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -----------------------------
# DATA MODELS
# -----------------------------
class Disaster(BaseModel):
    id: str
    type: str
    severity: str
    description: str
    location: List[float]

# -----------------------------
# MOCK DATABASE
# -----------------------------
fake_disasters = [
    {
        "id": "1",
        "type": "flood",
        "severity": "high",
        "description": "Severe flooding in Mumbai region",
        "location": [19.076, 72.8777]
    },
    {
        "id": "2",
        "type": "fire",
        "severity": "critical",
        "description": "Wildfire detected near Delhi NCR",
        "location": [28.6139, 77.209]
    },
    {
        "id": "3",
        "type": "earthquake",
        "severity": "medium",
        "description": "Earthquake tremors in Kashmir",
        "location": [34.0837, 74.7973]
    }
]

# -----------------------------
# ROUTES
# -----------------------------

@app.get("/")
def root():
    return {"message": "AVERRA Backend Running Successfully"}

@app.get("/disasters", response_model=List[Disaster])
def get_disasters():
    return fake_disasters

@app.get("/alerts")
def get_alerts():
    return [
        {"id": "A1", "message": "Severe Flood Warning in Mumbai", "severity": "high"},
        {"id": "A2", "message": "Wildfire detected near Delhi NCR", "severity": "critical"},
        {"id": "A3", "message": "Earthquake tremors in Kashmir", "severity": "medium"}
    ]

# -----------------------------
# AI DETECTION
# -----------------------------
@app.post("/detect")
async def detect_disaster(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    disaster_type, confidence = predict_image(image)

    return {
        "detected": True,
        "type": disaster_type,
        "severity": "high" if confidence > 0.85 else "medium",
        "confidence": confidence
    }

# -----------------------------
# DAMAGE SEVERITY CLASSIFIER
# -----------------------------
@app.post("/classify-damage")
async def classify_damage_api(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    severity, confidence = classify_damage(image)

    if severity == "invalid_input":
        return {
            "error": "Invalid input. Please upload satellite or aerial images of disaster-affected areas only."
        }

    return {
        "damage_severity": severity,
        "confidence": confidence
    }

# -----------------------------
# VISUAL AI SEGMENTATION
# -----------------------------
@app.post("/segment")
async def segment_disaster(file: UploadFile = File(...)):
    image = Image.open(file.file).convert("RGB")
    mask = segment_image(image)

    _, buffer = cv2.imencode(".png", mask)
    return Response(content=buffer.tobytes(), media_type="image/png")

# -----------------------------
# RISK PREDICTION
# -----------------------------
@app.post("/predict")
def predict_risk(region: str):
    return {
        "region": region,
        "risk_level": random.choice(["low", "medium", "high"]),
        "probability": round(random.uniform(0.4, 0.85), 2)
    }

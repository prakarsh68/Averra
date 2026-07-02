from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from PIL import Image
from shared_state import analysis_state
import shutil
import os
import random
import cv2

from risk_engine import calculate_risks, calculate_weather_risk
from ai_model import predict_disaster
from visual_intel import predict_area
from segmentation_model import segment_image
from damage_model import predict_damage   # ✅ NEW IMPORT
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="AVERRA AI Backend")
# --------------------
# GLOBAL DASHBOARD DATA
# --------------------
dashboard_data = {
    # Core Stats
    "alerts": 3,
    "reports": 0,
    "resolved": 91,

    # Latest AI Results
    "latest_area": "Unknown",
    "latest_damage": "Unknown",
    "confidence": 0,
    "risk_level": "Unknown",

    # Terrain History
    "terrain_counts": {
        "River": 0,
        "Forest": 0,
        "Residential": 0,
        "Industrial": 0,
        "SeaLake": 0,
        "AnnualCrop": 0,
        "Pasture": 0,
        "Highway": 0,
        "PermanentCrop": 0,
        "HerbaceousVegetation": 0
    },

    # Live Feed
    "live_feed": [
    "System initialized",
],
    # Recommendations
    "recommendations": [],

    # Weather
    "weather": {
        "temperature": 0,
        "humidity": 0,
        "wind_speed": 0,
        "rain_risk": "Low"
    },

    # Resources
    "resources": {
        "ambulances": 31,
        "fire_units": 14,
        "helicopters": 5,
        "medical_teams": 16
    }
}

# --------------------
# CORS CONFIG
# --------------------
app.add_middleware(
    CORSMiddleware,
   
   allow_origins=[
    "http://localhost:5173",
    "http://localhost:5174",
],
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
# --------------------
# VISUAL INTEL
# --------------------
@app.post("/visual-intel")
async def visual_intel(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # ------------------------
    # STEP 1 : VISUAL INTEL
    # ------------------------
    visual_result = predict_area(file_path)

    # ------------------------
    # STEP 2 : DAMAGE MODEL
    # ------------------------
    damage_result = predict_damage(file_path)

    # ------------------------
    # STEP 3 : AI DETECT
    # ------------------------
    ai_result = predict_disaster(file_path)

    # ------------------------
    # STEP 4 : RISK ENGINE
    # ------------------------
    risks = calculate_risks(
        visual_result["area_type"],
        rainfall=120,
        humidity=85,
        wind_speed=14
    )

    visual_result["risks"] = risks

    # ------------------------
    # SAVE TO GLOBAL STATE
    # ------------------------
    analysis_state["uploaded_image"] = file.filename
    analysis_state["visual"] = visual_result
    analysis_state["damage"] = damage_result
    analysis_state["ai_detect"] = ai_result

    # ------------------------
    # DASHBOARD
    # ------------------------
    dashboard_data["latest_area"] = visual_result["area_type"]

    dashboard_data["latest_damage"] = damage_result["damage_severity"]

    dashboard_data["latest_disaster"] = ai_result["type"]

    dashboard_data["confidence"] = round(
        visual_result["confidence"] * 100,
        2
    )

    highest = max(risks, key=risks.get)

    dashboard_data["risk_level"] = highest.replace("_risk", "").capitalize()

    dashboard_data["weather"] = {
        "temperature": 29,
        "humidity": 85,
        "wind_speed": 14,
        "rain_risk": "High" if risks["flood_risk"] > 70 else "Low",
    }

    dashboard_data["recommendations"] = []

    if risks["flood_risk"] > 70:
        dashboard_data["recommendations"].append(
            "Deploy flood response teams"
        )

    if risks["wildfire_risk"] > 70:
        dashboard_data["recommendations"].append(
            "Monitor wildfire spread"
        )

    if risks["landslide_risk"] > 70:
        dashboard_data["recommendations"].append(
            "Evacuate unstable slopes"
        )

    dashboard_data["reports"] += 1

    dashboard_data["live_feed"].insert(
        0,
        f"Visual : {visual_result['area_type']}"
    )

    dashboard_data["live_feed"].insert(
        1,
        f"Damage : {damage_result['damage_severity']}"
    )

    dashboard_data["live_feed"].insert(
        2,
        f"AI Detect : {ai_result['type']}"
    )

    dashboard_data["live_feed"] = dashboard_data["live_feed"][:10]

    terrain = visual_result["area_type"]

    if terrain in dashboard_data["terrain_counts"]:
        dashboard_data["terrain_counts"][terrain] += 1

    os.remove(file_path)

    return {
        "visual": visual_result,
        "damage": damage_result,
        "ai_detect": ai_result,
        "risks": risks
    }

# --------------------
# DAMAGE CLASSIFICATION  ✅ NEW
# --------------------
@app.post("/classify-damage")
async def classify_damage(file: UploadFile = File(...)):
    file_path = os.path.join(TEMP_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = predict_damage(file_path)
    dashboard_data["latest_damage"] = result["damage_severity"]
    dashboard_data["reports"] += 1
    dashboard_data["live_feed"].insert(
    0,
    f"Damage Analysis: {result['damage_severity']}"
)

    dashboard_data["live_feed"] = dashboard_data["live_feed"][:10]
    
    os.remove(file_path)

    return result

# --------------------
# RISK PREDICTION
# --------------------
# --------------------
# DASHBOARD DATA
# --------------------
@app.get("/dashboard")
def dashboard():
    return dashboard_data

@app.post("/predict-risk")
def predict_risk(region: str):
    return {
        "region": region,
        "risk_level": random.choice(["low", "medium", "high"]),
        "probability": round(random.uniform(0.4, 0.9), 2)
    }
# --------------------
# WEATHER RISK ENGINE
# --------------------
from pydantic import BaseModel

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    windSpeed: float
    rain: float


@app.post("/weather-risk")
def weather_risk(data: WeatherData):

    print({
        "temperature": data.temperature,
        "humidity": data.humidity,
        "windSpeed": data.windSpeed,
        "rain": data.rain,
    })

    print("WEATHER RISK ENDPOINT HIT")

    result = calculate_weather_risk({
        "temperature": data.temperature,
        "humidity": data.humidity,
        "windSpeed": data.windSpeed,
        "rain": data.rain,
    })

    # ---------------- Dashboard Updates ----------------

    dashboard_data["weather"] = {
    "temperature": data.temperature,
    "humidity": data.humidity,
    "wind_speed": data.windSpeed,
    "rain_risk": result["risk_level"],
    "risk_score": result["risk_score"],
}
    
    dashboard_data["risk_level"] = result["risk_level"]

    dashboard_data["recommendations"] = result["recommendations"]
    

    dashboard_data["live_feed"].insert(
        0,
        f"Weather Scan : {result['risk_level']} Risk"
    )

    dashboard_data["live_feed"] = dashboard_data["live_feed"][:10]
    print(dashboard_data)

    return result
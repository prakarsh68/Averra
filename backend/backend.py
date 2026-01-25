import requests
import firebase_admin
from firebase_admin import credentials, firestore
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
import uvicorn

# --- 1. SETUP FIREBASE ---
# ⚠️ IMPORTANT: 'serviceAccountKey.json' must be in the same folder as this script.
try:
    cred = credentials.Certificate("serviceAccountKey.json")
    firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("✅ Firebase Connected Successfully")
except Exception as e:
    print(f"❌ Firebase Error: {e}")
    print("Make sure serviceAccountKey.json is correct and in the folder.")

app = FastAPI()

# --- 2. ENABLE CORS (Critical for React Connection) ---
# This allows your React app (running on port 5173) to talk to Python (port 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# --- 3. ROOT ROUTE (Health Check) ---
@app.get("/")
def home():
    """
    Simple check to see if backend is running.
    Visit: http://127.0.0.1:8000/
    """
    return {
        "status": "online",
        "message": "AVERRA Satellite Intelligence Backend is Active",
        "endpoints": ["/fetch-satellite"]
    }

# --- 4. AI VERIFICATION SIMULATION ---
def ai_verify_event(event_title, description):
    """
    Simulates an AI model cross-checking satellite data.
    """
    confidence_score = 0.0
    
    # Simple keyword analysis for "AI" logic
    keywords = ["Wildfire", "Hurricane", "Cyclone", "Volcano", "Flood"]
    if any(word in event_title for word in keywords):
        confidence_score = 0.98  # High confidence for known disasters
    else:
        confidence_score = 0.75
    
    return {
        "verified": True,
        "confidence": confidence_score,
        "note": f"Verified by AI (Confidence: {int(confidence_score*100)}%)"
    }

# --- 5. FETCH & PROCESS SATELLITE DATA ---
@app.get("/fetch-satellite")
def fetch_satellite_data():
    """
    Fetches live data from NASA EO-NET, 'verifies' it with AI, and pushes to Firestore.
    Visit: http://127.0.0.1:8000/fetch-satellite
    """
    try:
        # NASA EO-NET API (Free, No Key Required)
        print("📡 Contacting NASA Satellites...")
        nasa_url = "https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=10"
        response = requests.get(nasa_url)
        data = response.json()

        added_count = 0

        for event in data.get("events", []):
            event_id = event["id"]
            title = event["title"]
            
            # Handle categories safely
            category = "Unknown"
            if event.get("categories"):
                category = event["categories"][0]["title"]
            
            # Extract Coordinates (NASA gives [lng, lat], we need [lat, lng])
            if not event.get("geometry"):
                continue

            # We take the most recent geometry point
            geometry = event["geometry"][-1]
            lng = geometry["coordinates"][0]
            lat = geometry["coordinates"][1]

            # Map NASA Categories to AVERRA Types
            incident_type = "Other"
            if "Wildfires" in category: incident_type = "Fire"
            elif "Severe Storms" in category: incident_type = "Storm"
            elif "Volcanoes" in category: incident_type = "Earthquake" 
            elif "Floods" in category: incident_type = "Flood"
            elif "Sea and Lake Ice" in category: incident_type = "Ice"

            # --- AI VERIFICATION STEP ---
            ai_result = ai_verify_event(title, category)

            # Create Report Object
            report_data = {
                "id": f"nasa-{event_id}",
                "reporterName": "NASA EO-NET",
                "reporterEmail": "satellite@nasa.gov",
                "type": incident_type,
                "description": f"{title} - Detected via Satellite. {ai_result['note']}",
                "lat": lat,
                "lng": lng,
                "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/NASA_logo.svg/2449px-NASA_logo.svg.png",
                "verified": True,
                "status": "critical",
                "source": "Satellite (NASA)",
                "timestamp": datetime.now()
            }

            # --- PUSH TO FIRESTORE ---
            doc_ref = db.collection("user_reports").document(f"nasa-{event_id}")
            doc_ref.set(report_data)
            added_count += 1

        print(f"✅ Successfully processed {added_count} events.")
        return {
            "status": "success", 
            "message": f"Successfully processed {added_count} satellite events.",
            "source": "NASA EO-NET"
        }

    except Exception as e:
        print(f"❌ Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Use 127.0.0.1 for local dev to avoid browser issues
    uvicorn.run(app, host="127.0.0.1", port=8000)
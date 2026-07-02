def calculate_risks(area_type, rainfall, humidity, wind_speed):
    area = area_type.lower()

    risks = {
        "flood_risk": 0,
        "wildfire_risk": 0,
        "landslide_risk": 0,
    }

    # Flood
    if rainfall > 100:
        risks["flood_risk"] += 60
    if humidity > 80:
        risks["flood_risk"] += 20
    if "river" in area or "lake" in area:
        risks["flood_risk"] += 20

    # Wildfire
    if humidity < 40:
        risks["wildfire_risk"] += 40
    if wind_speed > 15:
        risks["wildfire_risk"] += 30
    if "forest" in area:
        risks["wildfire_risk"] += 30

    # Landslide
    if rainfall > 80:
        risks["landslide_risk"] += 40
    if "mountain" in area or "hill" in area:
        risks["landslide_risk"] += 60

    return risks


def calculate_weather_risk(weather):
    temperature = weather["temperature"]
    humidity = weather["humidity"]
    wind = weather["windSpeed"]
    rain = weather["rain"]

    risk_score = 0
    recommendations = []

    if rain > 30:
        risk_score += 40
        recommendations.append("Deploy flood response teams")

    if wind > 50:
        risk_score += 35
        recommendations.append("Issue high wind advisory")

    if temperature > 40:
        risk_score += 20
        recommendations.append("Prepare heatwave shelters")

    if humidity > 90:
        risk_score += 10
        recommendations.append("Monitor waterlogged areas")

    if risk_score >= 70:
        level = "EXTREME"
    elif risk_score >= 40:
        level = "HIGH"
    elif risk_score >= 20:
        level = "MODERATE"
    else:
        level = "LOW"

    return {
        "risk_level": level,
        "risk_score": risk_score,
        "recommendations": recommendations,
    }
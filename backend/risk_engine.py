def calculate_risks(area_type, rainfall, humidity, wind_speed):

    flood_risk = 0
    wildfire_risk = 0
    landslide_risk = 0

    if area_type in ["River", "SeaLake"]:
        flood_risk += 50

    if rainfall > 100:
        flood_risk += 30
        landslide_risk += 25

    if area_type == "Forest":
        wildfire_risk += max(0, 70 - humidity)

    if wind_speed > 25:
        wildfire_risk += 20

    return {
        "flood_risk": min(flood_risk, 100),
        "wildfire_risk": min(wildfire_risk, 100),
        "landslide_risk": min(landslide_risk, 100)
    }
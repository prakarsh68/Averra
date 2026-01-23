import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import AlertsPanel from "../components/AlertsPanel";

interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: [number, number];
}

const center: LatLngExpression = [20.5937, 78.9629];

const Map = () => {
  const [disasters, setDisasters] = useState<Disaster[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/disasters")
      .then(res => res.json())
      .then(data => setDisasters(data))
      .catch(err => console.error("Error fetching disasters:", err));
  }, []);

  return (
    <div className="p-6">
      <AlertsPanel />

      <h2 className="text-xl font-bold mb-4">Live Disaster Intelligence Map</h2>

      <div style={{ height: "500px", width: "100%" }}>
        <MapContainer
          center={center}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {disasters.map(d => (
            <Marker key={d.id} position={d.location}>
              <Popup>
                <strong>{d.type.toUpperCase()}</strong><br />
                Severity: {d.severity}<br />
                {d.description}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;

import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMapEvents,
} from "react-leaflet";
import L, { type LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";

import { db } from "../firebase";
import AlertsPanel from "../components/AlertsPanel";

interface Disaster {
  id: string;
  type: string;
  severity: string;
  description: string;
  location: [number, number];
  source: string;
  reporter?: string;
  image?: string;
}

const center: LatLngExpression = [20.5937, 78.9629];

const Map = () => {
 const [disasters, setDisasters] = useState<Disaster[]>([]);

const [selectedLocation, setSelectedLocation] =
  useState<[number, number] | null>(null);

const [weather, setWeather] = useState({
  temperature: 0,
  humidity: 0,
  windSpeed: 0,
  rain: 0,
});

const [weatherRisk, setWeatherRisk] = useState({
  risk_level: "LOW",
  risk_score: 0,
  recommendations: [] as string[],
});

  useEffect(() => {
    const q = query(
      collection(db, "user_reports"),
      orderBy("timestamp", "desc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => {
          const d = doc.data();

          if (!d.lat || !d.lng) return null;

          const jitter = 0.0005;

          const lat =
            parseFloat(d.lat) +
            (Math.random() - 0.5) * jitter;

          const lng =
            parseFloat(d.lng) +
            (Math.random() - 0.5) * jitter;

          return {
            id: doc.id,
            type: d.type || "Unknown",
            severity: d.verified
              ? "High"
              : "Unverified",
            description:
              d.description ||
              "No description provided.",
            location: [lat, lng],
            source: d.source || "User Report",
            reporter:
              d.reporterName || "Anonymous",
            image: d.imageUrl || undefined,
          };
        })
        .filter(Boolean) as Disaster[];

      setDisasters(data);
    });

    return () => unsub();
  }, []);
  useEffect(() => {
  if (!selectedLocation) return;

  const fetchWeather = async () => {
    const [lat, lon] = selectedLocation;

    try {
     console.log("Fetching weather...");

const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,rain`
      );

      const data = await response.json();
      console.log("Full API Response:", data);

      const temperature = data.current.temperature_2m;
const humidity = data.current.relative_humidity_2m;
const wind = data.current.wind_speed_10m;
const rain = data.current.rain;

setWeather({
  temperature,
  humidity,
  windSpeed: wind,
  rain,
});
console.log("Calling backend weather risk...");
const riskResponse = await fetch(
  "http://127.0.0.1:8000/weather-risk",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      temperature,
      humidity,
      windSpeed: wind,
      rain,
    }),
  }
);

const risk = await riskResponse.json();
console.log("Backend returned:", risk);

setWeatherRisk(risk);

      console.log("Weather:", data.current);
    } catch (err) {
      console.error("Weather API Error:", err);
    }
  };

  fetchWeather();
}, [selectedLocation]);
  function LocationSelector() {
  useMapEvents({
   click(e) {
  const coords: [number, number] = [
    e.latlng.lat,
    e.latlng.lng,
  ];

  setSelectedLocation(coords);

  console.log("Selected:", coords);
},
  });

  if (!selectedLocation) return null;

  return (
   <Marker
  position={selectedLocation}
  icon={getWeatherMarker()}
>
      <Popup>
        <strong>Selected Location</strong>
        <br />
        Latitude: {selectedLocation[0].toFixed(5)}
        <br />
        Longitude: {selectedLocation[1].toFixed(5)}
      </Popup>
    </Marker>
  );
}
const getCustomIcon = (
  type: string,
  severity: string
) => {
  const t = type.toLowerCase();
  const s = severity.toLowerCase();

  let emoji = "⚠";

  if (t.includes("fire")) emoji = "🔥";
  else if (t.includes("flood")) emoji = "💧";
  else if (t.includes("cyclone")) emoji = "🌪";
  else if (t.includes("storm")) emoji = "🌪";
  else if (t.includes("quake")) emoji = "📉";
  else if (t.includes("accident")) emoji = "🚑";

  let colorClass =
    "border-emerald-500 shadow-emerald-500/50";
  let pulseClass = "bg-emerald-500";

  if (
    s.includes("critical") ||
    s.includes("high")
  ) {
    colorClass =
      "border-red-600 shadow-red-600/50";
    pulseClass = "bg-red-600";
  } else if (s.includes("unverified")) {
    colorClass =
      "border-amber-500 shadow-amber-500/50";
    pulseClass = "bg-amber-500";
  }

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative w-10 h-10 flex items-center justify-center group">
        <div class="absolute w-full h-full rounded-full animate-ping opacity-70 ${pulseClass}"></div>

        <div class="relative z-10 w-10 h-10 rounded-full bg-black/80 border-2 ${colorClass}
        flex items-center justify-center text-xl backdrop-blur">
          ${emoji}
        </div>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20],
  });
};
const getWeatherMarker = () => {
  let color = "#22c55e"; // Green

  if (weatherRisk.risk_level === "MODERATE")
    color = "#facc15";

  if (weatherRisk.risk_level === "HIGH")
    color = "#fb923c";

  if (weatherRisk.risk_level === "EXTREME")
    color = "#ef4444";

  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:26px;
        height:26px;
        border-radius:50%;
        background:${color};
        border:3px solid white;
        box-shadow:0 0 18px ${color};
      "></div>
    `,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  });
};
return (
  <div className="min-h-screen bg-black text-neutral-200 p-6 flex flex-col gap-6">

    {/* HEADER */}
    <div className="flex flex-col lg:flex-row gap-6">

      <div className="flex-1">
        <h2 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-3">
          <span className="text-amber-500 animate-pulse">
            📡
          </span>

          Live Geospatial Intelligence
        </h2>

        <p className="text-neutral-500 uppercase tracking-widest text-sm mt-1">
          Real-time Disaster Tracking & Zone Analysis
        </p>
      </div>

      <div className="flex-1">
        <AlertsPanel />
      </div>

    </div>

    {/* MAP */}
    <div className="relative h-[75vh] w-full rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">

      {/* HUD */}

      <div className="absolute top-4 left-4 z-[400] bg-black/80 border border-neutral-700 rounded px-4 py-2 text-xs font-mono text-emerald-400">
        ● SYSTEM ONLINE
        <span className="ml-2 text-neutral-500">
          LIVE FEED : {disasters.length} REPORTS
        </span>
      </div>

      <div className="absolute top-16 left-4 z-[400] bg-black/80 border border-cyan-500/30 rounded px-4 py-2 text-xs font-mono text-cyan-400">
        SATELLITES ONLINE : 14
      </div>

      <div className="absolute top-4 right-4 z-[400] bg-black/80 border border-red-500/30 rounded px-4 py-2 text-xs font-mono text-red-400">
        THREAT LEVEL : CRITICAL
      </div>

      <div className="absolute bottom-4 left-4 z-[400] bg-black/70 rounded px-2 py-1 text-[10px] font-mono text-neutral-500">
        Map Source : CartoDB Dark Matter
      </div>

      <MapContainer
        center={center}
        zoom={5}
        zoomControl={false}
        style={{
          height: "100%",
          width: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <LocationSelector />
        {selectedLocation && (
  <Circle
    center={selectedLocation}
    radius={
      weatherRisk.risk_level === "LOW"
        ? 400
        : weatherRisk.risk_level === "MODERATE"
        ? 700
        : weatherRisk.risk_level === "HIGH"
        ? 1000
        : 1500
    }
    pathOptions={{
      color:
        weatherRisk.risk_level === "LOW"
          ? "#22c55e"
          : weatherRisk.risk_level === "MODERATE"
          ? "#facc15"
          : weatherRisk.risk_level === "HIGH"
          ? "#fb923c"
          : "#ef4444",
      fillColor:
        weatherRisk.risk_level === "LOW"
          ? "#22c55e"
          : weatherRisk.risk_level === "MODERATE"
          ? "#facc15"
          : weatherRisk.risk_level === "HIGH"
          ? "#fb923c"
          : "#ef4444",
      fillOpacity: 0.2,
      weight: 2,
    }}
  />
)}
        {disasters.map((d) => (
  <Marker
    key={d.id}
    position={d.location}
    icon={getCustomIcon(
      d.type,
      d.severity
    )}
  >
    <Popup className="tactical-popup">

      <div className="p-2 min-w-[220px]">

        {d.image && (
          <div className="mb-2 overflow-hidden rounded h-32">
            <img
              src={d.image}
              alt="Evidence"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex justify-between items-center border-b pb-1 mb-2">

          <strong className="uppercase text-sm">
            {d.type}
          </strong>

          <span
            className={`text-xs font-bold uppercase ${
              d.severity === "Unverified"
                ? "text-amber-600"
                : "text-red-600"
            }`}
          >
            {d.severity}
          </span>

        </div>

        <p className="text-xs text-neutral-600 mb-2">
          {d.description}
        </p>

        <div className="bg-neutral-100 rounded p-2 text-[10px] font-mono space-y-1">

          <div>
            LAT :
            {" "}
            {d.location[0].toFixed(4)}
          </div>

          <div>
            LNG :
            {" "}
            {d.location[1].toFixed(4)}
          </div>

          <div>
            SOURCE :
            {" "}
            {d.reporter}
          </div>

        </div>

      </div>

    </Popup>

  </Marker>
))}
      </MapContainer>
      
      {selectedLocation && (
  <div className="absolute bottom-6 left-6 z-[9999] w-72 rounded-xl border border-cyan-500 bg-black p-4">

    <h3 className="text-cyan-400 font-bold tracking-widest mb-3">
      🌦 WEATHER INTELLIGENCE
    </h3>

    <div className="space-y-2 text-sm">

      <div className="flex justify-between">
        <span>🌡 Temperature</span>
        <span className="font-bold">
          {weather.temperature} °C
        </span>
      </div>

      <div className="flex justify-between">
        <span>💧 Humidity</span>
        <span className="font-bold">
          {weather.humidity} %
        </span>
      </div>

      <div className="flex justify-between">
        <span>🌬 Wind</span>
        <span className="font-bold">
          {weather.windSpeed} km/h
        </span>
      </div>

      <div className="flex justify-between">
        <span>🌧 Rain</span>
        <span className="font-bold">
          {weather.rain} mm
        </span>
      </div>

      <div className="border-t border-cyan-500/20 mt-3 pt-3">

  <div className="flex justify-between">

    <span className="text-xs text-neutral-400">
      LIVE WEATHER
    </span>

    <span className="text-green-400 animate-pulse">
      ● ONLINE
    </span>

  </div>

  <div className="mt-3">

    <div
  className={`font-bold ${
    weatherRisk.risk_level === "EXTREME"
      ? "text-red-500"
      : weatherRisk.risk_level === "HIGH"
      ? "text-orange-400"
      : weatherRisk.risk_level === "MODERATE"
      ? "text-yellow-400"
      : "text-green-400"
  }`}
>
  RISK LEVEL : {weatherRisk.risk_level}
</div>

<div className="text-xs text-neutral-400 mt-1">
  Risk Score : {weatherRisk.risk_score}
</div>

<div className="mt-2 text-xs text-cyan-300">
  Recommendations:
</div>

<ul className="text-xs text-neutral-300 list-disc ml-4 mt-1">
  {weatherRisk.recommendations.map((r, i) => (
    <li key={i}>{r}</li>
  ))}
</ul>

  </div>

</div>

    </div>

  </div>
)}

    </div>

  </div>
);
};

export default Map;
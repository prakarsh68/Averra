import type { Disaster } from "../types/disaster";

export const disasters: Disaster[] = [
  {
    id: "1",
    type: "flood",
    severity: "high",
    location: [19.076, 72.8777],
    description: "Severe flooding in Mumbai region"
  },
  {
    id: "2",
    type: "fire",
    severity: "critical",
    location: [28.6139, 77.209],
    description: "Wildfire detected near Delhi NCR"
  },
  {
    id: "3",
    type: "earthquake",
    severity: "medium",
    location: [34.0837, 74.7973],
    description: "Moderate seismic activity in Kashmir"
  }
];

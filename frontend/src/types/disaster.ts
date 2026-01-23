export type DisasterType = "flood" | "fire" | "earthquake";

export type Severity = "low" | "medium" | "high" | "critical";

export interface Disaster {
  id: string;
  type: DisasterType;
  severity: Severity;
  location: [number, number]; // lat, lng
  description: string;
}

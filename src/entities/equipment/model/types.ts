export type Equipment = {
  id: string;
  name: string;
  model: string;
  place: string;
  serial: string;
  lastService: string;
  // Mock: Unity SelectModelByIndex number (0–6) shown for this equipment.
  unityIndex: number;
};

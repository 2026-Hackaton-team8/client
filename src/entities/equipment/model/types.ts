export type Equipment = {
  id: string;
  name: string;
  model: string;
  place: string;
  serial: string;
  lastService: string;
  // Mock: Unity equipment code (ROBOT-001, CNC-001, PUMP-001, COMPRESSOR-001) shown for this equipment.
  unityCode: string;
};

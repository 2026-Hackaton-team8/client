// Request/response shapes from the backend's OpenAPI spec (/v3/api-docs).

export type Role = "PENDING" | "WORKER" | "STAFF";
export type CompanyType = "USER_COMPANY" | "MAKER_COMPANY";
export type RequestStatus = "RECEIVED" | "ASSIGNED" | "COMPLETED" | "SELF_RESOLVED";
export type Urgency = "HIGH" | "MEDIUM" | "LOW";
export type EquipmentState = "STOPPED" | "PARTIAL" | "NORMAL";
export type CallReason = "SOLUTION_FAILED" | "NEEDS_EXPERT" | "LOW_CONFIDENCE" | "NO_HISTORY";
export type Difficulty = "SELF" | "ENGINEER";
export type SectionType = "OVERVIEW" | "OPERATION" | "MAINTENANCE" | "TROUBLESHOOTING" | "SAFETY";

// Auth

export type LoginRequest = { loginId: string; pw: string };

export type LoginResponse = {
  accessToken: string;
  refreshToken: string;
  userId: number;
  role: Role;
  companyId?: number;
};

export type SignUpRequest = {
  loginId: string;
  pw: string;
  name: string;
  phone: string;
  email?: string;
};

export type SignUpResponse = {
  userId: number;
  loginId: string;
  role: Role;
  companyId?: number;
};

export type RefreshResponse = { accessToken: string; refreshToken: string };

// Users & companies

export type CompanyInfo = { id: number; name: string };

export type MeResponse = {
  userId: number;
  loginId: string;
  name: string;
  phone: string;
  email?: string;
  role: Role;
  company?: CompanyInfo;
};

export type UpdateMeRequest = { name: string; phone: string; email?: string };

export type SelectRoleRequest = { role: Role; companyId: number };

export type CompanyResponse = {
  id: number;
  name: string;
  type: CompanyType;
  located: string;
};

export type CreateCompanyRequest = {
  name: string;
  located: string;
  businessNumber: string;
  type: CompanyType;
  phone: string;
  email?: string;
};

// Models & parts

export type ModelSummaryResponse = {
  id: number;
  code: string;
  name: string;
  category: string;
  makerCompanyName: string;
};

export type ModelDetailResponse = ModelSummaryResponse & {
  makerCompanyId: number;
  modelFileKey?: string;
  partCount: number;
  repairHistoryCount: number;
};

export type ModelInfo = {
  id: number;
  code: string;
  name: string;
  category: string;
  makerCompanyName: string;
  modelFileKey?: string;
};

export type PartResponse = {
  id: number;
  code: string;
  name: string;
  locationDesc?: string;
  meshName?: string;
};

export type MakerModelResponse = {
  id: number;
  code: string;
  name: string;
  category: string;
  installedCount: number;
  repairHistoryCount: number;
  lastRepairedAt?: string;
};

export type CreateModelRequest = {
  code: string;
  name: string;
  category: string;
  modelFileKey?: string;
};

export type CreatePartRequest = {
  code: string;
  name: string;
  locationDesc?: string;
  meshName?: string;
};

export type ManualSection = {
  id: string;
  title: string;
  type: SectionType;
  symptoms?: string[];
  partCodes?: string[];
  content: string;
  steps?: string[];
  cautions?: string[];
};

export type Manual = {
  version?: number;
  sections: ManualSection[];
};

// Equipment

export type EquipmentResponse = {
  id: number;
  name: string;
  location: string;
  serialNumber?: string;
  model: ModelInfo;
};

export type EquipmentDetailResponse = EquipmentResponse & { parts: PartResponse[] };

export type CreateEquipmentRequest = {
  modelId: number;
  name: string;
  location: string;
  serialNumber?: string;
};

export type EquipmentInfo = {
  id: number;
  name: string;
  location: string;
  serialNumber?: string;
  modelId: number;
  modelCode: string;
  modelName: string;
};

// Service requests (호출)

export type AiSummary = { symptom?: string; cause?: string; triedAction?: string };

export type Contact = { reporterName: string; reporterPhone: string; companyPhone: string };

export type EngineerInfo = { id: number; name: string; phone: string };

export type CreateRequestRequest = {
  equipmentId: number;
  aiSummary?: AiSummary;
  symptomDetail: string;
  equipmentState: EquipmentState;
  urgency: Urgency;
  contact: Contact;
};

export type RequestSummaryResponse = {
  id: number;
  requestNo: string;
  status: RequestStatus;
  urgency: Urgency;
  callReason?: CallReason;
  companyName: string;
  equipmentName: string;
  modelCode: string;
  modelName: string;
  symptomSummary: string;
  createdAt: string;
};

export type RequestDetailResponse = {
  id: number;
  requestNo: string;
  status: RequestStatus;
  urgency: Urgency;
  equipmentState: EquipmentState;
  callReason?: CallReason;
  symptomDetail: string;
  aiSummary?: AiSummary;
  equipment: EquipmentInfo;
  company: CompanyInfo;
  contact: Contact;
  engineer?: EngineerInfo;
  visitAt?: string;
  createdAt: string;
};

export type InboxResponse = {
  counts: Partial<Record<RequestStatus, number>>;
  content: RequestSummaryResponse[];
  page: number;
  size: number;
  totalElements: number;
};

export type EngineerResponse = { id: number; name: string; phone: string; email?: string };

export type AssignRequest = { engineerId: number; visitAt: string };

// Repair history

export type PartInfo = { id: number; code: string; name: string };

export type RepairHistoryResponse = {
  id: number;
  requestId: number;
  requestNo: string;
  equipment: EquipmentInfo;
  part: PartInfo;
  cause: string;
  solution: string;
  difficulty: Difficulty;
  engineerName?: string;
  repairedAt: string;
};

export type CreateRepairHistoryRequest = {
  partId: number;
  cause: string;
  solution: string;
  difficulty: Difficulty;
};

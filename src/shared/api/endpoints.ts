import { api } from "./client";
import type {
  AssignRequest,
  CompanyResponse,
  CompanyType,
  CreateCompanyRequest,
  CreateEquipmentRequest,
  CreateModelRequest,
  CreatePartRequest,
  CreateRepairHistoryRequest,
  CreateRequestRequest,
  EngineerResponse,
  EquipmentDetailResponse,
  EquipmentResponse,
  InboxResponse,
  LoginRequest,
  LoginResponse,
  MakerModelResponse,
  Manual,
  MeResponse,
  ModelDetailResponse,
  ModelSummaryResponse,
  PartResponse,
  RepairHistoryResponse,
  RequestDetailResponse,
  RequestStatus,
  RequestSummaryResponse,
  SelectRoleRequest,
  SignUpRequest,
  SignUpResponse,
  UpdateMeRequest,
} from "./types";

const json = <T>(method: "POST" | "PUT" | "PATCH", body?: T) => ({ method, body });

export const authApi = {
  login: (body: LoginRequest) =>
    api<LoginResponse>("/api/auth/login", { ...json("POST", body), auth: false }),
  signUp: (body: SignUpRequest) =>
    api<SignUpResponse>("/api/auth/signup", { ...json("POST", body), auth: false }),
  logout: (refreshToken: string) =>
    api<void>("/api/auth/logout", { ...json("POST", { refreshToken }), auth: false }),
  isLoginIdAvailable: (loginId: string) =>
    api<{ available: boolean }>("/api/auth/login-id/available", {
      query: { loginId },
      auth: false,
    }).then((result) => result.available),
};

export const meApi = {
  get: () => api<MeResponse>("/api/me"),
  update: (body: UpdateMeRequest) => api<MeResponse>("/api/me", json("PATCH", body)),
  // Returns fresh tokens carrying the new role and company.
  selectRole: (body: SelectRoleRequest) => api<LoginResponse>("/api/me/role", json("POST", body)),
};

export const companyApi = {
  list: (type?: CompanyType) => api<CompanyResponse[]>("/api/companies", { query: { type } }),
  create: (body: CreateCompanyRequest) =>
    api<CompanyResponse>("/api/companies", json("POST", body)),
};

export const modelApi = {
  search: (q?: string) => api<ModelSummaryResponse[]>("/api/models", { query: { q } }),
  get: (modelId: number) => api<ModelDetailResponse>(`/api/models/${modelId}`),
  parts: (modelId: number) => api<PartResponse[]>(`/api/models/${modelId}/parts`),
};

export const equipmentApi = {
  list: () => api<EquipmentResponse[]>("/api/equipments"),
  get: (equipmentId: number) => api<EquipmentDetailResponse>(`/api/equipments/${equipmentId}`),
  create: (body: CreateEquipmentRequest) =>
    api<EquipmentDetailResponse>("/api/equipments", json("POST", body)),
  repairHistories: (equipmentId: number) =>
    api<RepairHistoryResponse[]>(`/api/equipments/${equipmentId}/repair-histories`),
};

// 사용 업체's own service requests.
export const requestApi = {
  list: () => api<RequestSummaryResponse[]>("/api/requests"),
  get: (requestId: number) => api<RequestDetailResponse>(`/api/requests/${requestId}`),
  create: (body: CreateRequestRequest) =>
    api<RequestDetailResponse>("/api/requests", json("POST", body)),
};

// 제작 업체 side.
export const makerApi = {
  inbox: (params: { status?: RequestStatus; page?: number; size?: number } = {}) =>
    api<InboxResponse>("/api/maker/requests", { query: params }),
  request: (requestId: number) => api<RequestDetailResponse>(`/api/maker/requests/${requestId}`),
  assign: (requestId: number, body: AssignRequest) =>
    api<RequestDetailResponse>(`/api/maker/requests/${requestId}/assign`, json("POST", body)),
  resolveBySelf: (requestId: number) =>
    api<RequestDetailResponse>(`/api/maker/requests/${requestId}/self-resolved`, json("POST")),
  recordRepair: (requestId: number, body: CreateRepairHistoryRequest) =>
    api<RepairHistoryResponse>(
      `/api/maker/requests/${requestId}/repair-history`,
      json("POST", body),
    ),
  engineers: () => api<EngineerResponse[]>("/api/maker/engineers"),

  models: () => api<MakerModelResponse[]>("/api/maker/models"),
  createModel: (body: CreateModelRequest) =>
    api<ModelDetailResponse>("/api/maker/models", json("POST", body)),
  createPart: (modelId: number, body: CreatePartRequest) =>
    api<PartResponse>(`/api/maker/models/${modelId}/parts`, json("POST", body)),
  manual: (modelId: number) => api<Manual>(`/api/maker/models/${modelId}/manual`),
  updateManual: (modelId: number, body: Manual) =>
    api<Manual>(`/api/maker/models/${modelId}/manual`, json("PUT", body)),
  modelHistories: (modelId: number) =>
    api<RepairHistoryResponse[]>(`/api/maker/models/${modelId}/repair-histories`),
};

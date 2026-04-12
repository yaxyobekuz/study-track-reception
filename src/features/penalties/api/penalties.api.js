import http from "@/shared/api/http";

export const penaltiesAPI = {
  getSettings: () => http.get("/penalties/settings"),
  getById: (id) => http.get(`/penalties/${id}`),
  getMyPenalties: (params) => http.get("/penalties/my", { params }),
};

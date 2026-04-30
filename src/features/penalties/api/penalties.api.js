import http from "@/shared/api/http";

export const penaltiesAPI = {
  getSettings: () => http.get("/penalties/settings"),
  getById: (id) => http.get(`/penalties/${id}`),
  getMyPenalties: (params) => http.get("/penalties/my", { params }),
  getCategories: (params) => http.get("/penalties/categories", { params }),
  create: (data) =>
    http.post("/penalties", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getGivenPenalties: (params) => http.get("/penalties/given", { params }),
  reduce: (data) => http.post("/penalties/reduce", data),
};

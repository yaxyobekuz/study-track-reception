import http from "@/shared/api/http";

export const leadsAPI = {
  // Leads CRUD
  getAll: (params) => http.get("/leads", { params }),
  getById: (id) => http.get(`/leads/${id}`),
  create: (data) => http.post("/leads", data),
  update: (id, data) => http.put(`/leads/${id}`, data),
  delete: (id) => http.delete(`/leads/${id}`),

  // Lead status
  updateStatus: (id, data) => http.put(`/leads/${id}/status`, data),

  // Lead activities
  getActivities: (id, params) => http.get(`/leads/${id}/activities`, { params }),
  createActivity: (id, data) => http.post(`/leads/${id}/activities`, data),

  // Lead sources
  getSources: (params) => http.get("/leads/sources", { params }),
  createSource: (data) => http.post("/leads/sources", data),
  updateSource: (id, data) => http.put(`/leads/sources/${id}`, data),
  deleteSource: (id) => http.delete(`/leads/sources/${id}`),
};

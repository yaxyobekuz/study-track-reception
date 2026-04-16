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

  // Lead directions
  getDirections: (params) => http.get("/leads/directions", { params }),
  createDirection: (data) => http.post("/leads/directions", data),
  updateDirection: (id, data) => http.put(`/leads/directions/${id}`, data),
  deleteDirection: (id) => http.delete(`/leads/directions/${id}`),

  // Lead categories
  getCategories: (params) => http.get("/leads/categories", { params }),
  createCategory: (data) => http.post("/leads/categories", data),
  updateCategory: (id, data) => http.put(`/leads/categories/${id}`, data),
  deleteCategory: (id) => http.delete(`/leads/categories/${id}`),
};

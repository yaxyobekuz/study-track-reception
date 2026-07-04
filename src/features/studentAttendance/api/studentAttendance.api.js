import http from "@/shared/api/http";

export const studentAttendanceAPI = {
  getClasses: () => http.get("/student-attendance/classes"),
  getTodayClass: (classId) => http.get(`/student-attendance/today/${classId}`),
  mark: (data) => http.post("/student-attendance/mark", data),
  updateRecord: (id, data) => http.put(`/student-attendance/${id}`, data),
  // Barcha aktiv "Kelmaslik sabablari" (o'quvchi bo'yicha filtrlanadi)
  getAbsenceReasons: () => http.get("/absence-reasons/active"),
};

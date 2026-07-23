import http from "@/shared/api/http";

export const holidaysAPI = {
  checkToday: () => http.get("/holidays/check/today"),
};

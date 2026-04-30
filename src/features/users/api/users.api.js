import http from "@/shared/api/http";

export const usersAPI = {
  getAllShort: () => http.get("/users/all-short"),
};

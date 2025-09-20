import { baseUrl } from "@/config";
import axios from "axios";
import { signOut } from "./signOut";

const api = axios.create({
  baseURL: baseUrl || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const status = error?.response?.status;
    if (status === 401 || status === 404) {
      await signOut();
    }
    await Promise.reject(error);
  }
);

export default api;

import {apiService} from "../api/apiService";
import { useNavigate } from "react-router-dom";
export const refreshAccessToken = async () => {
  try {
    console.log("Refresh Token Called")
    const res :any = await apiService.post("auth/refreshToken", {});
    const newAccessToken = res?.accessToken;
    localStorage.setItem("accessToken", newAccessToken);
    return newAccessToken;
  } catch (err) {
    console.log("Auto refresh failed → logout");
    localStorage.clear();
    const navigate = useNavigate();
    navigate("/");
  }
};
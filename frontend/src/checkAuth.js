import { axiosInstance } from "./lib/axios";

export const checkAuth = async () => {
  try {
    const res = await axiosInstance.get("/auth/check-auth", {
      withCredentials: true, // ✅ Ensure cookies are sent
    });
    // console.log("JWT Token:", res.data.token);
    console.log(res.data);

    return { authenticated: res.data.authenticated, user: res.data.user }; // ✅ { authenticated: true/false, token: "jwt_token" }
  } catch (error) {
    console.error("Error checking auth:", error.message);
    return false;
  }
};

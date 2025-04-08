import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { axiosInstance } from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loginData, setloginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setloginData({ ...loginData, [name]: value });
    // console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginData;
    if (!email || !password) {
      return handleError("All fields are required");
    }

    try {
      const res = await axiosInstance.post("/auth/login", loginData, {
        headers: {
          "content-type": "application/json",
        },
      });

      const { message, success, jwtToken, name, error, role } = res.data;
      if (success) {
        handleSuccess(message);
        // localStorage.setItem("jwt", jwtToken);  // jwt cookies mai store ho rahe hai with the help of backend
        localStorage.setItem("loggedInuser", name);

        setTimeout(() => {
          if (user?.role === "admin") {
            navigate("/admin", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        }, 1000);
      }
      // console.log(result);
    } catch (error) {
      const messageFromBackend =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0]?.message ||
        error.message;
      handleError(messageFromBackend);
      console.log(error);
    }
  };

  console.log("logging info", loginData);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="container flex flex-col justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px] ">
        <h1 className="mb-5">login</h1>
        <form onSubmit={handleSubmit} className="form flex flex-col gap-2">
          <div>
            <label htmlFor="email">E-mail</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id=""
              placeholder="Enter your email"
              value={loginData.email}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              onChange={handleChange}
              type="password"
              name="password"
              id=""
              placeholder="Enter your password"
              autoFocus
              value={loginData.password}
            />
          </div>
          <button className="bg-purple-700 text-white border-none text-[20px] rounded-md p-3 cursor-pointer my-2.5 mx-0">
            login
          </button>
          <span>
            Don't have an account?<Link to={"/signup"}>Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Login;

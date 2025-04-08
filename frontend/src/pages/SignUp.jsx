import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";
import { axiosInstance } from "../lib/axios";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setformData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setformData({ ...formData, [name]: value });
    // console.log(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = formData;
    if (!name || !email || !password) {
      return handleError("All fields are required");
    }

    try {
      const res = await axiosInstance.post("/auth/signup", formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      const { message, success, error } = res.data;
      if (success) {
        handleSuccess(message);
        // localStorage.setItem("loggedInuser", name);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
      console.log(res.data);
    } catch (error) {
      const messageFromBackend =
        error.response?.data?.message ||
        error.response?.data?.error?.details?.[0]?.message ||
        error.message;
      handleError(messageFromBackend);
      console.log(messageFromBackend);
    }
  };

  console.log("logging info", formData);

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="container flex flex-col justify-center items-center bg-[#fff] shadow-[8px_8px_24px_0px_rgba(66,68,90,1)] px-8 py-6 rounded-2xl w-full max-w-[400px] ">
        <h1 className="mb-5">SignUp</h1>
        <form onSubmit={handleSubmit} className="form flex flex-col gap-2">
          <div>
            <label htmlFor="name">Name</label>
            <input
              onChange={handleChange}
              type="text"
              name="name"
              id=""
              placeholder="Enter your name"
              autoFocus
              value={formData.name}
            />
          </div>

          <div>
            <label htmlFor="email">E-mail</label>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id=""
              placeholder="Enter your email"
              value={formData.email}
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
              value={formData.password}
            />
          </div>
          <button className="bg-purple-700 text-white border-none text-[20px] rounded-md p-3 cursor-pointer my-2.5 mx-0">
            SignUp
          </button>
          <span>
            Already have an account?<Link to={"/login"}>Login</Link>
          </span>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
};

export default SignUp;

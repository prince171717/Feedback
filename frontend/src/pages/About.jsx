import React from "react";
import { ToastContainer } from "react-toastify";
import { handleSuccess } from "../utils";

const About = () => {
  return (
    <div>
      <button onClick={()=>handleSuccess("toast")}>Test Toast</button>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default About;

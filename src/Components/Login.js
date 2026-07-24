import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import bgVideo from "../assets/Power.mp4";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const url = `${process.env.REACT_APP_URL}/api/auth/login`;
        console.log("REACT_APP_URL =", process.env.REACT_APP_URL);
    console.log("Login URL =", url);
      const res = await axios.post(
        url,
        {
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Login successful!");

        setTimeout(() => {
          navigate("/list");
        }, 800);
      } else {
        toast.error(res.data.message || "Login failed.");
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Something went wrong."
      );
    }
  }

  return (
    <div className="login-page">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="background-video"
      >
        <source src={bgVideo} type="video/mp4" />
      </video>

      <div className="overlay"></div>

      <div className="login-container">
        <h1>Welcome Back</h1>

        <form onSubmit={submit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login
          </button>
        </form>

        <div className="separator">
          <span>OR</span>
        </div>

        <Link to="/signup">
          Create Account
        </Link>
      </div>
    </div>
  );
}

export default Login;
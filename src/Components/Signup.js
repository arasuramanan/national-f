import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

import "./signup.css";
import bgVideo from "../assets/Power.mp4";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    try {
      const url = `${process.env.REACT_APP_URL}/api/auth/signup`;

      const res = await axios.post(
        url,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Account created successfully!");

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(res.data.message || "Signup failed.");
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message || "Unable to create account."
      );
    }
  }

  return (
    <div className="signup-page">
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
        <h1>Create Account</h1>

        <form onSubmit={submit}>
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Signup
          </button>
        </form>

        <div className="separator">
          <span>OR</span>
        </div>

        <Link to="/">
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
}

export default Signup;
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { loginUser } from "../../services/authService";

import Button from "../ui/Button";
import Input from "../ui/Input";

function LoginForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginUser({
        email,
        password,
      });

      console.log("Login Response:", data);

      if (!data.success) {
        alert(data.message || "Login failed");
        return;
      }

      console.log("Saving token...");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      console.log("Token after save:", localStorage.getItem("token"));
      console.log("User after save:", localStorage.getItem("user"));

      alert("Login successful!");

      navigate("/");
    } catch (error) {
      console.error(error);
      alert(error.message || "Login failed");
    }
  };

  
  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-xl shadow-xl"
    >
      <h1 className="text-4xl font-bold text-center mb-8">
        Welcome Back 👋
      </h1>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <Input
        label="Password"
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Button type="submit">
        Login
      </Button>

      <div className="mt-6 text-center">
        <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline"
        >
          Forgot Password?
        </Link>

        <p className="mt-4">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 font-semibold hover:underline"
          >
            Create Account
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;

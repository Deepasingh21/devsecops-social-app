import { useState } from "react";
import { Link } from "react-router-dom";
import API_URL from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");

    if (!email.trim()) {
      setMessage("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        setMessage(
          data.message || "Unable to process request."
        );
        return;
      }

      setMessage(
        "Password reset token generated successfully."
      );

      // Development only.
      if (data.resetToken) {
        console.log(
          "Development reset token:",
          data.resetToken
        );
      }
    } catch (error) {
      console.error("Forgot password error:", error);

      setMessage(
        "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">

      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">

        <h1 className="text-2xl font-bold text-center mb-2">
          Forgot Password
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email to reset your password.
        </p>

        <form onSubmit={handleSubmit}>

          <label className="block font-medium mb-2">
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border rounded-lg p-3 mb-4"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-lg py-3 hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Processing..."
              : "Reset Password"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-gray-600">
            {message}
          </p>
        )}

        <div className="mt-6 text-center">

          <Link
            to="/login"
            className="text-blue-600 hover:underline"
          >
            Back to Login
          </Link>

        </div>

      </div>

    </div>
  );
}

export default ForgotPassword;

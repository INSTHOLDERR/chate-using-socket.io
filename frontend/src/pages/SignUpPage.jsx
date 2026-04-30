import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Minimum 6 characters");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success) signup(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">

      {/* LEFT SIDE */}
      <div className="flex items-center justify-center px-6 py-10 bg-white">
        <div className="w-full max-w-md space-y-6">

          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              Create Account 🚀
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Join and start chatting instantly
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <label className="text-sm font-medium text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Password
              </label>
              <input
                type="password"
                className="w-full mt-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
            </div>

            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              {isSigningUp ? "Loading..." : "Create Account"}
            </button>

          </form>

          <p className="text-sm text-center text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 font-medium">
              Login
            </Link>
          </p>

        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-600">

        <div className="text-center text-white px-10">
          <h2 className="text-4xl font-bold mb-4">
            Join the Community 💬
          </h2>
          <p className="text-lg opacity-90">
            Connect, share, and chat with people around the world.
          </p>

          <img
            src="https://illustrations.popsy.co/white/social-network.svg"
            alt="signup illustration"
            className="mt-10 w-80 mx-auto"
          />
        </div>

      </div>

    </div>
  );
};

export default SignUpPage;
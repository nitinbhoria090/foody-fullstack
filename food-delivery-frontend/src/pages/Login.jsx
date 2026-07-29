import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const justRegistered = location.state?.registered;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/auth/login`,
        form
      );

      if (data.success) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        navigate("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 px-4 py-10 font-sans">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="mb-6 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-lg font-extrabold text-white shadow-md">
            F
          </div>
          <h1 className="mt-3 text-xl font-extrabold tracking-tight text-stone-900">
            Welcome back
          </h1>
          <p className="mt-1 text-xs font-medium text-stone-400">
            Log in to continue ordering
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4"
        >
          {justRegistered && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
              <FiCheckCircle className="h-4 w-4 shrink-0" />
              Account created. Please log in.
            </div>
          )}
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
            >
              Email
            </label>
            <div className="relative flex items-center">
              <FiMail className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="jane@example.com"
                autoComplete="email"
                className="h-11 rounded-xl border-stone-200 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
            >
              Password
            </label>
            <div className="relative flex items-center">
              <FiLock className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                autoComplete="current-password"
                className="h-11 rounded-xl border-stone-200 pl-10 pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3.5 text-stone-400 hover:text-stone-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <FiEyeOff className="h-4 w-4" />
                ) : (
                  <FiEye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
          >
            {loading ? (
              <>
                <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <p className="pt-1 text-center text-xs font-medium text-stone-500">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="font-bold text-orange-600 hover:text-orange-700">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
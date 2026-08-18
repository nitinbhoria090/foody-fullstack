// import { useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";

// function Register() {
//   const navigate = useNavigate();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError("");

//     if (!form.name || !form.email || !form.password) {
//       setError("Please provide all required fields");
//       return;
//     }

//     setLoading(true);
//     try {
//       const { data } = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/auth/register`,
//         form
//       );

//       if (data.success) {
//         navigate("/login", { state: { registered: true } });
//       } else {
//         setError(data.message || "Registration failed");
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || "Server Error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 px-4 py-10 font-sans">
//       <div className="w-full max-w-sm">
//         {/* Brand */}
//         <div className="mb-6 flex flex-col items-center">
//           <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-lg font-extrabold text-white shadow-md">
//             F
//           </div>
//           <h1 className="mt-3 text-xl font-extrabold tracking-tight text-stone-900">
//             Create your account
//           </h1>
//           <p className="mt-1 text-xs font-medium text-stone-400">
//             Sign up to start ordering
//           </p>
//         </div>

//         {/* Card */}
//         <form
//           onSubmit={handleSubmit}
//           className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4"
//         >
//           {error && (
//             <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
//               <FiAlertCircle className="h-4 w-4 shrink-0" />
//               {error}
//             </div>
//           )}

//           {/* Name */}
//           <div>
//             <label
//               htmlFor="name"
//               className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
//             >
//               Name
//             </label>
//             <div className="relative flex items-center">
//               <FiUser className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
//               <Input
//                 id="name"
//                 name="name"
//                 type="text"
//                 value={form.name}
//                 onChange={handleChange}
//                 placeholder="Jane Doe"
//                 autoComplete="name"
//                 className="h-11 rounded-xl border-stone-200 pl-10 text-sm"
//               />
//             </div>
//           </div>

//           {/* Email */}
//           <div>
//             <label
//               htmlFor="email"
//               className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
//             >
//               Email
//             </label>
//             <div className="relative flex items-center">
//               <FiMail className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
//               <Input
//                 id="email"
//                 name="email"
//                 type="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 placeholder="jane@example.com"
//                 autoComplete="email"
//                 className="h-11 rounded-xl border-stone-200 pl-10 text-sm"
//               />
//             </div>
//           </div>

//           {/* Password */}
//           <div>
//             <label
//               htmlFor="password"
//               className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
//             >
//               Password
//             </label>
//             <div className="relative flex items-center">
//               <FiLock className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
//               <Input
//                 id="password"
//                 name="password"
//                 type={showPassword ? "text" : "password"}
//                 value={form.password}
//                 onChange={handleChange}
//                 placeholder="••••••••"
//                 autoComplete="new-password"
//                 className="h-11 rounded-xl border-stone-200 pl-10 pr-10 text-sm"
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword((prev) => !prev)}
//                 className="absolute right-3.5 text-stone-400 hover:text-stone-600"
//                 tabIndex={-1}
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="h-4 w-4" />
//                 ) : (
//                   <FiEye className="h-4 w-4" />
//                 )}
//               </button>
//             </div>
//           </div>

//           <Button
//             type="submit"
//             disabled={loading}
//             className="h-11 w-full rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
//           >
//             {loading ? (
//               <>
//                 <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
//                 Creating account...
//               </>
//             ) : (
//               "Register"
//             )}
//           </Button>

//           <p className="pt-1 text-center text-xs font-medium text-stone-500">
//             Already have an account?{" "}
//             <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
//               Login
//             </Link>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default Register;


















import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiPhone,
  FiTruck,
  FiHash,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    registerAs: "customer",
    vehicleType: "Bike",
    vehicleNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("Please provide all required fields");
      return;
    }

    if (form.registerAs === "rider" && !form.vehicleNumber) {
      setError("Vehicle number is required for riders");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (form.registerAs === "rider") {
        // Rider goes into the separate Rider database
        response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/riders/register`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
            vehicleType: form.vehicleType,
            vehicleNumber: form.vehicleNumber,
          }
        );
      } else {
        // Customer / Admin goes into the User database
        response = await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/api/auth/register`,
          {
            name: form.name,
            email: form.email,
            phone: form.phone,
            password: form.password,
          }
        );
      }

      const data = response.data;

      if (data.success) {
        navigate("/login", { state: { registered: true } });
      } else {
        setError(data.message || "Registration failed");
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
            Create your account
          </h1>
          <p className="mt-1 text-xs font-medium text-stone-400">
            Sign up to start ordering
          </p>
        </div>

        {/* Card */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200/80 bg-white p-6 sm:p-7 shadow-sm space-y-4"
        >
          {error && (
            <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600">
              <FiAlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Register As */}
          <div>
            <label
              htmlFor="registerAs"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
            >
              Register As
            </label>
            <div className="relative">
              <select
                id="registerAs"
                name="registerAs"
                value={form.registerAs}
                onChange={handleChange}
                className="h-11 w-full rounded-xl border border-stone-200 bg-white px-4 text-sm font-medium text-stone-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
              >
                <option value="customer">Customer</option>
                <option value="rider">Rider / Delivery Partner</option>
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
            >
              Name
            </label>
            <div className="relative flex items-center">
              <FiUser className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
              <Input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Jane Doe"
                autoComplete="name"
                className="h-11 rounded-xl border-stone-200 pl-10 text-sm"
              />
            </div>
          </div>

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

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
            >
              Phone
            </label>
            <div className="relative flex items-center">
              <FiPhone className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="98765 43210"
                autoComplete="tel"
                className="h-11 rounded-xl border-stone-200 pl-10 text-sm"
              />
            </div>
          </div>

          {/* Rider-only fields */}
          {form.registerAs === "rider" && (
            <>
              {/* Vehicle Type */}
              <div>
                <label
                  htmlFor="vehicleType"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
                >
                  Vehicle Type
                </label>
                <div className="relative flex items-center">
                  <FiTruck className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
                  <select
                    id="vehicleType"
                    name="vehicleType"
                    value={form.vehicleType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-stone-200 bg-white pl-10 pr-4 text-sm font-medium text-stone-700 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
                  >
                    <option value="Bike">Bike</option>
                    <option value="Scooter">Scooter</option>
                    <option value="Bicycle">Bicycle</option>
                    <option value="Car">Car</option>
                  </select>
                </div>
              </div>

              {/* Vehicle Number */}
              <div>
                <label
                  htmlFor="vehicleNumber"
                  className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700"
                >
                  Vehicle Number
                </label>
                <div className="relative flex items-center">
                  <FiHash className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400" />
                  <Input
                    id="vehicleNumber"
                    name="vehicleNumber"
                    type="text"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="HR12AB3456"
                    className="h-11 rounded-xl border-stone-200 pl-10 text-sm uppercase"
                  />
                </div>
              </div>
            </>
          )}

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
                autoComplete="new-password"
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
                Creating account...
              </>
            ) : (
              "Register"
            )}
          </Button>

          <p className="pt-1 text-center text-xs font-medium text-stone-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-orange-600 hover:text-orange-700">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
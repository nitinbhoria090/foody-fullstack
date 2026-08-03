import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { getData } from "@/context/userContext";

/* ---------- react-icons replacement ---------- */
import {
  FiSearch,
  FiShoppingCart,
  FiBell,
  FiUser,
  FiClock,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { MdOutlineDirectionsBike } from "react-icons/md"; // Bike icon from Material Design icons

/* ---------- nav link sets per role ---------- */
const NAV_LINKS = {
  customer: [
    { label: "Offers", to: "/offers" },
    { label: "Order History", to: "/orders_history" },
  ],
  rider: [
    { label: "Dashboard", to: "/rider/dashboard" },
    { label: "Available Orders", to: "/rider/available" },
    { label: "My Deliveries", to: "/rider/deliveries" },
    { label: "Earnings", to: "/rider/earnings" },
  ],
  admin: [
    { label: "Dashboard", to: "/admin/dashboard" },
    { label: "Restaurants", to: "/admin/restaurants" },
    { label: "Orders", to: "/admin/orders" },
    { label: "Riders", to: "/admin/riders" },
    { label: "Users", to: "/admin/users" },
    { label: "Analytics", to: "/admin/analytics" },
  ],
};

const ROLE_META = {
  customer: { label: "Customer", icon: FiShoppingCart },
  rider: { label: "Rider", icon: MdOutlineDirectionsBike },
  admin: { label: "Admin", icon: FiGrid },
};

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
  withCredentials: true,
});

function useOutsideClose(onClose) {
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [onClose]);
  return ref;
}

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = getData();

  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  const role = user?.role && NAV_LINKS[user.role] ? user.role : "customer";
  const links = NAV_LINKS[role];
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  const profileRef = useOutsideClose(() => setProfileOpen(false));

  const fetchCartCount = useCallback(async () => {
    if (role !== "customer" || !localStorage.getItem("accessToken")) {
      setCartCount(0);
      return;
    }
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/cart`,
        authHeaders(),
      );
      if (res.data?.success) setCartCount(res.data.cart?.totalItems || 0);
    } catch (_) {
      /* keep last known count */
    }
  }, [role]);

  useEffect(() => {
    fetchCartCount();
  }, [fetchCartCount, location.pathname]);

  useEffect(() => {
    window.addEventListener("cart-updated", fetchCartCount);
    return () => window.removeEventListener("cart-updated", fetchCartCount);
  }, [fetchCartCount]);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    window.dispatchEvent(new Event("cart-updated"));
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate("/customer/browse", { state: { initialSearch: query.trim() } });
      setQuery("");
      setMobileOpen(false);
    }
  };

  const homeTo =
    role === "admin" ? "/admin/dashboard" : role === "rider" ? "/rider/dashboard" : "/";

  return (
    <nav className="sticky top-0 z-50 bg-neutral-950 text-orange-50 border-b border-neutral-800 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* ── left: brand + role pill + mobile toggle ── */}
        <div className="flex items-center gap-2 sm:gap-3.5 min-w-0 shrink">
          {/* <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-orange-50 hover:bg-neutral-900 shrink-0"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button> */}

          <Link to={homeTo} className="flex items-center gap-2 no-underline min-w-0 shrink-0">
            <span className="w-[30px] h-[30px] rounded-lg bg-orange-500 text-white flex items-center justify-center font-extrabold text-base shrink-0">
              F
            </span>
            <span className="text-orange-50 font-extrabold text-lg tracking-tight whitespace-nowrap">
              Forkly<span className="text-orange-500">.</span>
            </span>
          </Link>

          {user && (
            <span className="hidden sm:flex items-center gap-1.5 bg-orange-950/60 text-orange-400 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shrink-0">
              <RoleIcon className="w-3.5 h-3.5" />
              {meta.label}
            </span>
          )}
        </div>

        {/* ── center: nav links + search (desktop only) ── */}
        <div className="hidden md:flex items-center gap-7 flex-1 justify-center">
          <ul className="flex list-none gap-6 m-0 p-0">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`text-sm font-semibold no-underline transition-colors ${
                    location.pathname === l.to
                      ? "text-orange-50"
                      : "text-neutral-400 hover:text-orange-50"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {role === "customer" && (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3.5 py-2 w-64"
            >
              <FiSearch className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes"
                className="bg-transparent border-none outline-none text-orange-50 text-sm w-full placeholder:text-neutral-500"
              />
            </form>
          )}
        </div>

        {/* ── right: actions ── */}
        <div className="flex items-center gap-2.5">
          {!user ? (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="text-orange-50 no-underline text-sm font-semibold hover:text-orange-400"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 hover:bg-orange-600 text-white no-underline text-sm font-bold px-4 py-2 rounded-full transition-colors"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <>
              {role === "customer" && (
                <Link
                  to="/cart"
                  aria-label="Cart"
                  className="relative w-9.5 h-9.5 rounded-lg flex items-center justify-center text-orange-50 hover:bg-neutral-900 no-underline"
                >
                  <FiShoppingCart className="w-5 h-5" />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-orange-500 text-white text-[10px] font-extrabold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                      {cartCount > 99 ? "99+" : cartCount}
                    </span>
                  )}
                </Link>
              )}

              <button
                aria-label="Notifications"
                className="w-9.5 h-9.5 rounded-lg flex items-center justify-center text-orange-50 hover:bg-neutral-900"
              >
                <FiBell className="w-4.5 h-4.5" />
              </button>

              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                  className="flex items-center gap-2 bg-transparent border-none cursor-pointer text-orange-50 px-2 py-1.5 rounded-full hover:bg-neutral-900"
                >
                  <span className="w-7.5 h-7.5 rounded-full bg-orange-950/60 text-orange-400 flex items-center justify-center font-extrabold text-sm">
                    {user.name || user.username ? (
                      (user.name || user.username).charAt(0).toUpperCase()
                    ) : (
                      <FiUser className="w-4 h-4" />
                    )}
                  </span>
                  <span className="hidden md:inline text-sm font-semibold">
                    {(user.name || user.username || "Account").split(" ")[0]}
                  </span>
                </button>

                {profileOpen && (
                  <div className="absolute top-[calc(100%+10px)] right-0 w-56 bg-neutral-900 border border-neutral-800 rounded-xl p-2 shadow-2xl">
                    <div className="flex flex-col px-2.5 pt-2 pb-2.5">
                      <span className="text-sm font-bold text-orange-50">
                        {user.name || user.username}
                      </span>
                      <span className="text-xs text-neutral-400 mt-0.5">
                        {user.email}
                      </span>
                    </div>
                    <div className="h-px bg-neutral-800 my-1" />

                    <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-orange-50 no-underline text-sm font-medium hover:bg-neutral-800"
                    >
                      <FiUser className="w-4 h-4" /> My Profile
                    </Link>

                    {role === "customer" && (
                      <>
                        <Link
                          to="/orders_history"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-orange-50 no-underline text-sm font-medium hover:bg-neutral-800"
                        >
                          <FiClock className="w-4 h-4" /> Order History
                        </Link>
                        <Link
                          to="/cart"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-orange-50 no-underline text-sm font-medium hover:bg-neutral-800"
                        >
                          <FiShoppingCart className="w-4 h-4" /> My Cart
                        </Link>
                      </>
                    )}

                    {role === "rider" && (
                      <Link
                        to="/rider/deliveries"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-orange-50 no-underline text-sm font-medium hover:bg-neutral-800"
                      >
                        <MdOutlineDirectionsBike className="w-4 h-4" /> My Deliveries
                      </Link>
                    )}

                    {role === "admin" && (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-orange-50 no-underline text-sm font-medium hover:bg-neutral-800"
                      >
                        <FiGrid className="w-4 h-4" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="h-px bg-neutral-800 my-1" />
                    <button
                      onClick={handleLogout}
                      className="w-full text-left bg-transparent border-none text-orange-400 text-sm font-bold px-2.5 py-2 rounded-lg cursor-pointer hover:bg-neutral-800"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── mobile panel ── */}
      {mobileOpen && (
        <div className="md:hidden border-t border-neutral-800 px-5 pt-3.5 pb-5">
          {role === "customer" && (
            <form
              onSubmit={handleSearchSubmit}
              className="flex items-center gap-2 bg-neutral-900 border border-neutral-800 rounded-full px-3.5 py-2 mb-3"
            >
              <FiSearch className="w-4 h-4 text-neutral-500 shrink-0" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes"
                className="bg-transparent border-none outline-none text-orange-50 text-sm w-full placeholder:text-neutral-500"
              />
            </form>
          )}
          <ul className="list-none m-0 p-0 flex flex-col gap-1">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2.5 text-orange-50 no-underline text-[15px] font-semibold rounded-lg hover:bg-neutral-900"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            {!user && (
              <>
                <li>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-2 py-2.5 text-orange-50 no-underline text-[15px] font-semibold rounded-lg hover:bg-neutral-900"
                  >
                    Log in
                  </Link>
                </li>
                <li>
                  <Link
                    to="/register"
                    onClick={() => setMobileOpen(false)}
                    className="block px-2 py-2.5 text-orange-50 no-underline text-[15px] font-semibold rounded-lg hover:bg-neutral-900"
                  >
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
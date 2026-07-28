import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./css/Navbar.css";

/* ---------- tiny inline icon set (no external deps) ---------- */
const Icon = {
  Search: (p) => (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  ),
  Cart: (p) => (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="9" cy="21" r="1.5" />
      <circle cx="18" cy="21" r="1.5" />
      <path d="M2.5 3h2l2.4 12.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.6L21 7H6" />
    </svg>
  ),
  Bell: (p) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M18 8a6 6 0 0 0-12 0c0 5-2 6-2 6h16s-2-1-2-6" />
      <path d="M10.3 21a1.9 1.9 0 0 0 3.4 0" />
    </svg>
  ),
  User: (p) => (
    <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" />
    </svg>
  ),
  Close: (p) => (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  ),
  Clock: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 3" />
    </svg>
  ),
  Bike: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <circle cx="5.5" cy="17.5" r="3.5" />
      <circle cx="18.5" cy="17.5" r="3.5" />
      <path d="M5.5 17.5L9 8h4l3 5h3.5M9 8L7 5H5" />
    </svg>
  ),
  Grid: (p) => (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" {...p}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
};

/* ---------- nav link sets per role ---------- */
const NAV_LINKS = {
  // customer: [
  //   { label: "Restaurants", to: "/restaurants" },
  //   { label: "Offers", to: "/offers" },
  //   { label: "Order History", to: "/orders" },
  // ],
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
  customer: { label: "Customer", icon: Icon.Cart },
  rider: { label: "Rider", icon: Icon.Bike },
  admin: { label: "Admin", icon: Icon.Grid },
};

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

  const [user, setUser] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) setUser(JSON.parse(stored));

      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const count = Array.isArray(cart)
        ? cart.reduce((sum, item) => sum + (item.qty || 1), 0)
        : 0;
      setCartCount(count);
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const role = user?.role && NAV_LINKS[user.role] ? user.role : "customer";
  const links = NAV_LINKS[role];
  const meta = ROLE_META[role];
  const RoleIcon = meta.icon;

  const profileRef = useOutsideClose(() => setProfileOpen(false));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setProfileOpen(false);
    navigate("/login");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/restaurants?search=${encodeURIComponent(query.trim())}`);
  };

  const homeTo = role === "admin" ? "/admin/dashboard" : role === "rider" ? "/rider/dashboard" : "/";

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        {/* left: brand + mobile toggle */}
        <div style={styles.left}>
                   <Link to={homeTo} style={styles.brand}>
            <span style={styles.brandMark}>F</span>
            <span style={styles.brandText}>
              Forkly<span style={{ color: COLORS.accent }}>.</span>
            </span>
          </Link>

          {user && (
            <span style={styles.rolePill}>
              <RoleIcon />
              {meta.label}
            </span>
          )}
        </div>

        {/* center: nav links (desktop) + search for customers */}
        {/* <div style={styles.center} className="navbar-desktop-only">
          <ul style={styles.linkList}>
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  style={{
                    ...styles.link,
                    ...(location.pathname === l.to ? styles.linkActive : {}),
                  }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {role === "customer" && (
            <form onSubmit={handleSearchSubmit} style={styles.searchForm}>
              <Icon.Search style={{ color: COLORS.textMuted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes"
                style={styles.searchInput}
              />
            </form>
          )}
        </div> */}

        {/* right: actions */}
        <div style={styles.right}>
          {!user ? (
            <div style={styles.authButtons}>
              <Link to="/login" style={styles.loginLink}>
                Log in
              </Link>
              <Link to="/register" style={styles.signupBtn}>
                Sign up
              </Link>
            </div>
          ) : (
            <>
              {role === "customer" && (
                <Link to="/cart" style={styles.cartBtn} aria-label="Cart">
                  <Icon.Cart />
                  {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
                </Link>
              )}

              <button style={styles.iconBtn} aria-label="Notifications">
                <Icon.Bell />
              </button>

              <div style={styles.profileWrap} ref={profileRef}>
                <button
                  style={styles.profileBtn}
                  onClick={() => setProfileOpen((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={profileOpen}
                >
                  <span style={styles.avatar}>
                    {user.name ? user.name.charAt(0).toUpperCase() : <Icon.User />}
                  </span>
                  <span style={styles.profileName} className="navbar-desktop-only">
                    {user.name?.split(" ")[0] || "Account"}
                  </span>
                  {/* <Icon.Chevron style={{ color: COLORS.textMuted }} /> */}
                </button>

                {profileOpen && (
                  <div style={styles.dropdown}>
                    <div style={styles.dropdownHeader}>
                      <span style={styles.dropdownName}>{user.name}</span>
                      <span style={styles.dropdownEmail}>{user.email}</span>
                    </div>
                    <div style={styles.dropdownDivider} />

                    <Link to="/profile" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                      <Icon.User /> My Profile
                    </Link>

                    {role === "customer" && (
                      <>
                        <Link to="/orders" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                          <Icon.Clock /> Order History
                        </Link>
                        <Link to="/cart" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                          <Icon.Cart /> My Cart
                        </Link>
                      </>
                    )}

                    {role === "rider" && (
                      <Link to="/rider/deliveries" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        <Icon.Bike /> My Deliveries
                      </Link>
                    )}

                    {role === "admin" && (
                      <Link to="/admin/dashboard" style={styles.dropdownItem} onClick={() => setProfileOpen(false)}>
                        <Icon.Grid /> Admin Dashboard
                      </Link>
                    )}

                    <div style={styles.dropdownDivider} />
                    <button style={styles.dropdownLogout} onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* mobile panel */}
      {/* {mobileOpen && (
        <div style={styles.mobilePanel}>
          {role === "customer" && (
            <form onSubmit={handleSearchSubmit} style={{ ...styles.searchForm, marginBottom: 12 }}>
              <Icon.Search style={{ color: COLORS.textMuted }} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants or dishes"
                style={styles.searchInput}
              />
            </form>
          )}
          <ul style={styles.mobileLinkList}>
            {links.map((l) => (
              <li key={l.to}>
                <Link to={l.to} style={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
            {!user && (
              <>
                <li>
                  <Link to="/login" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                    Log in
                  </Link>
                </li>
                <li>
                  <Link to="/register" style={styles.mobileLink} onClick={() => setMobileOpen(false)}>
                    Sign up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )} */}
    </nav>
  );
}

/* ---------- design tokens ---------- */
const COLORS = {
  bg: "#1c1410",
  bgLight: "#241a14",
  accent: "#ff5a1f",
  accentSoft: "#3a2416",
  text: "#fdf6ee",
  textMuted: "#b8a897",
  border: "#3a2c22",
};

const styles = {
  nav: {
    background: COLORS.bg,
    color: COLORS.text,
    fontFamily: "system-ui, -apple-system, sans-serif",
    position: "sticky",
    top: 0,
    zIndex: 50,
    borderBottom: `1px solid ${COLORS.border}`,
  },
  inner: {
    maxWidth: 1280,
    margin: "0 auto",
    padding: "0 20px",
    height: 64,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
  },
  left: { display: "flex", alignItems: "center", gap: 14 },
  center: { display: "flex", alignItems: "center", gap: 28, flex: 1, justifyContent: "center" },
  right: { display: "flex", alignItems: "center", gap: 10 },

  brand: { display: "flex", alignItems: "center", gap: 8, textDecoration: "none" },
  brandMark: {
    width: 30,
    height: 30,
    borderRadius: 8,
    background: COLORS.accent,
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 16,
  },
  brandText: { color: COLORS.text, fontWeight: 800, fontSize: 19, letterSpacing: -0.3 },

  rolePill: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: COLORS.accentSoft,
    color: COLORS.accent,
    fontSize: 12,
    fontWeight: 700,
    padding: "5px 10px",
    borderRadius: 999,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  linkList: { display: "flex", listStyle: "none", gap: 22, margin: 0, padding: 0 },
  link: { color: COLORS.textMuted, textDecoration: "none", fontSize: 14.5, fontWeight: 600 },
  linkActive: { color: COLORS.text },

  searchForm: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: COLORS.bgLight,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 999,
    padding: "8px 14px",
    width: 260,
  },
  searchInput: {
    background: "transparent",
    border: "none",
    outline: "none",
    color: COLORS.text,
    fontSize: 13.5,
    width: "100%",
  },

  authButtons: { display: "flex", alignItems: "center", gap: 10 },
  loginLink: { color: COLORS.text, textDecoration: "none", fontSize: 14, fontWeight: 600 },
  signupBtn: {
    background: COLORS.accent,
    color: "#fff",
    textDecoration: "none",
    fontSize: 14,
    fontWeight: 700,
    padding: "9px 16px",
    borderRadius: 999,
  },

  iconBtn: {
    background: "transparent",
    border: "none",
    color: COLORS.text,
    cursor: "pointer",
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  cartBtn: {
    position: "relative",
    color: COLORS.text,
    width: 38,
    height: 38,
    borderRadius: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textDecoration: "none",
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    background: COLORS.accent,
    color: "#fff",
    fontSize: 10,
    fontWeight: 800,
    minWidth: 16,
    height: 16,
    borderRadius: 999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 3px",
  },

  profileWrap: { position: "relative" },
  profileBtn: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    background: "transparent",
    border: "none",
    cursor: "pointer",
    color: COLORS.text,
    padding: "6px 8px",
    borderRadius: 999,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: "50%",
    background: COLORS.accentSoft,
    color: COLORS.accent,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 800,
    fontSize: 13,
  },
  profileName: { fontSize: 13.5, fontWeight: 600 },

  dropdown: {
    position: "absolute",
    top: "calc(100% + 10px)",
    right: 0,
    width: 230,
    background: COLORS.bgLight,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 12,
    padding: 8,
    boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
  },
  dropdownHeader: { display: "flex", flexDirection: "column", padding: "8px 10px 10px" },
  dropdownName: { fontSize: 14, fontWeight: 700, color: COLORS.text },
  dropdownEmail: { fontSize: 12, color: COLORS.textMuted, marginTop: 2 },
  dropdownDivider: { height: 1, background: COLORS.border, margin: "4px 0" },
  dropdownItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    padding: "9px 10px",
    borderRadius: 8,
    color: COLORS.text,
    textDecoration: "none",
    fontSize: 13.5,
    fontWeight: 500,
  },
  dropdownLogout: {
    width: "100%",
    textAlign: "left",
    background: "transparent",
    border: "none",
    color: "#ff7a5c",
    fontSize: 13.5,
    fontWeight: 700,
    padding: "9px 10px",
    borderRadius: 8,
    cursor: "pointer",
  },

  mobilePanel: {
    borderTop: `1px solid ${COLORS.border}`,
    padding: "14px 20px 20px",
  },
  mobileLinkList: { listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 4 },
  mobileLink: {
    display: "block",
    padding: "10px 8px",
    color: COLORS.text,
    textDecoration: "none",
    fontSize: 15,
    fontWeight: 600,
    borderRadius: 8,
  },
};

export default Navbar;
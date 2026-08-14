import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

import {
    FiTruck,
    FiPackage,
    FiStar,
    FiPower,
    FiMapPin,
    FiLogOut,
    FiRefreshCw,
    FiUser,
    FiPhone,
    FiMap,
    FiHome,
    FiMenu,
    FiX
} from "react-icons/fi";

function RiderDashboard() {

    // ==========================================
    // STATES
    // ==========================================

    const [rider, setRider] = useState(null);
    const [stats, setStats] = useState(null);
    const [orders, setOrders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [locationLoading, setLocationLoading] = useState(false);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [delivering, setDelivering] = useState(null);

    // NEW: Sidebar state
    const [activeTab, setActiveTab] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const token = localStorage.getItem("token");

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            setLoading(true);

            const [profileRes, statsRes, ordersRes] = await Promise.all([
                axios.get("http://localhost:5000/api/riders/profile", authHeaders),
                axios.get("http://localhost:5000/api/riders/stats", authHeaders),
                axios.get("http://localhost:5000/api/orders/rider/my-orders", authHeaders)
            ]);

            if (profileRes.data.success) setRider(profileRes.data.rider);
            if (statsRes.data.success) setStats(statsRes.data.stats);
            if (ordersRes.data.success) setOrders(ordersRes.data.orders);

        } catch (error) {
            console.log("Dashboard Error:", error);
            toast.error(error.response?.data?.message || "Failed to load dashboard");
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // REFRESH ORDERS
    // ==========================================

    const fetchOrders = async () => {
        try {
            setOrdersLoading(true);

            const res = await axios.get(
                "http://localhost:5000/api/orders/rider/orders",
                authHeaders
            );

            if (res.data.success) {
                setOrders(res.data.orders || []);
            }

        } catch (error) {
            console.log("Orders Error:", error);
            toast.error(error.response?.data?.message || "Failed to load orders");
        } finally {
            setOrdersLoading(false);
        }
    };

    // ==========================================
    // ONLINE / OFFLINE
    // ==========================================

    const toggleAvailability = async () => {
        if (!stats) return;

        try {
            setUpdating(true);

            const newStatus = !stats.isAvailable;

            const res = await axios.put(
                "http://localhost:5000/api/riders/availability",
                { isAvailable: newStatus },
                authHeaders
            );

            if (res.data.success) {
                setStats((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
                setRider((prev) => ({ ...prev, isAvailable: res.data.isAvailable }));
                toast.success(res.data.message);
            }

        } catch (error) {
            console.log("Availability Error:", error);
            toast.error(error.response?.data?.message || "Failed to update availability");
        } finally {
            setUpdating(false);
        }
    };

    // ==========================================
    // MARK DELIVERED
    // ==========================================

    const markDelivered = async (orderId) => {
        try {
            setDelivering(orderId);

            const res = await axios.put(
                `http://localhost:5000/api/orders/${orderId}/deliver`,
                {},
                authHeaders
            );

            if (res.data.success) {
                toast.success("Order marked as delivered");

                setOrders((prevOrders) =>
                    prevOrders.filter((order) => order._id !== orderId)
                );

                setStats((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        activeOrders: Math.max((prev.activeOrders || 1) - 1, 0),
                        deliveredOrders: (prev.deliveredOrders || 0) + 1,
                        totalDeliveries: (prev.totalDeliveries || 0) + 1,
                    };
                });
            }

        } catch (error) {
            console.log("Mark Delivered Error:", error);
            toast.error(error.response?.data?.message || "Failed to mark order as delivered");
        } finally {
            setDelivering(null);
        }
    };

    // ==========================================
    // UPDATE LOCATION
    // ==========================================

    const updateLocation = () => {
        if (!navigator.geolocation) {
            toast.error("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;

                    const res = await axios.put(
                        "http://localhost:5000/api/riders/location",
                        { lat, lng },
                        authHeaders
                    );

                    if (res.data.success) {
                        setRider((prev) => ({ ...prev, currentLocation: res.data.location }));

                        setStats((prev) => {
                            if (!prev) return prev;
                            return { ...prev, currentLocation: res.data.location };
                        });

                        toast.success("Location updated successfully");
                    }

                } catch (error) {
                    console.log("Location Update Error:", error);
                    toast.error(error.response?.data?.message || "Failed to update location");
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.log("Geolocation Error:", error);
                setLocationLoading(false);

                if (error.code === 1) {
                    toast.error("Please allow location permission");
                } else if (error.code === 2) {
                    toast.error("Location is unavailable");
                } else if (error.code === 3) {
                    toast.error("Location request timed out");
                } else {
                    toast.error("Unable to get your location");
                }
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
    };

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("rider");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        window.location.href = "/login";
    };

    // ==========================================
    // SIDEBAR NAV ITEMS
    // ==========================================

    const navItems = [
        { key: "dashboard", label: "Dashboard", icon: <FiHome /> },
        { key: "orders", label: "My Orders", icon: <FiPackage /> },
        { key: "profile", label: "Profile", icon: <FiUser /> },
        { key: "location", label: "Location", icon: <FiMapPin /> },
    ];

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin mx-auto mb-3 h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
                    <p className="text-orange-500 font-bold">Loading Dashboard...</p>
                </div>
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* =====================================
                SIDEBAR (Desktop)
            ===================================== */}

            <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-gray-200 fixed h-screen">

                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-extrabold text-orange-600">
                        Rider Panel
                    </h1>
                    <p className="text-sm text-gray-500 mt-1 truncate">
                        {rider?.name || "Rider"}
                    </p>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1">
                    {navItems.map((item) => (
                        <button
                            key={item.key}
                            onClick={() => setActiveTab(item.key)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                                activeTab === item.key
                                    ? "bg-orange-100 text-orange-600"
                                    : "text-gray-500 hover:bg-gray-50"
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-3 border-t border-gray-100">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition"
                    >
                        <FiLogOut />
                        Logout
                    </button>
                </div>

            </aside>

            {/* =====================================
                MOBILE SIDEBAR (Drawer)
            ===================================== */}

            {sidebarOpen && (
                <div className="lg:hidden fixed inset-0 z-40 flex">

                    <div
                        className="fixed inset-0 bg-black/40"
                        onClick={() => setSidebarOpen(false)}
                    />

                    <aside className="relative w-64 bg-white h-full flex flex-col z-50">

                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <div>
                                <h1 className="text-xl font-extrabold text-orange-600">
                                    Rider Panel
                                </h1>
                                <p className="text-sm text-gray-500 mt-1 truncate">
                                    {rider?.name || "Rider"}
                                </p>
                            </div>

                            <button onClick={() => setSidebarOpen(false)}>
                                <FiX size={22} />
                            </button>
                        </div>

                        <nav className="flex-1 px-3 py-4 space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.key}
                                    onClick={() => {
                                        setActiveTab(item.key);
                                        setSidebarOpen(false);
                                    }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition ${
                                        activeTab === item.key
                                            ? "bg-orange-100 text-orange-600"
                                            : "text-gray-500 hover:bg-gray-50"
                                    }`}
                                >
                                    {item.icon}
                                    {item.label}
                                </button>
                            ))}
                        </nav>

                        <div className="p-3 border-t border-gray-100">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm text-red-500 hover:bg-red-50 transition"
                            >
                                <FiLogOut />
                                Logout
                            </button>
                        </div>

                    </aside>

                </div>
            )}

            {/* =====================================
                MAIN CONTENT
            ===================================== */}

            <div className="flex-1 lg:ml-64">

                {/* Mobile top bar */}
                <header className="lg:hidden bg-gradient-to-r from-orange-500 to-red-500 text-white sticky top-0 z-30">
                    <div className="px-5 py-4 flex items-center justify-between">
                        <button onClick={() => setSidebarOpen(true)}>
                            <FiMenu size={22} />
                        </button>
                        <h1 className="text-lg font-bold">Rider Dashboard</h1>
                        <button onClick={logout}>
                            <FiLogOut size={20} />
                        </button>
                    </div>
                </header>

                {/* Desktop top bar */}
                <header className="hidden lg:block bg-gradient-to-r from-orange-500 to-red-500 text-white">
                    <div className="px-8 py-6">
                        <h1 className="text-2xl font-bold">
                            {navItems.find((n) => n.key === activeTab)?.label}
                        </h1>
                        <p className="text-orange-100 mt-1">
                            Welcome back, {rider?.name || "Rider"} 👋
                        </p>
                    </div>
                </header>

                <main className="max-w-6xl mx-auto px-5 py-8">

                    {/* =====================================
                        TAB: DASHBOARD
                    ===================================== */}

                    {activeTab === "dashboard" && (
                        <>
                            {/* RIDER STATUS */}
                            <div className="bg-white rounded-2xl shadow-sm p-5 mb-8">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

                                    <div className="flex items-center gap-4">
                                        <div className={`p-3 rounded-full ${
                                            stats?.isAvailable
                                                ? "bg-green-100 text-green-600"
                                                : "bg-gray-100 text-gray-500"
                                        }`}>
                                            <FiPower size={22} />
                                        </div>

                                        <div>
                                            <h2 className="font-bold text-lg">Rider Status</h2>
                                            <p className="text-gray-500 text-sm">
                                                {stats?.isAvailable
                                                    ? "You are currently online"
                                                    : "You are currently offline"}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={toggleAvailability}
                                        disabled={updating}
                                        className={`px-6 py-3 rounded-xl font-semibold text-white transition ${
                                            stats?.isAvailable
                                                ? "bg-red-500 hover:bg-red-600"
                                                : "bg-green-500 hover:bg-green-600"
                                        }`}
                                    >
                                        {updating ? "Updating..." : stats?.isAvailable ? "Go Offline" : "Go Online"}
                                    </button>

                                </div>
                            </div>

                            {/* STATS */}
                            <div className="grid md:grid-cols-3 gap-6">

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500">Active Orders</p>
                                            <h2 className="text-3xl font-bold mt-2">{stats?.activeOrders || 0}</h2>
                                        </div>
                                        <div className="bg-orange-100 text-orange-600 p-4 rounded-xl">
                                            <FiPackage size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500">Total Deliveries</p>
                                            <h2 className="text-3xl font-bold mt-2">{stats?.totalDeliveries || 0}</h2>
                                        </div>
                                        <div className="bg-blue-100 text-blue-600 p-4 rounded-xl">
                                            <FiTruck size={25} />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm p-6">
                                    <div className="flex justify-between">
                                        <div>
                                            <p className="text-gray-500">Rating</p>
                                            <h2 className="text-3xl font-bold mt-2">{stats?.rating || 0} ⭐</h2>
                                        </div>
                                        <div className="bg-yellow-100 text-yellow-600 p-4 rounded-xl">
                                            <FiStar size={25} />
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </>
                    )}

                    {/* =====================================
                        TAB: ORDERS
                    ===================================== */}

                    {activeTab === "orders" && (
                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-bold">My Active Orders</h2>
                                    <p className="text-sm text-gray-500 mt-1">Orders assigned to you</p>
                                </div>

                                <button
                                    onClick={fetchOrders}
                                    disabled={ordersLoading}
                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100 text-orange-600 font-semibold hover:bg-orange-200 disabled:opacity-50"
                                >
                                    <FiRefreshCw className={ordersLoading ? "animate-spin" : ""} />
                                    Refresh
                                </button>
                            </div>

                            {orders.length === 0 ? (
                                <div className="text-center py-10">
                                    <FiPackage size={45} className="mx-auto text-gray-300 mb-3" />
                                    <h3 className="font-semibold text-gray-600">No Active Orders</h3>
                                    <p className="text-sm text-gray-400 mt-1">
                                        Orders assigned to you will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {orders.map((order) => (
                                        <div
                                            key={order._id}
                                            className="border border-gray-200 rounded-2xl p-5 hover:shadow-md transition"
                                        >

                                            <div className="flex flex-col md:flex-row justify-between gap-4 mb-5">
                                                <div>
                                                    <p className="text-sm text-gray-500">Order ID</p>
                                                    <h3 className="font-bold text-lg">
                                                        #{order._id.slice(-8).toUpperCase()}
                                                    </h3>
                                                </div>

                                                <span className={`px-4 py-2 rounded-full text-sm font-semibold self-start ${
                                                    order.orderStatus === "Rider Assigned"
                                                        ? "bg-blue-100 text-blue-600"
                                                        : "bg-orange-100 text-orange-600"
                                                }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-5">

                                                <div className="flex items-start gap-3">
                                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
                                                        <FiUser />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Customer</p>
                                                        <p className="font-semibold">{order.user?.name || "Customer"}</p>
                                                        <p className="text-sm text-gray-500">{order.user?.email || ""}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start gap-3">
                                                    <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                                                        <FiPhone />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-500">Customer Phone</p>
                                                        <p className="font-semibold">
                                                            {order.address?.phone || order.address?.mobile || "Not available"}
                                                        </p>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="mt-5 p-4 bg-gray-50 rounded-xl">
                                                <div className="flex items-start gap-3">
                                                    <FiMapPin className="text-red-500 mt-1" size={20} />
                                                    <div>
                                                        <p className="font-semibold">Delivery Address</p>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {order.address?.address ||
                                                                order.address?.fullAddress ||
                                                                order.address?.street ||
                                                                "Address not available"}
                                                        </p>
                                                        {order.address?.city && (
                                                            <p className="text-sm text-gray-500">
                                                                {order.address.city}
                                                                {order.address.state ? `, ${order.address.state}` : ""}
                                                                {order.address.pincode ? ` - ${order.address.pincode}` : ""}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <p className="font-semibold mb-3">Order Items</p>
                                                <div className="space-y-2">
                                                    {order.items?.map((item, index) => (
                                                        <div
                                                            key={index}
                                                            className="flex justify-between items-center bg-gray-50 rounded-lg px-4 py-3"
                                                        >
                                                            <div>
                                                                <p className="font-medium">{item.name}</p>
                                                                <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                                            </div>
                                                            <p className="font-semibold">₹{item.price * item.quantity}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="mt-5 pt-5 border-t flex flex-col sm:flex-row justify-between gap-4">
                                                <div>
                                                    <p className="text-sm text-gray-500">Payment</p>
                                                    <p className="font-semibold">{order.paymentMethod}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Items</p>
                                                    <p className="font-semibold">{order.totalItems}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-gray-500">Total Amount</p>
                                                    <p className="text-xl font-bold text-orange-500">₹{order.totalPrice}</p>
                                                </div>
                                            </div>

                                            {order.address && (
                                                <button
                                                    onClick={() => {
                                                        const addressText =
                                                            `${order.address.address || ""} ${order.address.city || ""} ${order.address.pincode || ""}`;
                                                        window.open(
                                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addressText)}`,
                                                            "_blank"
                                                        );
                                                    }}
                                                    className="mt-5 w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold"
                                                >
                                                    <FiMap />
                                                    Open Delivery Location
                                                </button>
                                            )}

                                            {order.orderStatus !== "Delivered" && (
                                                <button
                                                    onClick={() => markDelivered(order._id)}
                                                    disabled={delivering === order._id}
                                                    className="mt-3 w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {delivering === order._id ? (
                                                        <>
                                                            <FiRefreshCw className="animate-spin" />
                                                            Marking as Delivered...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiPackage />
                                                            Mark as Delivered
                                                        </>
                                                    )}
                                                </button>
                                            )}

                                        </div>
                                    ))}
                                </div>
                            )}

                        </div>
                    )}

                    {/* =====================================
                        TAB: PROFILE
                    ===================================== */}

                    {activeTab === "profile" && (
                        <div className="bg-white rounded-2xl shadow-sm p-6">

                            <h2 className="text-xl font-bold mb-5">Rider Information</h2>

                            <div className="grid md:grid-cols-2 gap-5">

                                <div>
                                    <p className="text-sm text-gray-500">Name</p>
                                    <p className="font-semibold">{rider?.name || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{rider?.email || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Phone</p>
                                    <p className="font-semibold">{rider?.phone || "-"}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Vehicle</p>
                                    <p className="font-semibold">
                                        {rider?.vehicleType || "-"}{" "}
                                        {rider?.vehicleNumber ? `- ${rider.vehicleNumber}` : ""}
                                    </p>
                                </div>

                            </div>
                        </div>
                    )}

                    {/* =====================================
                        TAB: LOCATION
                    ===================================== */}

                    {activeTab === "location" && (
                        <div className="bg-white rounded-2xl shadow-sm p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-5">

                                <div className="flex items-center gap-3">
                                    <div className="bg-red-100 text-red-500 p-3 rounded-xl">
                                        <FiMapPin size={22} />
                                    </div>
                                    <div>
                                        <h2 className="font-bold">Current Location</h2>
                                        <p className="text-sm text-gray-500">
                                            {rider?.currentLocation?.lat !== null &&
                                            rider?.currentLocation?.lat !== undefined
                                                ? `${rider.currentLocation.lat}, ${rider.currentLocation.lng}`
                                                : "Location not available"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={updateLocation}
                                    disabled={locationLoading}
                                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                >
                                    <FiRefreshCw className={locationLoading ? "animate-spin" : ""} />
                                    {locationLoading ? "Updating..." : "Update Location"}
                                </button>

                            </div>
                        </div>
                    )}

                </main>

            </div>

        </div>
    );
}

export default RiderDashboard;
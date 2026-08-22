import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import {
    FiPackage,
    FiUser,
    FiTruck,
    FiMapPin,
    FiRefreshCw,
} from "react-icons/fi";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [riders, setRiders] = useState([]);

    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    const token = localStorage.getItem("token");

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };


    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // FIXED: Changed double quotes to backticks here
            const [ordersRes, ridersRes] = await Promise.all([
                axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/orders`,
                    authHeaders
                ),

                axios.get(
                    `${import.meta.env.VITE_APP_API_URL}/api/orders/riders`,
                    authHeaders
                ),
            ]);

            if (ordersRes.data.success) {
                setOrders(ordersRes.data.orders);
            }

            if (ridersRes.data.success) {
                setRiders(ridersRes.data.riders);
            }

        } catch (error) {
            console.log("Admin Orders Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load orders"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // ASSIGN RIDER
    // ==========================================

    const assignRider = async (orderId, riderId) => {
        if (!riderId) return;

        try {
            setAssigning(orderId);

            const res = await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/orders/${orderId}/assign-rider`,
                {
                    riderId,
                },
                authHeaders
            );

            if (res.data.success) {
                toast.success("Rider assigned successfully");

                // Update only this order
                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? res.data.order
                            : order
                    )
                );

                // Refresh riders because availability may change later
                fetchRiders();
            }

        } catch (error) {
            console.log("Assign Rider Error:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to assign rider"
            );
        } finally {
            setAssigning(null);
        }
    };

    // ==========================================
    // FETCH RIDERS
    // ==========================================

    const fetchRiders = async () => {
        try {
            // FIXED: Changed double quotes to backticks here
            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/orders/riders`,
                authHeaders
            );

            if (res.data.success) {
                setRiders(res.data.riders);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    const updateStatus = async (orderId, status) => {
        try {
            const res = await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/orders/${orderId}/status`,
                {
                    orderStatus: status,
                },
                authHeaders
            );

            if (res.data.success) {
                toast.success("Order status updated");

                setOrders((prevOrders) =>
                    prevOrders.map((order) =>
                        order._id === orderId
                            ? res.data.order
                            : order
                    )
                );
            }

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to update status"
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <FiRefreshCw
                        className="animate-spin mx-auto text-orange-500"
                        size={30}
                    />

                    <p className="mt-3 font-semibold text-gray-600">
                        Loading orders...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================
    // UI
    // ==========================================

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <header className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <div className="max-w-7xl mx-auto px-5 py-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Order Management
                            </h1>
                            <p className="text-orange-100 mt-1">
                                Manage orders and assign riders
                            </p>
                        </div>
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-xl hover:bg-white/30"
                        >
                            <FiRefreshCw />
                            Refresh
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-5 py-8">
                {/* ORDER COUNT */}
                <div className="mb-6 flex items-center gap-3">
                    <div className="bg-orange-100 text-orange-600 p-3 rounded-xl">
                        <FiPackage size={22} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">
                            All Orders
                        </h2>
                        <p className="text-sm text-gray-500">
                            {orders.length} total orders
                        </p>
                    </div>
                </div>

                {/* NO ORDERS */}
                {orders.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
                        <FiPackage
                            className="mx-auto text-gray-300"
                            size={50}
                        />
                        <h2 className="text-lg font-bold mt-4">
                            No Orders Found
                        </h2>
                        <p className="text-gray-500 mt-1">
                            There are no orders yet.
                        </p>
                    </div>
                )}

                {/* ORDERS */}
                <div className="space-y-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
                        >
                            {/* ORDER HEADER */}
                            <div className="p-5 border-b border-gray-100">
                                <div className="flex flex-col md:flex-row justify-between gap-4">
                                    <div>
                                        <p className="text-xs text-gray-400 font-medium">
                                            Order ID
                                        </p>
                                        <p className="font-semibold text-gray-800">
                                            #{order._id.slice(-8).toUpperCase()}
                                        </p>

                                        <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                            <FiUser size={14} />
                                            <span>
                                                {order.user?.name || "N/A"} (
                                                {order.user?.email || "N/A"})
                                            </span>
                                        </div>

                                        <div className="flex items-start gap-2 mt-1 text-sm text-gray-600">
                                            <FiMapPin size={14} className="mt-0.5" />
                                            <span>
                                                {order.deliveryAddress
                                                    ? `${order.deliveryAddress.street || ""}, ${
                                                          order.deliveryAddress.city || ""
                                                      }`
                                                    : "No address"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-left md:text-right">
                                        <p className="text-xs text-gray-400 font-medium">
                                            Total Amount
                                        </p>
                                        <p className="font-bold text-lg text-orange-600">
                                            ₹{order.totalAmount ?? 0}
                                        </p>

                                        <span
                                            className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-semibold ${
                                                order.orderStatus === "delivered"
                                                    ? "bg-green-100 text-green-700"
                                                    : order.orderStatus === "cancelled"
                                                    ? "bg-red-100 text-red-700"
                                                    : "bg-yellow-100 text-yellow-700"
                                            }`}
                                        >
                                            {order.orderStatus || "pending"}
                                        </span>
                                    </div>
                                </div>

                                {/* ITEMS */}
                                {order.items && order.items.length > 0 && (
                                    <div className="mt-4 border-t border-gray-100 pt-3">
                                        <p className="text-xs text-gray-400 font-medium mb-1">
                                            Items
                                        </p>
                                        <ul className="text-sm text-gray-700 space-y-1">
                                            {order.items.map((item, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex justify-between"
                                                >
                                                    <span>
                                                        {item.name} × {item.quantity}
                                                    </span>
                                                    <span>
                                                        ₹{item.price * item.quantity}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* STATUS + RIDER CONTROLS */}
                                <div className="mt-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                                    <div className="flex items-center gap-2">
                                        <FiTruck className="text-gray-500" />
                                        <select
                                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                            value={order.rider?._id || ""}
                                            onChange={(e) =>
                                                assignRider(order._id, e.target.value)
                                            }
                                            disabled={assigning === order._id}
                                        >
                                            <option value="">
                                                {assigning === order._id
                                                    ? "Assigning..."
                                                    : "Assign Rider"}
                                            </option>
                                            {riders.map((rider) => (
                                                <option key={rider._id} value={rider._id}>
                                                    {rider.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <select
                                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                                        value={order.orderStatus || "pending"}
                                        onChange={(e) =>
                                            updateStatus(order._id, e.target.value)
                                        }
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="confirmed">Confirmed</option>
                                        <option value="preparing">Preparing</option>
                                        <option value="out for delivery">
                                            Out for Delivery
                                        </option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default AdminOrders;
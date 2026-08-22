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

            const [ordersRes, ridersRes] = await Promise.all([
                axios.get(
                    "${import.meta.env.VITE_APP_API_URL}/api/orders",
                    authHeaders
                ),

                axios.get(
                    "${import.meta.env.VITE_APP_API_URL}/api/orders/riders",
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
            const res = await axios.get(
                "${import.meta.env.VITE_APP_API_URL}/api/orders/riders",
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

                                        <div className="flex items-center gap-2">

                                            <FiPackage className="text-orange-500" />

                                            <h3 className="font-bold text-lg">
                                                Order #{order._id.slice(-6)}
                                            </h3>

                                        </div>

                                        <p className="text-sm text-gray-500 mt-1">
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleString()}
                                        </p>

                                    </div>


                                    {/* STATUS */}

                                    <select
                                        value={order.orderStatus}
                                        onChange={(e) =>
                                            updateStatus(
                                                order._id,
                                                e.target.value
                                            )
                                        }
                                        className="border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold outline-none focus:border-orange-500"
                                    >

                                        <option value="Pending">
                                            Pending
                                        </option>

                                        <option value="Preparing">
                                            Preparing
                                        </option>

                                        <option value="Rider Assigned">
                                            Rider Assigned
                                        </option>

                                        <option value="Out For Delivery">
                                            Out For Delivery
                                        </option>

                                        <option value="Delivered">
                                            Delivered
                                        </option>

                                        <option value="Cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>


                            {/* ORDER BODY */}

                            <div className="p-5">

                                <div className="grid lg:grid-cols-3 gap-6">


                                    {/* CUSTOMER */}

                                    <div>

                                        <div className="flex items-center gap-2 mb-3">

                                            <FiUser className="text-orange-500" />

                                            <h4 className="font-bold">
                                                Customer
                                            </h4>

                                        </div>

                                        <p className="font-semibold">
                                            {order.user?.name || "-"}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.user?.email || "-"}
                                        </p>

                                    </div>


                                    {/* ADDRESS */}

                                    <div>

                                        <div className="flex items-center gap-2 mb-3">

                                            <FiMapPin className="text-red-500" />

                                            <h4 className="font-bold">
                                                Delivery Address
                                            </h4>

                                        </div>

                                        {order.address ? (
                                            <div className="text-sm text-gray-600">

                                                <p>
                                                    {order.address.address ||
                                                        order.address.street ||
                                                        ""}
                                                </p>

                                                <p>
                                                    {order.address.city || ""}
                                                </p>

                                                <p>
                                                    {order.address.state || ""}
                                                    {" "}
                                                    {order.address.pincode || ""}
                                                </p>

                                            </div>
                                        ) : (
                                            <p className="text-gray-400">
                                                Address unavailable
                                            </p>
                                        )}

                                    </div>


                                    {/* ORDER TOTAL */}

                                    <div>

                                        <div className="flex items-center gap-2 mb-3">

                                            <FiPackage className="text-blue-500" />

                                            <h4 className="font-bold">
                                                Order Details
                                            </h4>

                                        </div>

                                        <p className="text-sm text-gray-500">
                                            Items:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {order.totalItems}
                                            </span>
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            Payment:{" "}
                                            <span className="font-semibold text-gray-800">
                                                {order.paymentMethod}
                                            </span>
                                        </p>

                                        <p className="text-xl font-bold text-orange-600 mt-2">
                                            ₹{order.totalPrice}
                                        </p>

                                    </div>

                                </div>


                                {/* RIDER SECTION */}

                                <div className="mt-6 border-t border-gray-100 pt-5">

                                    <div className="flex items-center gap-2 mb-4">

                                        <FiTruck className="text-green-600" />

                                        <h4 className="font-bold text-lg">
                                            Delivery Rider
                                        </h4>

                                    </div>


                                    {order.assignedRider ? (

                                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                                <div>

                                                    <p className="font-bold text-green-800">
                                                        {order.riderName}
                                                    </p>

                                                    <p className="text-sm text-green-700">
                                                        {order.riderPhone}
                                                    </p>

                                                    <p className="text-xs text-green-600 mt-1">
                                                        Rider assigned
                                                    </p>

                                                </div>


                                                <div className="text-sm text-green-700">

                                                    <span className="font-semibold">
                                                        Location:
                                                    </span>{" "}

                                                    {order.riderLocation?.lat
                                                        ? `${order.riderLocation.lat}, ${order.riderLocation.lng}`
                                                        : "Not available"
                                                    }

                                                </div>

                                            </div>

                                        </div>

                                    ) : (

                                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">

                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                                                <div>

                                                    <p className="font-semibold text-orange-800">
                                                        No rider assigned
                                                    </p>

                                                    <p className="text-sm text-orange-600">
                                                        Select an available rider
                                                    </p>

                                                </div>


                                                <select
                                                    defaultValue=""
                                                    disabled={
                                                        assigning === order._id
                                                    }
                                                    onChange={(e) =>
                                                        assignRider(
                                                            order._id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full md:w-72 border border-orange-200 rounded-xl px-4 py-3 bg-white text-sm font-semibold outline-none focus:border-orange-500"
                                                >

                                                    <option value="">
                                                        {assigning === order._id
                                                            ? "Assigning..."
                                                            : "Select Rider"
                                                        }
                                                    </option>

                                                    {riders.map((rider) => (

                                                        <option
                                                            key={rider._id}
                                                            value={rider._id}
                                                        >
                                                            {rider.name} -{" "}
                                                            {rider.vehicleNumber}
                                                        </option>

                                                    ))}

                                                </select>

                                            </div>

                                        </div>

                                    )}

                                </div>


                                {/* ITEMS */}

                                <div className="mt-6 border-t border-gray-100 pt-5">

                                    <h4 className="font-bold mb-3">
                                        Ordered Items
                                    </h4>

                                    <div className="space-y-2">

                                        {order.items?.map((item, index) => (

                                            <div
                                                key={index}
                                                className="flex justify-between items-center bg-gray-50 rounded-xl px-4 py-3"
                                            >

                                                <div>

                                                    <p className="font-semibold text-sm">
                                                        {item.name}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        Qty: {item.quantity}
                                                    </p>

                                                </div>

                                                <p className="font-semibold">
                                                    ₹{item.price * item.quantity}
                                                </p>

                                            </div>

                                        ))}

                                    </div>

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
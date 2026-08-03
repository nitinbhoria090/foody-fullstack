import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/axios";
import { toast } from "sonner";

import { FiArrowLeft, FiPackage, FiMapPin, FiChevronRight } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

const statusStyles = {
    Pending: "bg-amber-100 text-amber-700",
    Preparing: "bg-blue-100 text-blue-700",
    "Out For Delivery": "bg-purple-100 text-purple-700",
    Delivered: "bg-green-100 text-green-700",
    Cancelled: "bg-red-100 text-red-700",
};

function Orders_history() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = async () => {
        try {
            setLoading(true);

            const res = await API.get("/orders/my-orders", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (res.data.success) {
                setOrders(res.data.orders || []);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-stone-50">
                <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-stone-50 pb-10 font-sans">
            {/* ── Header ── */}
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
                <div className="mx-auto max-w-3xl">
                    <button
                        onClick={() => navigate("/")}
                        className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
                    >
                        <FiArrowLeft className="h-3.5 w-3.5" />
                        Back to Menu
                    </button>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
                        My Orders
                    </h1>
                    <p className="mt-1 text-xs sm:text-sm text-orange-100">
                        {orders.length === 0
                            ? "No orders yet"
                            : `${orders.length} ${orders.length === 1 ? "order" : "orders"} placed`}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 pt-6">
                {orders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
                        <FiPackage className="h-10 w-10 text-stone-300" />
                        <p className="mt-3 text-sm font-semibold text-stone-600">
                            You haven't placed any orders yet
                        </p>
                        <button
                            onClick={() => navigate("/")}
                            className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
                        >
                            Browse Menu
                        </button>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order._id}
                               onClick={() => navigate(`/order-tracking/${order._id}`)}
                                className="cursor-pointer rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm hover:border-orange-300 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold text-stone-400">
                                            Order #{order._id.slice(-8).toUpperCase()}
                                        </p>
                                        <p className="mt-0.5 text-xs text-stone-400">
                                            {new Date(order.createdAt).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${statusStyles[order.orderStatus] || "bg-stone-100 text-stone-600"
                                            }`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                </div>

                                <div className="mt-3 space-y-1 border-t border-stone-100 pt-3">
                                    {order.items.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex items-center justify-between text-xs text-stone-600"
                                        >
                                            <span className="truncate">
                                                {item.name} x {item.quantity}
                                            </span>
                                            <span className="font-medium text-stone-700">
                                                ₹{item.price * item.quantity}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {order.address && (
                                    <div className="mt-3 flex items-start gap-1.5 border-t border-stone-100 pt-3 text-xs text-stone-500">
                                        <FiMapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-stone-400" />
                                        <span className="truncate">
                                            {order.address.addressLine1}, {order.address.city},{" "}
                                            {order.address.state} - {order.address.postalCode}
                                        </span>
                                    </div>
                                )}

                                <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                                    <div>
                                        <p className="text-[11px] text-stone-400">
                                            {order.paymentMethod} ·{" "}
                                            <span
                                                className={
                                                    order.paymentStatus === "Paid"
                                                        ? "text-green-600 font-semibold"
                                                        : "text-amber-600 font-semibold"
                                                }
                                            >
                                                {order.paymentStatus}
                                            </span>
                                        </p>
                                        <p className="text-sm font-bold text-stone-900">
                                            ₹{order.totalPrice}
                                        </p>
                                    </div>
                                    <FiChevronRight className="h-4 w-4 text-stone-300" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Orders_history;
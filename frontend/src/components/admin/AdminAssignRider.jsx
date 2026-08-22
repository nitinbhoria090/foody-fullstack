import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";

function AdminAssignRider() {
    const [orders, setOrders] = useState([]);
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigning, setAssigning] = useState(null);

    const token = localStorage.getItem("token");

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`
        }
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
                    "${import.meta.env.VITE_APP_API_URL}/api/riders/available",
                    authHeaders
                )
            ]);

            if (ordersRes.data.success) {
                setOrders(ordersRes.data.orders || []);
            }

            if (ridersRes.data.success) {
                setRiders(ridersRes.data.riders || []);
            }

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load data"
            );
        } finally {
            setLoading(false);
        }
    };

    const assignRider = async (orderId, riderId) => {
        try {
            setAssigning(orderId);

            const res = await axios.put(
                `${import.meta.env.VITE_APP_API_URL}/api/orders/${orderId}/assign-rider`,
                {
                    riderId
                },
                authHeaders
            );

            if (res.data.success) {
                toast.success("Rider assigned successfully");

                // Refresh orders
                fetchData();
            }

        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                "Failed to assign rider"
            );
        } finally {
            setAssigning(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="font-semibold text-orange-500">
                    Loading...
                </p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">

            <div className="max-w-7xl mx-auto">

                <div className="mb-8">

                    <h1 className="text-3xl font-bold text-gray-900">
                        Assign Riders
                    </h1>

                    <p className="text-gray-500 mt-1">
                        Assign available delivery partners to orders
                    </p>

                </div>


                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

                    <div className="p-5 border-b">

                        <h2 className="text-xl font-bold">
                            Orders
                        </h2>

                    </div>


                    {orders.length === 0 ? (

                        <div className="p-10 text-center text-gray-500">
                            No orders available
                        </div>

                    ) : (

                        <div className="overflow-x-auto">

                            <table className="w-full">

                                <thead className="bg-gray-50">

                                    <tr>

                                        <th className="text-left p-4">
                                            Order
                                        </th>

                                        <th className="text-left p-4">
                                            Customer
                                        </th>

                                        <th className="text-left p-4">
                                            Amount
                                        </th>

                                        <th className="text-left p-4">
                                            Status
                                        </th>

                                        <th className="text-left p-4">
                                            Assign Rider
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {orders.map((order) => (

                                        <tr
                                            key={order._id}
                                            className="border-t hover:bg-gray-50"
                                        >

                                            <td className="p-4">

                                                <p className="font-semibold">
                                                    #{order._id.slice(-6)}
                                                </p>

                                            </td>


                                            <td className="p-4">

                                                {order.user?.name ||
                                                    order.customer?.name ||
                                                    "Customer"}

                                            </td>


                                            <td className="p-4">

                                                ₹{order.totalPrice || 0}

                                            </td>


                                            <td className="p-4">

                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">

                                                    {order.orderStatus}

                                                </span>

                                            </td>


                                            <td className="p-4">

                                                <select
                                                    defaultValue={
                                                        order.assignedRider?._id ||
                                                        order.assignedRider ||
                                                        ""
                                                    }
                                                    disabled={
                                                        assigning === order._id
                                                    }
                                                    onChange={(e) => {

                                                        if (
                                                            !e.target.value
                                                        ) {
                                                            return;
                                                        }

                                                        assignRider(
                                                            order._id,
                                                            e.target.value
                                                        );

                                                    }}
                                                    className="border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                                                >

                                                    <option value="">
                                                        Select Rider
                                                    </option>

                                                    {riders.map(
                                                        (rider) => (

                                                            <option
                                                                key={
                                                                    rider._id
                                                                }
                                                                value={
                                                                    rider._id
                                                                }
                                                            >

                                                                {rider.name}
                                                                {" - "}
                                                                {rider.vehicleNumber}

                                                            </option>

                                                        )
                                                    )}

                                                </select>

                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default AdminAssignRider;
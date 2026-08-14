// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import API from "../../services/axios";
// import { toast } from "sonner";

// import {
//   FiArrowLeft,
//   FiClock,
//   FiPackage,
//   FiTruck,
//   FiCheckCircle,
//   FiXCircle,
//   FiMapPin,
// } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";

// const steps = [
//   { key: "Pending", label: "Order Placed", icon: FiClock },
//   { key: "Preparing", label: "Preparing", icon: FiPackage },
//   { key: "Out For Delivery", label: "Out For Delivery", icon: FiTruck },
//   { key: "Delivered", label: "Delivered", icon: FiCheckCircle },
// ];

// // Rough estimate (in minutes) remaining from each stage till delivery
// const ETA_MINUTES = {
//   Pending: 40,
//   Preparing: 28,
//   "Out For Delivery": 12,
//   Delivered: 0,
// };

// function OrderTracking() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     getOrder();

//     const interval = setInterval(() => {
//       getOrder(true);
//     }, 15000);

//     return () => clearInterval(interval);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [id]);

//   const getOrder = async (silent = false) => {
//     try {
//       if (!silent) setLoading(true);

//       const res = await API.get(`/orders/${id}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//         },
//       });

//       if (res.data.success) {
//         setOrder(res.data.order);
//       }
//     } catch (error) {
//       console.log(error);
//       if (!silent) toast.error("Failed to load order");
//     } finally {
//       if (!silent) setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-stone-50">
//         <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-50">
//         <p className="text-sm font-semibold text-stone-600">Order not found</p>
//         <button
//           onClick={() => navigate("/orders_history")}
//           className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
//         >
//           Back to Orders
//         </button>
//       </div>
//     );
//   }

//   const isCancelled = order.orderStatus === "Cancelled";
//   const isDelivered = order.orderStatus === "Delivered";
//   const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);
//   const etaMinutes = ETA_MINUTES[order.orderStatus] ?? null;

//   const arrivalTime = etaMinutes
//     ? new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString("en-IN", {
//         hour: "2-digit",
//         minute: "2-digit",
//       })
//     : null;

//   return (
//     <div className="min-h-screen w-full bg-stone-50 pb-10 font-sans">
//       {/* ── Header ── */}
//       <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
//         <div className="mx-auto max-w-3xl">
//           <button
//             onClick={() => navigate("/orders_history")}
//             className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
//           >
//             <FiArrowLeft className="h-3.5 w-3.5" />
//             My Orders
//           </button>
//           <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
//             Track Order
//           </h1>
//           <p className="mt-1 text-xs sm:text-sm text-orange-100">
//             Order #{order._id.slice(-8).toUpperCase()}
//           </p>
//         </div>
//       </div>

//       <div className="mx-auto max-w-3xl px-4 pt-6">
//         {/* ── ETA banner ── */}
//         {!isCancelled && (
//           <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white shadow-sm">
//             {isDelivered ? (
//               <div className="flex items-center gap-3">
//                 <FiCheckCircle className="h-7 w-7 shrink-0" />
//                 <div>
//                   <p className="text-sm font-bold">Order Delivered</p>
//                   <p className="text-xs text-orange-50">
//                     Hope you enjoyed your meal!
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <div className="flex items-center gap-3">
//                 <FiClock className="h-7 w-7 shrink-0" />
//                 <div>
//                   <p className="text-xs text-orange-50">Arriving in approx.</p>
//                   <p className="text-2xl font-extrabold">
//                     {etaMinutes} mins
//                   </p>
//                   <p className="text-xs text-orange-50">
//                     Estimated arrival by {arrivalTime}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* ── Status tracker ── */}
//         <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
//           {isCancelled ? (
//             <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
//               <FiXCircle className="h-6 w-6 shrink-0 text-red-500" />
//               <div>
//                 <p className="text-sm font-bold text-red-700">Order Cancelled</p>
//                 <p className="text-xs text-red-500">
//                   This order has been cancelled.
//                 </p>
//               </div>
//             </div>
//           ) : (
//             <div className="flex items-start justify-between">
//               {steps.map((step, idx) => {
//                 const Icon = step.icon;
//                 const isDone = idx <= currentStepIndex;
//                 const isCurrent = idx === currentStepIndex;

//                 return (
//                   <div
//                     key={step.key}
//                     className="flex flex-1 flex-col items-center text-center"
//                   >
//                     <div className="flex w-full items-center">
//                       <div
//                         className={`h-0.5 flex-1 ${
//                           idx === 0
//                             ? "invisible"
//                             : idx <= currentStepIndex
//                             ? "bg-orange-500"
//                             : "bg-stone-200"
//                         }`}
//                       />
//                       <div
//                         className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
//                           isDone
//                             ? "border-orange-500 bg-orange-500 text-white"
//                             : "border-stone-200 bg-white text-stone-300"
//                         } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}
//                       >
//                         <Icon className="h-4 w-4" />
//                       </div>
//                       <div
//                         className={`h-0.5 flex-1 ${
//                           idx === steps.length - 1
//                             ? "invisible"
//                             : idx < currentStepIndex
//                             ? "bg-orange-500"
//                             : "bg-stone-200"
//                         }`}
//                       />
//                     </div>
//                     <p
//                       className={`mt-2 text-[10px] sm:text-xs font-semibold ${
//                         isDone ? "text-stone-900" : "text-stone-400"
//                       }`}
//                     >
//                       {step.label}
//                     </p>
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           <p className="mt-5 text-center text-xs text-stone-400">
//             Last updated:{" "}
//             {new Date(order.updatedAt || order.createdAt).toLocaleString("en-IN", {
//               day: "numeric",
//               month: "short",
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </p>
//         </div>

//         {/* ── Address ── */}
//         {order.address && (
//           <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
//             <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
//               <FiMapPin className="h-4 w-4 text-orange-600" />
//               Delivery Address
//             </h2>
//             <p className="mt-2 text-xs font-semibold text-stone-800">
//               {order.address.fullName}
//             </p>
//             <p className="mt-0.5 text-xs text-stone-500">
//               {order.address.addressLine1}
//               {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""},{" "}
//               {order.address.city}, {order.address.state} -{" "}
//               {order.address.postalCode}
//             </p>
//             <p className="mt-0.5 text-xs text-stone-400">{order.address.phone}</p>
//           </div>
//         )}

//         {/* ── Items ── */}
//         <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
//           <h2 className="text-sm font-bold text-stone-900">Items</h2>
//           <div className="mt-3 space-y-2">
//             {order.items.map((item, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between text-xs text-stone-600"
//               >
//                 <span className="truncate">
//                   {item.name} x {item.quantity}
//                 </span>
//                 <span className="font-medium text-stone-700">
//                   ₹{item.price * item.quantity}
//                 </span>
//               </div>
//             ))}
//           </div>

//           <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
//             <div>
//               <p className="text-[11px] text-stone-400">
//                 {order.paymentMethod} ·{" "}
//                 <span
//                   className={
//                     order.paymentStatus === "Paid"
//                       ? "text-green-600 font-semibold"
//                       : "text-amber-600 font-semibold"
//                   }
//                 >
//                   {order.paymentStatus}
//                 </span>
//               </p>
//             </div>
//             <p className="text-base font-extrabold text-stone-900">
//               ₹{order.totalPrice}
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default OrderTracking;



import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../services/axios";
import { toast } from "sonner";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  FiArrowLeft,
  FiClock,
  FiPackage,
  FiTruck,
  FiCheckCircle,
  FiXCircle,
  FiMapPin,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

// Custom icons (default leaflet marker icons don't load correctly with bundlers)
const riderIcon = new L.DivIcon({
  html: `<div style="background:#ea580c;width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="white" viewBox="0 0 24 24"><path d="M3 13h1v6h3v-3h10v3h3v-6h1l-2-6H5l-2 6z"/></svg>
         </div>`,
  className: "",
  iconSize: [34, 34],
  iconAnchor: [17, 17],
});

const homeIcon = new L.DivIcon({
  html: `<div style="background:#1c1917;width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:2px solid white;">
           <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="white" viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-5v-6H11v6H6v-9H3z"/></svg>
         </div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const steps = [
  { key: "Pending", label: "Order Placed", icon: FiClock },
  { key: "Preparing", label: "Preparing", icon: FiPackage },
  { key: "Out For Delivery", label: "Out For Delivery", icon: FiTruck },
  { key: "Delivered", label: "Delivered", icon: FiCheckCircle },
];

const ETA_MINUTES = {
  Pending: 40,
  Preparing: 28,
  "Out For Delivery": 12,
  Delivered: 0,
};

function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder();

    // Out for delivery ke time zyada frequent poll karo taaki location smooth lage
    const interval = setInterval(() => {
      getOrder(true);
    }, order?.orderStatus === "Out For Delivery" ? 5000 : 15000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, order?.orderStatus]);

  const getOrder = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const res = await API.get(`/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (error) {
      console.log(error);
      if (!silent) toast.error("Failed to load order");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-stone-50">
        <p className="text-sm font-semibold text-stone-600">Order not found</p>
        <button
          onClick={() => navigate("/orders_history")}
          className="rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled";
  const isDelivered = order.orderStatus === "Delivered";
  const isOutForDelivery = order.orderStatus === "Out For Delivery";
  const currentStepIndex = steps.findIndex((s) => s.key === order.orderStatus);
  const etaMinutes = ETA_MINUTES[order.orderStatus] ?? null;

  const arrivalTime = etaMinutes
    ? new Date(Date.now() + etaMinutes * 60000).toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // Rider aur delivery address ki coordinates — backend se aani chahiye
 // Sahi — lat aur lng dono valid numbers hain tabhi coords banao
const riderCoords =
  order.riderLocation &&
  order.riderLocation.lat != null &&
  order.riderLocation.lng != null
    ? [order.riderLocation.lat, order.riderLocation.lng]
    : null;

const addressCoords =
  order.address?.lat != null && order.address?.lng != null
    ? [order.address.lat, order.address.lng]
    : null;
  return (
    <div className="min-h-screen w-full bg-stone-50 pb-10 font-sans">
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/orders_history")}
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            My Orders
          </button>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white">
            Track Order
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-orange-100">
            Order #{order._id.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {/* ── ETA banner ── */}
        {!isCancelled && (
          <div className="rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 p-5 text-white shadow-sm">
            {isDelivered ? (
              <div className="flex items-center gap-3">
                <FiCheckCircle className="h-7 w-7 shrink-0" />
                <div>
                  <p className="text-sm font-bold">Order Delivered</p>
                  <p className="text-xs text-orange-50">
                    Hope you enjoyed your meal!
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FiClock className="h-7 w-7 shrink-0" />
                <div>
                  <p className="text-xs text-orange-50">Arriving in approx.</p>
                  <p className="text-2xl font-extrabold">
                    {etaMinutes} mins
                  </p>
                  <p className="text-xs text-orange-50">
                    Estimated arrival by {arrivalTime}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Live Rider Map ── */}
        {isOutForDelivery && riderCoords && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm">
            <div className="flex items-center justify-between px-5 pt-4">
              <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                <FiTruck className="h-4 w-4 text-orange-600" />
                Rider is on the way
              </h2>
              <span className="flex items-center gap-1 text-[10px] font-semibold text-green-600">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                Live
              </span>
            </div>
            <div className="mt-3 h-64 w-full">
              <MapContainer
                center={riderCoords}
                zoom={15}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={riderCoords} icon={riderIcon}>
                  <Popup>Your delivery partner</Popup>
                </Marker>
                {addressCoords && (
                  <Marker position={addressCoords} icon={homeIcon}>
                    <Popup>Delivery address</Popup>
                  </Marker>
                )}
              </MapContainer>
            </div>
            {order.riderName && (
              <p className="px-5 py-3 text-xs text-stone-500">
                {order.riderName} is heading your way{order.riderPhone ? ` · ${order.riderPhone}` : ""}
              </p>
            )}
          </div>
        )}

        {/* ── Status tracker ── */}
        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          {isCancelled ? (
            <div className="flex items-center gap-3 rounded-xl bg-red-50 p-4">
              <FiXCircle className="h-6 w-6 shrink-0 text-red-500" />
              <div>
                <p className="text-sm font-bold text-red-700">Order Cancelled</p>
                <p className="text-xs text-red-500">
                  This order has been cancelled.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                const isDone = idx <= currentStepIndex;
                const isCurrent = idx === currentStepIndex;

                return (
                  <div
                    key={step.key}
                    className="flex flex-1 flex-col items-center text-center"
                  >
                    <div className="flex w-full items-center">
                      <div
                        className={`h-0.5 flex-1 ${
                          idx === 0
                            ? "invisible"
                            : idx <= currentStepIndex
                            ? "bg-orange-500"
                            : "bg-stone-200"
                        }`}
                      />
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 ${
                          isDone
                            ? "border-orange-500 bg-orange-500 text-white"
                            : "border-stone-200 bg-white text-stone-300"
                        } ${isCurrent ? "ring-4 ring-orange-100" : ""}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div
                        className={`h-0.5 flex-1 ${
                          idx === steps.length - 1
                            ? "invisible"
                            : idx < currentStepIndex
                            ? "bg-orange-500"
                            : "bg-stone-200"
                        }`}
                      />
                    </div>
                    <p
                      className={`mt-2 text-[10px] sm:text-xs font-semibold ${
                        isDone ? "text-stone-900" : "text-stone-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <p className="mt-5 text-center text-xs text-stone-400">
            Last updated:{" "}
            {new Date(order.updatedAt || order.createdAt).toLocaleString("en-IN", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        {/* ── Address ── */}
        {order.address && (
          <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <FiMapPin className="h-4 w-4 text-orange-600" />
              Delivery Address
            </h2>
            <p className="mt-2 text-xs font-semibold text-stone-800">
              {order.address.fullName}
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              {order.address.addressLine1}
              {order.address.addressLine2 ? `, ${order.address.addressLine2}` : ""},{" "}
              {order.address.city}, {order.address.state} -{" "}
              {order.address.postalCode}
            </p>
            <p className="mt-0.5 text-xs text-stone-400">{order.address.phone}</p>
          </div>
        )}

        {/* ── Items ── */}
        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <h2 className="text-sm font-bold text-stone-900">Items</h2>
          <div className="mt-3 space-y-2">
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
            </div>
            <p className="text-base font-extrabold text-stone-900">
              ₹{order.totalPrice}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderTracking;
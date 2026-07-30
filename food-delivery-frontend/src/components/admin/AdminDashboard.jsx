import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getData } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  FiPlusCircle,
  FiEdit3,
  FiShoppingBag,
  FiPackage,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import { PiBowlFood } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = getData();

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  /* ---------- Fetch all items ---------- */
  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/products`,
          authHeaders()
        );
        if (res.data.success) setItems(res.data.products || []);
      } catch (err) {
        console.error("Failed to fetch items:", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchItems();
  }, []);

  /* ---------- Fetch orders for this restaurant ---------- */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);
        // ⚠️ ADJUST: swap for your actual "get restaurant orders" endpoint
        // once you share orderRoutes.js — likely something like:
        // `${import.meta.env.VITE_APP_API_URL}/api/orders/restaurant`
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/orders/restaurant`,
          authHeaders()
        );
        if (res.data.success) setOrders(res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const vegItems = items.filter((i) => i.isVeg === true || i.category === "veg");
  const nonVegItems = items.filter((i) => i.isVeg === false || i.category === "non-veg");

  const pendingOrders = orders.filter(
    (o) => o.status && !["delivered", "cancelled"].includes(o.status.toLowerCase())
  );

  const displayName =
    user?.restaurantName || user?.username || user?.name || "there";

  const statCards = [
    {
      label: "Total Items",
      value: items.length,
      icon: FiPackage,
      color: "bg-orange-50 text-orange-600",
      onClick: () => navigate("/admin/items"),
    },
    {
      label: "Veg Items",
      value: vegItems.length,
      icon: PiBowlFood,
      color: "bg-emerald-50 text-emerald-600",
      onClick: () => navigate("/admin/items", { state: { filter: "veg" } }),
    },
    {
      label: "Non-Veg Items",
      value: nonVegItems.length,
      icon: PiBowlFood,
      color: "bg-red-50 text-red-600",
      onClick: () => navigate("/admin/items", { state: { filter: "non-veg" } }),
    },
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: FiShoppingBag,
      color: "bg-amber-50 text-amber-600",
      onClick: () => navigate("/admin/orders"),
    },
  ];

  const quickActions = [
    {
      label: "View Orders",
      desc: "See and manage incoming orders",
      icon: FiShoppingBag,
      onClick: () => navigate("/admin/orders"),
    },
    {
      label: "Add New Item",
      desc: "Add a dish to your menu",
      icon: FiPlusCircle,
      onClick: () => navigate("/admin/items/add"),
    },
    {
      label: "Edit Items",
      desc: "Update prices, availability & details",
      icon: FiEdit3,
      onClick: () => navigate("/admin/editItem"),
    },
  ];

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans overflow-x-hidden">
      {/* ── Header Banner ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs sm:text-sm font-medium text-orange-100">
            {userLoading ? (
              <span className="inline-block h-4 w-32 animate-pulse rounded bg-white/20" />
            ) : (
              `Welcome back, ${displayName} 👋`
            )}
          </p>
          <h1 className="mt-1 text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Restaurant Dashboard
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 space-y-8">
        {/* ── Stat Cards ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <button
                key={stat.label}
                onClick={stat.onClick}
                className="group flex flex-col items-start gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  {loadingItems || loadingOrders ? (
                    <span className="inline-block h-6 w-10 animate-pulse rounded bg-stone-200" />
                  ) : (
                    <p className="text-2xl font-extrabold text-stone-900">{stat.value}</p>
                  )}
                  <p className="text-xs font-semibold text-stone-500">{stat.label}</p>
                </div>
              </button>
            );
          })}
        </section>

        {/* ── Quick Actions ── */}
        <section>
          <h2 className="mb-3 text-base font-bold text-stone-900">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  onClick={action.onClick}
                  className="group flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-stone-800 group-hover:text-orange-600">
                      {action.label}
                    </p>
                    <p className="truncate text-xs font-medium text-stone-400">{action.desc}</p>
                  </div>
                  <FiChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />
                </button>
              );
            })}
          </div>
        </section>

        {/* ── All Existing Items ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
              <FiPackage className="h-4 w-4 shrink-0 text-orange-500" />
              All Menu Items
            </h2>
            <Button
              size="sm"
              onClick={() => navigate("/admin/items/add")}
              className="h-8 rounded-xl bg-stone-900 px-3 text-xs font-semibold text-white hover:bg-stone-800"
            >
              <FiPlusCircle className="mr-1 h-3.5 w-3.5" />
              Add Item
            </Button>
          </div>

          {loadingItems ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-stone-100">
              <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />
              <p className="mt-2 text-xs font-medium text-stone-400">Loading your menu...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-10 px-4 text-center">
              <p className="text-sm font-semibold text-stone-600">No items added yet.</p>
              <p className="mt-1 text-xs text-stone-400">
                Click "Add Item" to start building your menu.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => {
                const isVeg = item.isVeg === true || item.category === "veg";
                return (
                  <div
                    key={item._id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                  >
                    <div className="relative h-32 w-full overflow-hidden bg-stone-100">
                      <img
                        src={
                          item.image ||
                          item.photoUrl ||
                          "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
                        }
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-sm border-2 ${
                            isVeg ? "border-emerald-600" : "border-red-600"
                          } bg-white`}
                        >
                          <span
                            className={`h-2.5 w-2.5 rounded-full ${
                              isVeg ? "bg-emerald-600" : "bg-red-600"
                            }`}
                          />
                        </span>
                      </div>
                      {item.isAvailable === false && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                          <Badge className="border-none bg-stone-800 text-[10px] font-bold uppercase text-white">
                            Unavailable
                          </Badge>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col justify-between p-3.5">
                      <div>
                        <h3 className="line-clamp-1 text-sm font-bold text-stone-900">
                          {item.name}
                        </h3>
                        <p className="mt-0.5 text-xs font-semibold text-orange-600">
                          ₹{item.price}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => navigate(`/admin/items/edit/${item._id}`)}
                        className="mt-3 h-8 w-full rounded-xl border-stone-200 text-xs font-semibold text-stone-700 hover:border-orange-300 hover:text-orange-600"
                      >
                        <FiEdit3 className="mr-1.5 h-3.5 w-3.5" />
                        Edit Item
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
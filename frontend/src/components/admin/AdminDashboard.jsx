import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { getData } from "@/context/userContext";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import {
  FiPlusCircle,
  FiEdit3,
  FiShoppingBag,
  FiPackage,
  FiChevronRight,
  FiBarChart2,
  FiLogOut,
  FiMenu,
  FiX,
  FiHome,
} from "react-icons/fi";

import { PiBowlFood } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";


// ======================================================
// AUTH HEADERS
// ======================================================

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});


// ======================================================
// ADMIN DASHBOARD
// ======================================================

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, loading: userLoading } = getData();

  // ======================================================
  // STATES
  // ======================================================

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [itemFilter, setItemFilter] = useState("all");

  const [sidebarOpen, setSidebarOpen] = useState(false);


  // ======================================================
  // FETCH PRODUCTS
  // ======================================================

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoadingItems(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/products`,
          authHeaders()
        );

        if (res.data.success) {
          setItems(
            res.data.data ||
            res.data.products ||
            []
          );
        }

      } catch (err) {
        console.error(
          "Failed to fetch items:",
          err.response?.data || err.message
        );
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, []);


  // ======================================================
  // FETCH ORDERS
  // ======================================================

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoadingOrders(true);

        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/orders`,
          authHeaders()
        );

        if (res.data.success) {
          setOrders(
            res.data.orders ||
            res.data.data ||
            []
          );
        }

      } catch (err) {
        console.error(
          "Failed to fetch orders:",
          err.response?.data || err.message
        );
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, []);


  // ======================================================
  // FILTER DATA
  // ======================================================

  const vegItems = items.filter(
    (item) =>
      item.isVeg === true ||
      item.foodType?.toLowerCase() === "veg"
  );


  const nonVegItems = items.filter(
    (item) =>
      item.isVeg === false ||
      item.foodType?.toLowerCase() === "non-veg"
  );


  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus &&
      !["delivered", "cancelled"].includes(
        order.orderStatus.toLowerCase()
      )
  );


  // ======================================================
  // DISPLAYED ITEMS
  // ======================================================

  const displayedItems =
    itemFilter === "veg"
      ? vegItems
      : itemFilter === "non-veg"
      ? nonVegItems
      : items;


  // ======================================================
  // USER / RESTAURANT NAME
  // ======================================================

  const displayName =
    user?.restaurantName ||
    user?.username ||
    user?.name ||
    "there";


  // ======================================================
  // SIDEBAR ITEMS
  // ======================================================

  const sidebarItems = [
    {
      label: "Dashboard",
      icon: FiHome,
      path: "/admin",
    },
    {
      label: "Add Item",
      icon: FiPlusCircle,
      path: "/admin/items/add",
    },
    {
      label: "Orders",
      icon: FiShoppingBag,
      path: "/admin/orders",
    },
    {
      label: "Analytics",
      icon: FiBarChart2,
      path: "/admin/analytics",
    },
  ];


  // ======================================================
  // NAVIGATION
  // ======================================================

  const handleNavigation = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };


  // ======================================================
  // LOGOUT
  // ======================================================

  const handleLogout = () => {
    localStorage.removeItem("token");

    setSidebarOpen(false);

    navigate("/login");
  };


  // ======================================================
  // ACTIVE SIDEBAR ITEM
  // ======================================================

  const isActive = (path) => {
    if (path === "/admin") {
      return location.pathname === "/admin";
    }

    return location.pathname.startsWith(path);
  };


  // ======================================================
  // STAT CARDS
  // ======================================================

  const statCards = [
    {
      label: "Total Items",
      value: items.length,
      icon: FiPackage,
      color: "bg-orange-50 text-orange-600",
      onClick: () => setItemFilter("all"),
    },

    {
      label: "Veg Items",
      value: vegItems.length,
      icon: PiBowlFood,
      color: "bg-emerald-50 text-emerald-600",
      onClick: () => setItemFilter("veg"),
    },

    {
      label: "Non-Veg Items",
      value: nonVegItems.length,
      icon: PiBowlFood,
      color: "bg-red-50 text-red-600",
      onClick: () => setItemFilter("non-veg"),
    },

    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: FiShoppingBag,
      color: "bg-amber-50 text-amber-600",
      onClick: () => navigate("/admin/orders"),
    },
  ];


  // ======================================================
  // QUICK ACTIONS
  // ======================================================

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
      onClick: () => setItemFilter("all"),
    },
  ];


  // ======================================================
  // RETURN
  // ======================================================

  return (
    <div className="min-h-screen bg-stone-50 font-sans">


      {/* ==================================================
          MOBILE TOP BAR
      ================================================== */}

      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 lg:hidden">

        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 transition hover:bg-stone-100"
        >
          <FiMenu className="h-6 w-6 text-stone-700" />
        </button>

        <h2 className="font-bold text-stone-900">
          Admin Dashboard
        </h2>

        <div className="w-10" />

      </div>


      {/* ==================================================
          MOBILE OVERLAY
      ================================================== */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* ==================================================
          SIDEBAR
      ================================================== */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          border-r
          border-stone-200
          bg-white
          shadow-sm
          transition-transform
          duration-300

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }

          lg:translate-x-0
        `}
      >


        {/* SIDEBAR HEADER */}

        <div className="flex items-center justify-between border-b border-stone-100 px-5 py-5">

          <div>

            <h1 className="text-xl font-extrabold text-stone-900">
              Food<span className="text-orange-500">Admin</span>
            </h1>

            <p className="mt-1 text-xs text-stone-400">
              Restaurant Panel
            </p>

          </div>


          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 transition hover:bg-stone-100 lg:hidden"
          >
            <FiX className="h-5 w-5 text-stone-700" />
          </button>

        </div>


        {/* RESTAURANT INFO */}

        <div className="mx-4 mt-5 rounded-xl bg-orange-50 p-3">

          <p className="text-xs font-medium text-orange-500">
            Restaurant
          </p>

          <p className="mt-1 truncate text-sm font-bold text-stone-800">
            {user?.restaurantName ||
              user?.name ||
              "My Restaurant"}
          </p>

        </div>


        {/* SIDEBAR NAVIGATION */}

        <nav className="mt-6 px-3">

          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Manage
          </p>


          <div className="space-y-1">

            {sidebarItems.map((item) => {

              const Icon = item.icon;

              const active = isActive(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() =>
                    handleNavigation(item.path)
                  }
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-2.5
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      active
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                    }
                  `}
                >

                  <Icon
                    className={`
                      h-5 w-5

                      ${
                        active
                          ? "text-white"
                          : "text-stone-400 group-hover:text-orange-500"
                      }
                    `}
                  />

                  <span>
                    {item.label}
                  </span>

                </button>
              );

            })}

          </div>

        </nav>


        {/* LOGOUT */}

        <div className="absolute bottom-0 left-0 right-0 border-t border-stone-100 p-3">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
          >

            <FiLogOut className="h-5 w-5" />

            Logout

          </button>

        </div>

      </aside>


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <main className="lg:ml-64">


        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pb-8 pt-6 shadow-md">

          <div className="mx-auto max-w-6xl">

            <p className="text-xs font-medium text-orange-100 sm:text-sm">

              {userLoading ? (
                <span className="inline-block h-4 w-32 animate-pulse rounded bg-white/20" />
              ) : (
                `Welcome back, ${displayName} 👋`
              )}

            </p>


            <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
              Restaurant Dashboard
            </h1>

          </div>

        </div>


        {/* ==================================================
            CONTENT
        ================================================== */}

        <div className="mx-auto max-w-6xl space-y-8 px-4 pb-20 pt-6">


          {/* ==================================================
              STAT CARDS
          ================================================== */}

          <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4 sm:gap-4">

            {statCards.map((stat) => {

              const Icon = stat.icon;

              const isActiveFilter =
                (stat.label === "Total Items" &&
                  itemFilter === "all") ||
                (stat.label === "Veg Items" &&
                  itemFilter === "veg") ||
                (stat.label === "Non-Veg Items" &&
                  itemFilter === "non-veg");


              return (
                <button
                  key={stat.label}
                  onClick={stat.onClick}
                  className={`
                    group
                    flex
                    flex-col
                    items-start
                    gap-3
                    rounded-2xl
                    border
                    bg-white
                    p-4
                    text-left
                    shadow-sm
                    transition-all
                    duration-200
                    hover:-translate-y-0.5
                    hover:border-orange-300
                    hover:shadow-md
                    focus:outline-none

                    ${
                      isActiveFilter
                        ? "border-orange-400 ring-1 ring-orange-200"
                        : "border-stone-200/80"
                    }
                  `}
                >

                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      ${stat.color}
                    `}
                  >
                    <Icon className="h-5 w-5" />
                  </div>


                  <div>

                    {loadingItems || loadingOrders ? (

                      <span className="inline-block h-6 w-10 animate-pulse rounded bg-stone-200" />

                    ) : (

                      <p className="text-2xl font-extrabold text-stone-900">
                        {stat.value}
                      </p>

                    )}

                    <p className="text-xs font-semibold text-stone-500">
                      {stat.label}
                    </p>

                  </div>

                </button>
              );

            })}

          </section>


          {/* ==================================================
              QUICK ACTIONS
          ================================================== */}

          <section>

            <h2 className="mb-3 text-base font-bold text-stone-900">
              Quick Actions
            </h2>


            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">

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

                      <p className="truncate text-xs font-medium text-stone-400">
                        {action.desc}
                      </p>

                    </div>


                    <FiChevronRight className="h-4 w-4 shrink-0 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-orange-500" />

                  </button>
                );

              })}

            </div>

          </section>


          {/* ==================================================
              MENU ITEMS
          ================================================== */}

          <section>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">

              <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">

                <FiPackage className="h-4 w-4 text-orange-500" />

                {itemFilter === "veg"
                  ? "Veg Items"
                  : itemFilter === "non-veg"
                  ? "Non-Veg Items"
                  : "All Menu Items"}

              </h2>


              <div className="flex items-center gap-2">

                {/* FILTER */}

                <div className="flex gap-1.5 rounded-xl border border-stone-200 bg-white p-1">

                  {[
                    {
                      key: "all",
                      label: "All",
                    },
                    {
                      key: "veg",
                      label: "Veg",
                    },
                    {
                      key: "non-veg",
                      label: "Non-Veg",
                    },
                  ].map((filter) => (

                    <button
                      key={filter.key}
                      onClick={() =>
                        setItemFilter(filter.key)
                      }
                      className={`
                        rounded-lg
                        px-2.5
                        py-1
                        text-xs
                        font-semibold
                        transition-colors

                        ${
                          itemFilter === filter.key
                            ? "bg-stone-900 text-white"
                            : "text-stone-500 hover:bg-stone-100"
                        }
                      `}
                    >
                      {filter.label}
                    </button>

                  ))}

                </div>


                {/* ADD ITEM */}

                <Button
                  size="sm"
                  onClick={() =>
                    navigate("/admin/items/add")
                  }
                  className="h-8 rounded-xl bg-stone-900 px-3 text-xs font-semibold text-white hover:bg-stone-800"
                >

                  <FiPlusCircle className="mr-1 h-3.5 w-3.5" />

                  Add Item

                </Button>

              </div>

            </div>


            {/* ==================================================
                LOADING
            ================================================== */}

            {loadingItems ? (

              <div className="flex flex-col items-center justify-center rounded-2xl border border-stone-100 bg-white py-12">

                <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />

                <p className="mt-2 text-xs font-medium text-stone-400">
                  Loading your menu...
                </p>

              </div>


            ) : displayedItems.length === 0 ? (

              /* ==================================================
                  EMPTY STATE
              ================================================== */

              <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-4 py-10 text-center">

                <p className="text-sm font-semibold text-stone-600">

                  {itemFilter === "all"
                    ? "No items added yet."
                    : `No ${
                        itemFilter === "veg"
                          ? "veg"
                          : "non-veg"
                      } items found.`}

                </p>


                <p className="mt-1 text-xs text-stone-400">

                  {itemFilter === "all"
                    ? 'Click "Add Item" to start building your menu.'
                    : "Try switching the filter or add a new item."}

                </p>

              </div>


            ) : (

              /* ==================================================
                  ITEMS GRID
              ================================================== */

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                {displayedItems.map((item) => {

                  const isVeg =
                    item.isVeg === true ||
                    item.foodType?.toLowerCase() === "veg";


                  return (
                    <div
                      key={item._id}
                      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md"
                    >


                      {/* IMAGE */}

                      <div className="relative h-32 w-full overflow-hidden bg-stone-100">

                        <img
                          src={
                            item.image ||
                            item.photoUrl ||
                            "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=500&q=80"
                          }
                          alt={item.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />


                        {/* VEG / NON-VEG */}

                        <div className="absolute left-2 top-2">

                          <span
                            className={`
                              flex
                              h-5
                              w-5
                              items-center
                              justify-center
                              rounded-sm
                              border-2
                              bg-white

                              ${
                                isVeg
                                  ? "border-emerald-600"
                                  : "border-red-600"
                              }
                            `}
                          >

                            <span
                              className={`
                                h-2.5
                                w-2.5
                                rounded-full

                                ${
                                  isVeg
                                    ? "bg-emerald-600"
                                    : "bg-red-600"
                                }
                              `}
                            />

                          </span>

                        </div>


                        {/* UNAVAILABLE */}

                        {item.isAvailable === false && (

                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">

                            <Badge className="border-none bg-stone-800 text-[10px] font-bold uppercase text-white">
                              Unavailable
                            </Badge>

                          </div>

                        )}

                      </div>


                      {/* ITEM DETAILS */}

                      <div className="flex flex-1 flex-col justify-between p-3.5">

                        <div>

                          <h3 className="line-clamp-1 text-sm font-bold text-stone-900">
                            {item.name}
                          </h3>


                          <p className="mt-0.5 text-xs font-semibold text-orange-600">
                            ₹{item.price}
                          </p>

                        </div>


                        {/* EDIT BUTTON */}

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/items/edit/${item._id}`
                            )
                          }
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

      </main>

    </div>
  );
};


export default AdminDashboard;
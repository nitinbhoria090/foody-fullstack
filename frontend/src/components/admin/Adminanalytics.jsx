import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { getData } from "@/context/userContext";

import {
  FiShoppingBag,
  FiPackage,
  FiTrendingUp,
  FiDollarSign,
  FiBarChart2,
} from "react-icons/fi";

import { PiBowlFood } from "react-icons/pi";
import { CgSpinner } from "react-icons/cg";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";


// ==========================================
// AUTH HEADERS
// ==========================================

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});


// ==========================================
// COLORS
// ==========================================

const ORANGE = "#f97316";
const AMBER = "#f59e0b";
const EMERALD = "#10b981";
const RED = "#ef4444";
const STONE = "#78716c";

const STATUS_COLORS = {
  pending: AMBER,
  preparing: ORANGE,
  "out for delivery": "#6366f1",
  delivered: EMERALD,
  cancelled: RED,
};


// ==========================================
// ADMIN ANALYTICS
// ==========================================

const AdminAnalytics = () => {

  const { user, loading: userLoading } = getData();

  const [items, setItems] = useState([]);
  const [loadingItems, setLoadingItems] = useState(true);

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  const [rangeDays, setRangeDays] = useState(7);


  // ==========================================
  // FETCH PRODUCTS
  // ==========================================

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


  // ==========================================
  // FETCH ORDERS
  // ==========================================

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


  // ==========================================
  // VEG ITEMS
  // ==========================================

  const vegItems = items.filter(
    (item) =>
      item.isVeg === true ||
      item.foodType?.toLowerCase() === "veg"
  );


  // ==========================================
  // NON VEG ITEMS
  // ==========================================

  const nonVegItems = items.filter(
    (item) =>
      item.isVeg === false ||
      item.foodType?.toLowerCase() === "non-veg"
  );


  // ==========================================
  // PENDING / ACTIVE ORDERS
  // ==========================================

  const pendingOrders = orders.filter(
    (order) =>
      order.orderStatus &&
      !["delivered", "cancelled"].includes(
        order.orderStatus.toLowerCase()
      )
  );


  // ==========================================
  // TOTAL REVENUE
  // ==========================================

  const totalRevenue = useMemo(() => {

    return orders.reduce((sum, order) => {

      // NOTE: backend Order model stores this as `totalPrice`
      const amount =
        order.totalPrice ??
        order.totalAmount ??
        order.total ??
        order.amount ??
        0;

      if (
        order.orderStatus?.toLowerCase() ===
        "cancelled"
      ) {
        return sum;
      }

      return sum + Number(amount || 0);

    }, 0);

  }, [orders]);


  // ==========================================
  // AVERAGE ORDER VALUE
  // ==========================================

  const avgOrderValue =
    orders.length
      ? totalRevenue / orders.length
      : 0;


  // ==========================================
  // REVENUE TREND
  // ==========================================

  const trendData = useMemo(() => {

    const days = [];

    const today = new Date();


    for (
      let i = rangeDays - 1;
      i >= 0;
      i--
    ) {

      const d = new Date(today);

      d.setDate(
        d.getDate() - i
      );

      days.push({

        key: d
          .toISOString()
          .slice(0, 10),

        label: d.toLocaleDateString(
          undefined,
          {
            month: "short",
            day: "numeric",
          }
        ),

        revenue: 0,

        orders: 0,

      });

    }


    const byKey = Object.fromEntries(
      days.map((day) => [
        day.key,
        day,
      ])
    );


    orders.forEach((order) => {

      const dateStr =
        order.createdAt ||
        order.orderDate ||
        order.date;

      if (!dateStr) return;


      const key = new Date(dateStr)
        .toISOString()
        .slice(0, 10);


      if (byKey[key]) {

        // NOTE: backend Order model stores this as `totalPrice`
        const amount =
          order.totalPrice ??
          order.totalAmount ??
          order.total ??
          order.amount ??
          0;


        if (
          order.orderStatus?.toLowerCase() !==
          "cancelled"
        ) {

          byKey[key].revenue +=
            Number(amount || 0);

        }


        byKey[key].orders += 1;

      }

    });


    return days;

  }, [orders, rangeDays]);


  // ==========================================
  // ORDERS BY STATUS
  // ==========================================

  const statusData = useMemo(() => {

    const counts = {};

    orders.forEach((order) => {

      const status =
        (
          order.orderStatus ||
          "unknown"
        ).toLowerCase();


      counts[status] =
        (counts[status] || 0) + 1;

    });


    return Object.entries(counts).map(
      ([status, count]) => ({

        name:
          status.charAt(0).toUpperCase() +
          status.slice(1),

        value: count,

        color:
          STATUS_COLORS[status] ||
          STONE,

      })
    );

  }, [orders]);


  // ==========================================
  // TOP SELLING ITEMS
  // ==========================================

  const topItems = useMemo(() => {

    const qtyByName = {};


    orders.forEach((order) => {

      const lineItems =
        order.items ||
        order.cartItems ||
        order.products ||
        [];


      lineItems.forEach((item) => {

        const name =
          item.name ||
          item.productName ||
          item.title ||
          "Item";


        const qty =
          item.quantity ||
          item.qty ||
          1;


        qtyByName[name] =
          (qtyByName[name] || 0) +
          Number(qty);

      });

    });


    return Object.entries(qtyByName)

      .map(([name, qty]) => ({
        name,
        qty,
      }))

      .sort(
        (a, b) =>
          b.qty - a.qty
      )

      .slice(0, 6);

  }, [orders]);


  // ==========================================
  // VEG / NON VEG CHART
  // ==========================================

  const vegSplitData = [

    {
      name: "Veg",
      value: vegItems.length,
      color: EMERALD,
    },

    {
      name: "Non-Veg",
      value: nonVegItems.length,
      color: RED,
    },

  ];


  // ==========================================
  // DISPLAY NAME
  // ==========================================

  const displayName =
    user?.restaurantName ||
    user?.username ||
    user?.name ||
    "there";


  // ==========================================
  // LOADING
  // ==========================================

  const isLoading =
    loadingItems ||
    loadingOrders;


  // ==========================================
  // SUMMARY CARDS
  // ==========================================

  const summaryCards = [

    {
      label: "Total Revenue",

      value:
        `₹${totalRevenue.toLocaleString(
          "en-IN"
        )}`,

      icon: FiDollarSign,

      color:
        "bg-orange-50 text-orange-600",
    },


    {
      label: "Total Orders",

      value: orders.length,

      icon: FiShoppingBag,

      color:
        "bg-amber-50 text-amber-600",
    },


    {
      label: "Avg Order Value",

      value:
        `₹${avgOrderValue.toFixed(0)}`,

      icon: FiTrendingUp,

      color:
        "bg-emerald-50 text-emerald-600",
    },


    {
      label: "Menu Items",

      value: items.length,

      icon: FiPackage,

      color:
        "bg-red-50 text-red-600",
    },

  ];


  // ==========================================
  // UI
  // ==========================================

  return (

    <div className="min-h-screen w-full bg-stone-50 font-sans">

      {/* ======================================
          HEADER
      ====================================== */}

      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-6 pt-8 pb-10 shadow-md">

        <div className="mx-auto max-w-6xl">

          <p className="text-sm font-medium text-orange-100">

            {userLoading ? (

              <span className="inline-block h-4 w-32 animate-pulse rounded bg-white/20" />

            ) : (

              `Welcome back, ${displayName} 👋`

            )}

          </p>


          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-white">

            Analytics

          </h1>

        </div>

      </div>


      {/* ======================================
          MAIN CONTENT
      ====================================== */}

      <main className="min-h-screen w-full overflow-x-hidden pb-20">

        <div className="mx-auto max-w-6xl px-4 pt-6 space-y-8 lg:px-8">


          {/* ==================================
              SUMMARY CARDS
          ================================== */}

          <section className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">

            {summaryCards.map((stat) => {

              const Icon = stat.icon;

              return (

                <div
                  key={stat.label}
                  className="flex flex-col items-start gap-3 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm"
                >

                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${stat.color}`}
                  >

                    <Icon className="h-5 w-5" />

                  </div>


                  <div>

                    {isLoading ? (

                      <span className="inline-block h-6 w-16 animate-pulse rounded bg-stone-200" />

                    ) : (

                      <p className="text-2xl font-extrabold text-stone-900">

                        {stat.value}

                      </p>

                    )}

                    <p className="text-xs font-semibold text-stone-500">

                      {stat.label}

                    </p>

                  </div>

                </div>

              );

            })}

          </section>


          {/* ==================================
              REVENUE TREND
          ================================== */}

          <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

              <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">

                <FiTrendingUp className="h-4 w-4 text-orange-500" />

                Revenue Trend

              </h2>


              <div className="flex gap-1.5 rounded-xl border border-stone-200 bg-white p-1">

                {[7, 14, 30].map((days) => (

                  <button
                    key={days}
                    onClick={() =>
                      setRangeDays(days)
                    }
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors ${
                      rangeDays === days
                        ? "bg-stone-900 text-white"
                        : "text-stone-500 hover:bg-stone-100"
                    }`}
                  >

                    {days}d

                  </button>

                ))}

              </div>

            </div>


            {isLoading ? (

              <div className="flex h-64 items-center justify-center">

                <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />

              </div>

            ) : (

              <div className="h-64 w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <LineChart
                    data={trendData}
                    margin={{
                      top: 5,
                      right: 10,
                      left: -10,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e7e5e4"
                    />

                    <XAxis
                      dataKey="label"
                      tick={{
                        fontSize: 11,
                        fill: "#78716c",
                      }}
                    />

                    <YAxis
                      tick={{
                        fontSize: 11,
                        fill: "#78716c",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border:
                          "1px solid #e7e5e4",
                        fontSize: 12,
                      }}
                      formatter={(
                        value,
                        name
                      ) =>
                        name === "revenue"
                          ? [
                              `₹${value}`,
                              "Revenue",
                            ]
                          : [
                              value,
                              "Orders",
                            ]
                      }
                    />

                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke={ORANGE}
                      strokeWidth={2.5}
                      dot={false}
                    />

                  </LineChart>

                </ResponsiveContainer>

              </div>

            )}

          </section>


          {/* ==================================
              ORDER STATUS + MENU COMPOSITION
          ================================== */}

          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">


            {/* ORDERS BY STATUS */}

            <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">

              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-stone-900">

                <FiShoppingBag className="h-4 w-4 text-orange-500" />

                Orders by Status

              </h2>


              {isLoading ? (

                <div className="flex h-56 items-center justify-center">

                  <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />

                </div>

              ) : orders.length === 0 ? (

                <p className="py-16 text-center text-sm text-stone-400">

                  No orders yet.

                </p>

              ) : (

                <div className="h-56 w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={statusData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                      >

                        {statusData.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={entry.color}
                            />

                          )
                        )}

                      </Pie>


                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border:
                            "1px solid #e7e5e4",
                          fontSize: 12,
                        }}
                      />


                      <Legend
                        wrapperStyle={{
                          fontSize: 12,
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              )}

            </section>


            {/* MENU COMPOSITION */}

            <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">

              <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-stone-900">

                <PiBowlFood className="h-4 w-4 text-orange-500" />

                Menu Composition

              </h2>


              {isLoading ? (

                <div className="flex h-56 items-center justify-center">

                  <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />

                </div>

              ) : items.length === 0 ? (

                <p className="py-16 text-center text-sm text-stone-400">

                  No menu items yet.

                </p>

              ) : (

                <div className="h-56 w-full">

                  <ResponsiveContainer
                    width="100%"
                    height="100%"
                  >

                    <PieChart>

                      <Pie
                        data={vegSplitData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={45}
                        outerRadius={75}
                        paddingAngle={2}
                      >

                        {vegSplitData.map(
                          (entry, index) => (

                            <Cell
                              key={index}
                              fill={entry.color}
                            />

                          )
                        )}

                      </Pie>


                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border:
                            "1px solid #e7e5e4",
                          fontSize: 12,
                        }}
                      />


                      <Legend
                        wrapperStyle={{
                          fontSize: 12,
                        }}
                      />

                    </PieChart>

                  </ResponsiveContainer>

                </div>

              )}

            </section>

          </div>


          {/* ==================================
              TOP SELLING ITEMS
          ================================== */}

          <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm sm:p-5">

            <h2 className="mb-4 flex items-center gap-2 text-base font-bold text-stone-900">

              <FiBarChart2 className="h-4 w-4 text-orange-500" />

              Top Selling Items

            </h2>


            {isLoading ? (

              <div className="flex h-64 items-center justify-center">

                <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />

              </div>

            ) : topItems.length === 0 ? (

              <p className="py-16 text-center text-sm text-stone-400">

                No order line-item data available yet.

              </p>

            ) : (

              <div className="h-64 w-full">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <BarChart
                    data={topItems}
                    layout="vertical"
                    margin={{
                      top: 5,
                      right: 20,
                      left: 10,
                      bottom: 0,
                    }}
                  >

                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#e7e5e4"
                      horizontal={false}
                    />

                    <XAxis
                      type="number"
                      tick={{
                        fontSize: 11,
                        fill: "#78716c",
                      }}
                      allowDecimals={false}
                    />

                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tick={{
                        fontSize: 11,
                        fill: "#44403c",
                      }}
                    />

                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border:
                          "1px solid #e7e5e4",
                        fontSize: 12,
                      }}
                    />

                    <Bar
                      dataKey="qty"
                      fill={ORANGE}
                      radius={[0, 6, 6, 0]}
                      barSize={18}
                    />

                  </BarChart>

                </ResponsiveContainer>

              </div>

            )}

          </section>


        </div>

      </main>

    </div>

  );

};


export default AdminAnalytics;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getData } from "@/context/userContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

/* ---------- react-icons imports ---------- */
import {
  FiSearch,
  FiClock,
  FiRotateCcw,
  FiArrowRight,
  FiShoppingBag,
  FiTrendingUp,
  FiChevronRight,
} from "react-icons/fi";
import { HiOutlineMapPin } from "react-icons/hi2";
import { MdOutlineFastfood } from "react-icons/md";
import { CgSpinner } from "react-icons/cg";

import saladImg from "../../assets/images/salad.jpeg";
import parathaImg from "../../assets/images/paratha.jpeg";
import idliImg from "../../assets/images/idli.jpeg";
import dosaImg from "../../assets/images/dosa.jpeg";
import chineseImg from "../../assets/images/chinese.jpeg";
import cakesImg from "../../assets/images/cakes.jpeg";
import burgerImg from "../../assets/images/burger.jpeg";
import choleBhatureImg from "../../assets/images/chole_bature.jpeg";
import iceCreamImg from "../../assets/images/ice_creams.jpeg";
import gulabJamunImg from "../../assets/images/gulab_jamun.jpeg";

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  },
  withCredentials: true,
});

const CATEGORIES = [
  { name: "Salad", image: saladImg },
  { name: "Paratha", image: parathaImg },
  { name: "Idli", image: idliImg },
  { name: "Dosa", image: dosaImg },
  { name: "Chinese", image: chineseImg },
  { name: "Cakes", image: cakesImg },
  { name: "Burger", image: burgerImg },
  { name: "Chole Bhature", image: choleBhatureImg },
  { name: "Ice Cream", image: iceCreamImg },
  { name: "Gulab Jamun", image: gulabJamunImg },
];

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

const CustomerHome = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = getData();

  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoadingGroups(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurant/food/all-grouped`
        );
        if (res.data.success) setGroups(res.data.data || []);
      } catch (err) {
        // Silently fail to keep page usable
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchGroups();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!localStorage.getItem("accessToken")) {
        setLoadingOrders(false);
        return;
      }
      try {
        setLoadingOrders(true);
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/customer`,
          authHeaders()
        );
        if (res.data.success) setRecentOrders((res.data.orders || []).slice(0, 3));
      } catch (err) {
        // Skip silently if orders fail to load
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate("/customer/browse", { state: { initialSearch: search.trim() } });
    }
  };

  const handleCategoryClick = (name) => {
    navigate("/customer/browse", { state: { initialCategory: name } });
  };

  const handleReorder = (order) => {
    navigate("/customer/browse", {
      state: {
        restaurantId: order.restaurant?._id,
        restaurantName: order.restaurant?.restaurantName || order.restaurant?.username,
      },
    });
  };

  const openRestaurants = groups.filter((g) => g.restaurant.isOpen).slice(0, 6);
  const displayName = user?.username?.split(" ")[0] || user?.name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans overflow-x-hidden">
      {/* ── Hero Banner ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-5 pb-7 sm:pt-6 sm:pb-8 shadow-md">
        <div className="relative mx-auto max-w-5xl">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs sm:text-sm font-medium text-orange-100">
              {userLoading ? (
                <span className="inline-block h-4 w-28 animate-pulse rounded bg-white/20" />
              ) : (
                `${getGreeting()}, ${displayName} 👋`
              )}
            </p>

            {user?.address && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md max-w-[45%]">
                <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0 text-orange-200" />
                <span className="truncate">{user.address}</span>
              </div>
            )}
          </div>

          <h1 className="mb-5 text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl sm:leading-tight">
            What are you craving today?
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="max-w-xl">
            <div className="relative flex items-center">
              <FiSearch className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400 z-10" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes, cuisines..."
                className="h-12 w-full rounded-2xl border-none bg-white !pl-10 !pr-[4.5rem] sm:!pr-24 text-sm text-stone-800 shadow-lg placeholder:text-stone-400 placeholder:truncate focus-visible:ring-2 focus-visible:ring-orange-300"
              />
              <Button
                type="submit"
                size="sm"
                className="absolute right-1.5 h-9 shrink-0 rounded-xl bg-stone-900 px-3 sm:px-4 text-xs font-semibold text-white hover:bg-stone-800"
              >
                Search
              </Button>
            </div>
          </form>

          {user?.address && (
            <p className="mt-3 flex items-center gap-1 text-xs text-orange-100 sm:hidden">
              <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">Delivering to {user.address}</span>
            </p>
          )}
        </div>
      </div>

      {/* ── Main Body Container ── */}
      <div className="mx-auto max-w-5xl px-4 pt-6 space-y-8">
        {/* ── Categories Carousel ── */}
        <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <FiTrendingUp className="text-orange-500 h-4 w-4 shrink-0" />
              Explore Categories
            </h2>
          </div>
          <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                onClick={() => handleCategoryClick(cat.name)}
                className="group flex shrink-0 cursor-pointer flex-col items-center gap-2 focus:outline-none"
              >
                <div className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-stone-100 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:border-orange-500">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <span className="text-[11px] sm:text-xs font-semibold text-stone-600 group-hover:text-orange-600 whitespace-nowrap">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Order Again Section ── */}
        {!loadingOrders && recentOrders.length > 0 && (
          <section>
            <div className="mb-3 flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
                <FiRotateCcw className="h-4 w-4 shrink-0 text-orange-500" />
                Order again
              </h2>
              <button
                onClick={() => navigate("/order_history")}
                className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
              >
                View history <FiChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {recentOrders.map((order) => (
                <button
                  key={order._id}
                  onClick={() => handleReorder(order)}
                  className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none"
                >
                  <div>
                    <div className="mb-1.5 flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                        <FiShoppingBag className="h-3.5 w-3.5" />
                      </div>
                      <p className="truncate text-sm font-bold text-stone-800 group-hover:text-orange-600">
                        {order.restaurant?.restaurantName ||
                          order.restaurant?.username ||
                          "Restaurant"}
                      </p>
                    </div>
                    <p className="line-clamp-2 text-xs font-medium text-stone-400">
                      {order.items?.map((i) => i.name).join(", ") || "View menu"}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs font-semibold text-orange-600">
                    <span>Repeat Order</span>
                    <FiArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Open Restaurants Section ── */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
              <MdOutlineFastfood className="h-5 w-5 shrink-0 text-orange-500" />
              Open Restaurants Nearby
            </h2>
            <button
              onClick={() => navigate("/customer/browse")}
              className="flex shrink-0 items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              See all <FiArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {loadingGroups ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-stone-100">
              <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />
              <p className="mt-2 text-xs font-medium text-stone-400 text-center px-4">
                Finding best spots near you...
              </p>
            </div>
          ) : openRestaurants.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-10 px-4 text-center">
              <p className="text-sm font-semibold text-stone-600">
                No restaurants are open right now.
              </p>
              <p className="mt-1 text-xs text-stone-400">
                Please check back in a little while!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {openRestaurants.map(({ restaurant }) => (
                <button
                  key={restaurant._id}
                  onClick={() =>
                    navigate("/customer/browse", {
                      state: {
                        restaurantId: restaurant._id,
                        restaurantName:
                          restaurant.restaurantName || restaurant.username,
                      },
                    })
                  }
                  className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus:outline-none"
                >
                  <div className="relative h-36 w-full overflow-hidden bg-stone-100">
                    <img
                      src={
                        restaurant.photoUrl ||
                        restaurant.avatar ||
                        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
                      }
                      alt={restaurant.restaurantName}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3">
                      <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white shadow-sm">
                        Open
                      </Badge>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div>
                      <h3 className="line-clamp-1 text-base font-bold text-stone-900 group-hover:text-orange-600">
                        {restaurant.restaurantName || restaurant.username}
                      </h3>
                      {restaurant.cuisine && (
                        <p className="mt-0.5 truncate text-xs font-medium text-stone-500">
                          {restaurant.cuisine}
                        </p>
                      )}
                    </div>

                    {restaurant.openingTime && restaurant.closingTime && (
                      <div className="mt-3 flex items-center gap-1.5 border-t border-stone-100 pt-2 text-xs text-stone-400">
                        <FiClock className="h-3.5 w-3.5 shrink-0 text-stone-400" />
                        <span className="truncate">
                          {restaurant.openingTime} - {restaurant.closingTime}
                        </span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CustomerHome;
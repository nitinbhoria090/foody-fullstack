// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { getData } from "@/context/userContext";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";

// /* ---------- react-icons imports ---------- */
// import {
//   FiSearch,
//   FiClock,
//   FiRotateCcw,
//   FiArrowRight,
//   FiShoppingBag,
//   FiTrendingUp,
//   FiChevronRight,
// } from "react-icons/fi";
// import { HiOutlineMapPin } from "react-icons/hi2";
// import { MdOutlineFastfood } from "react-icons/md";
// import { CgSpinner } from "react-icons/cg";

// import saladImg from "../../assets/images/salad.jpeg";
// import parathaImg from "../../assets/images/paratha.jpeg";
// import idliImg from "../../assets/images/idli.jpeg";
// import dosaImg from "../../assets/images/dosa.jpeg";
// import chineseImg from "../../assets/images/chinese.jpeg";
// import cakesImg from "../../assets/images/cakes.jpeg";
// import burgerImg from "../../assets/images/burger.jpeg";
// import choleBhatureImg from "../../assets/images/chole_bature.jpeg";
// import iceCreamImg from "../../assets/images/ice_creams.jpeg";
// import gulabJamunImg from "../../assets/images/gulab_jamun.jpeg";

// const authHeaders = () => ({
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//   },
//   withCredentials: true,
// });
// const [categories, setCategories] = useState([]);

// const CATEGORIES = [
//   { name: "Salad", image: saladImg },
//   { name: "Paratha", image: parathaImg },
//   { name: "Idli", image: idliImg },
//   { name: "Dosa", image: dosaImg },
//   { name: "Chinese", image: chineseImg },
//   { name: "Cakes", image: cakesImg },
//   { name: "Burger", image: burgerImg },
//   { name: "Chole Bhature", image: choleBhatureImg },
//   { name: "Ice Cream", image: iceCreamImg },
//   { name: "Gulab Jamun", image: gulabJamunImg },
// ];

// const getGreeting = () => {
//   const hour = new Date().getHours();
//   if (hour < 12) return "Good morning";
//   if (hour < 17) return "Good afternoon";
//   return "Good evening";
// };

// const CustomerHome = () => {
//   const navigate = useNavigate();
//   const { user, loading: userLoading } = getData();

//   const [search, setSearch] = useState("");
//   const [groups, setGroups] = useState([]);
//   const [loadingGroups, setLoadingGroups] = useState(true);
//   const [recentOrders, setRecentOrders] = useState([]);
//   const [loadingOrders, setLoadingOrders] = useState(true);

//   useEffect(() => {
//     const fetchGroups = async () => {
//       try {
//         setLoadingGroups(true);
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/api/v1/restaurant/food/all-grouped`
//         );
//         if (res.data.success) setGroups(res.data.data || []);
//       } catch (err) {
//         // Silently fail to keep page usable
//       } finally {
//         setLoadingGroups(false);
//       }
//     };
//     fetchGroups();
//   }, []);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       if (!localStorage.getItem("accessToken")) {
//         setLoadingOrders(false);
//         return;
//       }
//       try {
//         setLoadingOrders(true);
//         const res = await axios.get(
//           `${import.meta.env.VITE_API_BASE_URL}/api/v1/order/customer`,
//           authHeaders()
//         );
//         if (res.data.success) setRecentOrders((res.data.orders || []).slice(0, 3));
//       } catch (err) {
//         // Skip silently if orders fail to load
//       } finally {
//         setLoadingOrders(false);
//       }
//     };
//     fetchOrders();
//   }, []);

//   const handleSearchSubmit = (e) => {
//     e.preventDefault();
//     if (search.trim()) {
//       navigate("/customer/browse", { state: { initialSearch: search.trim() } });
//     }
//   };

//   const handleCategoryClick = (name) => {
//     navigate("/customer/browse", { state: { initialCategory: name } });
//   };

//   const handleReorder = (order) => {
//     navigate("/customer/browse", {
//       state: {
//         restaurantId: order.restaurant?._id,
//         restaurantName: order.restaurant?.restaurantName || order.restaurant?.username,
//       },
//     });
//   };

//   const openRestaurants = groups.filter((g) => g.restaurant.isOpen).slice(0, 6);
//   const displayName = user?.username?.split(" ")[0] || user?.name?.split(" ")[0] || "there";

//   return (
//     <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans overflow-x-hidden">
//       {/* ── Hero Banner ── */}
//       <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-5 pb-7 sm:pt-6 sm:pb-8 shadow-md">
//         <div className="relative mx-auto max-w-5xl">
//           <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
//             <p className="text-xs sm:text-sm font-medium text-orange-100">
//               {userLoading ? (
//                 <span className="inline-block h-4 w-28 animate-pulse rounded bg-white/20" />
//               ) : (
//                 `${getGreeting()}, ${displayName} 👋`
//               )}
//             </p>

//             {user?.address && (
//               <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-black/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-md max-w-[45%]">
//                 <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0 text-orange-200" />
//                 <span className="truncate">{user.address}</span>
//               </div>
//             )}
//           </div>

//           <h1 className="mb-5 text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl sm:leading-tight">
//             What are you craving today?
//           </h1>

//           {/* Search Bar */}
//           <form onSubmit={handleSearchSubmit} className="max-w-xl">
//             <div className="relative flex items-center">
//               <FiSearch className="pointer-events-none absolute left-3.5 h-4 w-4 shrink-0 text-stone-400 z-10" />
//               <Input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search dishes, cuisines..."
//                 className="h-12 w-full rounded-2xl border-none bg-white !pl-10 !pr-[4.5rem] sm:!pr-24 text-sm text-stone-800 shadow-lg placeholder:text-stone-400 placeholder:truncate focus-visible:ring-2 focus-visible:ring-orange-300"
//               />
//               <Button
//                 type="submit"
//                 size="sm"
//                 className="absolute right-1.5 h-9 shrink-0 rounded-xl bg-stone-900 px-3 sm:px-4 text-xs font-semibold text-white hover:bg-stone-800"
//               >
//                 Search
//               </Button>
//             </div>
//           </form>

//           {user?.address && (
//             <p className="mt-3 flex items-center gap-1 text-xs text-orange-100 sm:hidden">
//               <HiOutlineMapPin className="h-3.5 w-3.5 shrink-0" />
//               <span className="truncate">Delivering to {user.address}</span>
//             </p>
//           )}
//         </div>
//       </div>

//       {/* ── Main Body Container ── */}
//       <div className="mx-auto max-w-5xl px-4 pt-6 space-y-8">
//         {/* ── Categories Carousel ── */}
//         <section className="rounded-2xl border border-stone-200/80 bg-white p-4 shadow-sm">
//           <div className="mb-3 flex items-center justify-between">
//             <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
//               <FiTrendingUp className="text-orange-500 h-4 w-4 shrink-0" />
//               Explore Categories
//             </h2>
//           </div>
//           <div className="flex items-center gap-4 sm:gap-5 overflow-x-auto pb-2 pt-1 no-scrollbar -mx-1 px-1">
//             {CATEGORIES.map((cat) => (
//               <button
//                 key={cat.name}
//                 onClick={() => handleCategoryClick(cat.name)}
//                 className="group flex shrink-0 cursor-pointer flex-col items-center gap-2 focus:outline-none"
//               >
//                 <div className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden rounded-full border-2 border-stone-100 p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105 group-hover:border-orange-500">
//                   <img
//                     src={cat.image}
//                     alt={cat.name}
//                     className="h-full w-full rounded-full object-cover"
//                   />
//                 </div>
//                 <span className="text-[11px] sm:text-xs font-semibold text-stone-600 group-hover:text-orange-600 whitespace-nowrap">
//                   {cat.name}
//                 </span>
//               </button>
//             ))}
//           </div>
//         </section>

//         {/* ── Order Again Section ── */}
//         {!loadingOrders && recentOrders.length > 0 && (
//           <section>
//             <div className="mb-3 flex items-center justify-between">
//               <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
//                 <FiRotateCcw className="h-4 w-4 shrink-0 text-orange-500" />
//                 Order again
//               </h2>
//               <button
//                 onClick={() => navigate("/order_history")}
//                 className="flex shrink-0 items-center gap-0.5 text-xs font-semibold text-orange-600 hover:text-orange-700"
//               >
//                 View history <FiChevronRight className="h-3 w-3" />
//               </button>
//             </div>
//             <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
//               {recentOrders.map((order) => (
//                 <button
//                   key={order._id}
//                   onClick={() => handleReorder(order)}
//                   className="group flex flex-col justify-between rounded-2xl border border-stone-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none"
//                 >
//                   <div>
//                     <div className="mb-1.5 flex items-center gap-2">
//                       <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
//                         <FiShoppingBag className="h-3.5 w-3.5" />
//                       </div>
//                       <p className="truncate text-sm font-bold text-stone-800 group-hover:text-orange-600">
//                         {order.restaurant?.restaurantName ||
//                           order.restaurant?.username ||
//                           "Restaurant"}
//                       </p>
//                     </div>
//                     <p className="line-clamp-2 text-xs font-medium text-stone-400">
//                       {order.items?.map((i) => i.name).join(", ") || "View menu"}
//                     </p>
//                   </div>
//                   <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-2.5 text-xs font-semibold text-orange-600">
//                     <span>Repeat Order</span>
//                     <FiArrowRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-1" />
//                   </div>
//                 </button>
//               ))}
//             </div>
//           </section>
//         )}

//         {/* ── Open Restaurants Section ── */}
//         <section>
//           <div className="mb-3 flex items-center justify-between">
//             <h2 className="flex items-center gap-2 text-base font-bold text-stone-900">
//               <MdOutlineFastfood className="h-5 w-5 shrink-0 text-orange-500" />
//               Open Restaurants Nearby
//             </h2>
//             <button
//               onClick={() => navigate("/customer/browse")}
//               className="flex shrink-0 items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
//             >
//               See all <FiArrowRight className="h-3.5 w-3.5" />
//             </button>
//           </div>

//           {loadingGroups ? (
//             <div className="flex flex-col items-center justify-center py-12 bg-white rounded-2xl border border-stone-100">
//               <CgSpinner className="h-7 w-7 animate-spin text-orange-500" />
//               <p className="mt-2 text-xs font-medium text-stone-400 text-center px-4">
//                 Finding best spots near you...
//               </p>
//             </div>
//           ) : openRestaurants.length === 0 ? (
//             <div className="rounded-2xl border border-dashed border-stone-300 bg-white py-10 px-4 text-center">
//               <p className="text-sm font-semibold text-stone-600">
//                 No restaurants are open right now.
//               </p>
//               <p className="mt-1 text-xs text-stone-400">
//                 Please check back in a little while!
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//               {openRestaurants.map(({ restaurant }) => (
//                 <button
//                   key={restaurant._id}
//                   onClick={() =>
//                     navigate("/customer/browse", {
//                       state: {
//                         restaurantId: restaurant._id,
//                         restaurantName:
//                           restaurant.restaurantName || restaurant.username,
//                       },
//                     })
//                   }
//                   className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-orange-300 hover:shadow-md focus:outline-none"
//                 >
//                   <div className="relative h-36 w-full overflow-hidden bg-stone-100">
//                     <img
//                       src={
//                         restaurant.photoUrl ||
//                         restaurant.avatar ||
//                         "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80"
//                       }
//                       alt={restaurant.restaurantName}
//                       className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                     <div className="absolute top-3 right-3">
//                       <Badge className="border-none bg-emerald-500 px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase text-white shadow-sm">
//                         Open
//                       </Badge>
//                     </div>
//                   </div>

//                   <div className="flex flex-1 flex-col justify-between p-4">
//                     <div>
//                       <h3 className="line-clamp-1 text-base font-bold text-stone-900 group-hover:text-orange-600">
//                         {restaurant.restaurantName || restaurant.username}
//                       </h3>
//                       {restaurant.cuisine && (
//                         <p className="mt-0.5 truncate text-xs font-medium text-stone-500">
//                           {restaurant.cuisine}
//                         </p>
//                       )}
//                     </div>

//                     {restaurant.openingTime && restaurant.closingTime && (
//                       <div className="mt-3 flex items-center gap-1.5 border-t border-stone-100 pt-2 text-xs text-stone-400">
//                         <FiClock className="h-3.5 w-3.5 shrink-0 text-stone-400" />
//                         <span className="truncate">
//                           {restaurant.openingTime} - {restaurant.closingTime}
//                         </span>
//                       </div>
//                     )}
//                   </div>
//                 </button>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default CustomerHome;


import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import API from "../../services/axios";

import { FiSearch, FiShoppingCart } from "react-icons/fi";
import { HiOutlineMapPin } from "react-icons/hi2";



function CustomerHome() {

    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);

    const [cartCount, setCartCount] = useState(0);
    const [cartPos, setCartPos] = useState({ x: window.innerWidth - 90, y: window.innerHeight - 120 });
    const [dragging, setDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

   useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchCartCount();
}, []);
const fetchCartCount = async () => {
    try {
        const res = await API.get(`${import.meta.env.VITE_APP_API_URL}/cart`);
        if (res.data.success) {
            const count = res.data.cart.items?.reduce(
                (sum, item) => sum + item.quantity,
                0
            );
            setCartCount(count || 0);
        }
    } catch (error) {
        console.log(error);
    }
};

    const fetchCategories = async () => {

        try {

            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/categories`
            );

            if (res.data.success) {

                setCategories(res.data.categories);

            }

        } catch (error) {

            console.log(error);

        }

    };

    const handleSearch = (e) => {

        e.preventDefault();

        if (search.trim()) {

            navigate(`/search?keyword=${search}`);

        }

    };
    const fetchProducts = async () => {

        try {

            const res = await axios.get(
                `${import.meta.env.VITE_APP_API_URL}/api/products`
            );

            if (res.data.success) {

                setProducts(res.data.products);

            }

        } catch (error) {

            console.log(error);

        }

    };
const addToCart = async (productId) => {
    try {
        const res = await API.post(`${import.meta.env.VITE_APP_API_URL}/api/cart/add`, {
            productId,
            quantity: 1,
        });

        if (res.data.success) {
            toast.success("Added to Cart");
            setCartCount((prev) => prev + 1);
        }
    } catch (err) {
        toast.error(err.response?.data?.message || "Failed to add item");
    }
};
const handleDragStart = (e) => {
    setDragging(true);
    const point = e.touches ? e.touches[0] : e;
    dragOffset.current = {
        x: point.clientX - cartPos.x,
        y: point.clientY - cartPos.y,
    };
};

const handleDragMove = (e) => {
    if (!dragging) return;
    const point = e.touches ? e.touches[0] : e;

    let newX = point.clientX - dragOffset.current.x;
    let newY = point.clientY - dragOffset.current.y;

    // screen ke andar hi rakhne ke liye clamp
    newX = Math.max(10, Math.min(window.innerWidth - 70, newX));
    newY = Math.max(10, Math.min(window.innerHeight - 70, newY));

    setCartPos({ x: newX, y: newY });
};

const handleDragEnd = () => {
    setDragging(false);
};

useEffect(() => {
    if (dragging) {
        window.addEventListener("mousemove", handleDragMove);
        window.addEventListener("mouseup", handleDragEnd);
        window.addEventListener("touchmove", handleDragMove);
        window.addEventListener("touchend", handleDragEnd);
    }
    return () => {
        window.removeEventListener("mousemove", handleDragMove);
        window.removeEventListener("mouseup", handleDragEnd);
        window.removeEventListener("touchmove", handleDragMove);
        window.removeEventListener("touchend", handleDragEnd);
    };
}, [dragging]);

// screen resize / rotate hone par icon ko viewport ke andar hi clamp rakhna
useEffect(() => {
    const handleResize = () => {
        setCartPos((prev) => ({
            x: Math.max(10, Math.min(window.innerWidth - 70, prev.x)),
            y: Math.max(10, Math.min(window.innerHeight - 70, prev.y)),
        }));
    };

    window.addEventListener("resize", handleResize);
    // mount pe bhi ek baar clamp kar do (agar chhoti screen pe load hua ho)
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
}, []);

    return (

        <div className="min-h-screen bg-gray-50">

            {/* Hero */}

            <div className="bg-gradient-to-r from-orange-500 to-red-500 py-14">

                <div className="max-w-7xl mx-auto px-5">

                    <p className="text-white flex items-center gap-2">

                        <HiOutlineMapPin />

                        Delivering Fresh Food

                    </p>

                    <h1 className="text-5xl font-bold text-white mt-4">

                        Order Your Favourite Food

                    </h1>

                    <p className="text-orange-100 mt-3">

                        Fast Delivery • Fresh Food • Best Taste

                    </p>

                    <form
                        onSubmit={handleSearch}
                        className="mt-8 max-w-xl"
                    >

                        <div className="relative">

                            <FiSearch
                                className="absolute left-5 top-5 text-gray-500"
                            />

                            <input
                                type="text"
                                placeholder="Search food..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full rounded-full pl-14 pr-40 py-5 shadow-lg outline-none"
                            />

                            <button
                                className="absolute right-2 top-2 bg-orange-500 text-white px-8 py-3 rounded-full"
                            >

                                Search

                            </button>

                        </div>

                    </form>

                </div>

            </div>

            {/* Categories */}

            <div className="max-w-7xl mx-auto px-5 mt-12">

                <div className="flex justify-between items-center">

                    <h2 className="text-3xl font-bold">

                        Explore Categories

                    </h2>


                </div>

                <div className="flex gap-8 overflow-x-auto mt-8 pb-3">

                    {

                        categories.map((category) => (

                            <div
                                key={category._id}
                                onClick={() =>
                                    navigate(`/category/${category._id}`)
                                    // navigate(`/category/${category.name.toLowerCase()}`)
                                }
                                className="cursor-pointer flex flex-col items-center group shrink-0"
                            >

                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg group-hover:scale-110 transition"
                                />

                                <p className="mt-3 font-semibold">

                                    {category.name}

                                </p>

                            </div>

                        ))

                    }

                </div>

            </div>
            {/* Trending Foods */}

            <div className="max-w-7xl mx-auto px-5 mt-16">

                <div className="flex justify-between items-center">

                    <h2 className="text-3xl font-bold">

                        🔥 Trending Foods

                    </h2>

                    <button
                        className="text-orange-500 font-semibold"
                    >
                        View All
                    </button>

                </div>

                <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 gap-8 mt-10">

                    {

                        products.map((item) => (

                            <div
                                key={item._id}
                                className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl transition duration-300 cursor-pointer"
                                onClick={() => navigate(`/product/${item._id}`)}
                            >

                                <div className="relative">

                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="h-56 w-full object-cover"
                                    />

                                    <span
                                        className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm"
                                    >

                                        20% OFF

                                    </span>

                                </div>

                                <div className="p-5">

                                    <h3
                                        className="text-xl font-bold"
                                    >

                                        {item.name}

                                    </h3>

                                    <p
                                        className="text-gray-500 mt-2 line-clamp-2"
                                    >

                                        {item.description}

                                    </p>

                                    <div
                                        className="flex justify-between items-center mt-5"
                                    >

                                        <h4
                                            className="text-2xl font-bold text-orange-600"
                                        >

                                            ₹{item.price}

                                        </h4>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item._id);
                                            }}
                                        >
                                            Add
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>
            {/* Offer Banner */}

            <div className="max-w-7xl mx-auto px-5 mt-20">

                <div className="bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 rounded-3xl p-10 flex flex-col md:flex-row justify-between items-center">

                    <div>

                        <h2 className="text-4xl font-bold text-white">

                            Flat 40% OFF 🍕

                        </h2>

                        <p className="text-orange-100 mt-3 text-lg">

                            On your first order. Limited time offer.

                        </p>

                        <button
                            className="mt-6 bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:scale-105 transition"
                        >

                            Order Now

                        </button>

                    </div>

                    <img
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=700"
                        alt="Offer"
                        className="w-80 rounded-2xl shadow-xl mt-8 md:mt-0"
                    />

                </div>

            </div>

            {/* Best Sellers */}

            <div className="max-w-7xl mx-auto px-5 mt-20">

                <h2 className="text-3xl font-bold mb-10">

                    ⭐ Best Sellers

                </h2>

                <div className="grid lg:grid-cols-3 gap-8">

                    {

                        products.slice(0, 3).map((item) => (

                            <div
                                key={item._id}
                                onClick={() => navigate(`/product/${item._id}`)}
                                className="bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition cursor-pointer"
                            >

                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-56 w-full object-cover"
                                />

                                <div className="p-6">

                                    <div className="flex justify-between">

                                        <h3 className="text-2xl font-bold">

                                            {item.name}

                                        </h3>

                                        <span className="text-yellow-500">

                                            ⭐4.8

                                        </span>

                                    </div>

                                    <p className="text-gray-500 mt-3">

                                        {item.description}

                                    </p>

                                    <div className="flex justify-between items-center mt-6">

                                        <span className="text-2xl font-bold text-orange-600">

                                            ₹{item.price}

                                        </span>

                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                addToCart(item._id);
                                            }}
                                            className="bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
                                        >
                                            Add
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))

                    }

                </div>

            </div>

            {/* Features */}

            <div className="bg-white mt-24 py-16">

                <div className="max-w-7xl mx-auto px-5 grid md:grid-cols-3 gap-10 text-center">

                    <div>

                        <div className="text-5xl">

                            🚚

                        </div>

                        <h3 className="text-xl font-bold mt-5">

                            Fast Delivery

                        </h3>

                        <p className="text-gray-500 mt-2">

                            Food delivered within 30 minutes.

                        </p>

                    </div>

                    <div>

                        <div className="text-5xl">

                            🍔

                        </div>

                        <h3 className="text-xl font-bold mt-5">

                            Fresh Food

                        </h3>

                        <p className="text-gray-500 mt-2">

                            Made fresh with premium ingredients.

                        </p>

                    </div>

                    <div>

                        <div className="text-5xl">

                            💳

                        </div>

                        <h3 className="text-xl font-bold mt-5">

                            Secure Payment

                        </h3>

                        <p className="text-gray-500 mt-2">

                            Razorpay powered secure checkout.

                        </p>

                    </div>

                </div>

            </div>

            {/* Floating Draggable Cart Icon */}

            {cartCount > 0 && (
                <div
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onClick={() => {
                        if (!dragging) navigate("/cart");
                    }}
                    style={{
                        left: `${cartPos.x}px`,
                        top: `${cartPos.y}px`,
                    }}
                    className="fixed z-50 flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-orange-600 shadow-2xl cursor-grab active:cursor-grabbing select-none hover:scale-105 transition-transform touch-none"
                >
                    <FiShoppingCart className="text-white text-xl sm:text-2xl" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] sm:text-xs font-bold rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center border-2 border-white">
                        {cartCount}
                    </span>
                </div>
            )}


        </div>

    );
}

export default CustomerHome;
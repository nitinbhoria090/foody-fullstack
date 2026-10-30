
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

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";
import { toast } from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  Star,
  ArrowRight,
  UtensilsCrossed,
} from "lucide-react";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [catRes, productRes] = await Promise.all([
        API.get("/categories"),
        API.get("/products"),
      ]);

      setCategories(catRes.data.categories || []);
      setProducts(productRes.data.products || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}

      <section className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between px-6 py-20 lg:flex-row">

          <div className="max-w-xl">

            <span className="rounded-full bg-white/20 px-4 py-2 text-sm">
              Fast Delivery 🚀
            </span>

            <h1 className="mt-6 text-5xl font-extrabold leading-tight">
              Delicious Food Delivered To Your Door
            </h1>

            <p className="mt-5 text-lg text-orange-100">
              Order your favourite meals from the best restaurants in your city.
            </p>

            <div className="mt-8 flex gap-4">

              <button className="rounded-xl bg-white px-6 py-3 font-semibold text-orange-600 transition hover:scale-105">
                Order Now
              </button>

              <button className="flex items-center gap-2 rounded-xl border border-white px-6 py-3 transition hover:bg-white hover:text-orange-600">
                Explore Menu
                <ArrowRight size={18} />
              </button>

            </div>

          </div>

          <img
            src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"
            alt="Burger"
            className="mt-12 w-[450px] rounded-3xl shadow-2xl lg:mt-0"
          />

        </div>
      </section>

      {/* Search */}

      <section className="mx-auto -mt-10 max-w-5xl px-5">
        <div className="flex items-center rounded-2xl bg-white p-4 shadow-lg">

          <Search className="text-gray-400" />

          <input
            placeholder="Search food..."
            className="ml-3 w-full outline-none"
          />

        </div>
      </section>

      {/* Categories */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="mb-8 flex items-center justify-between">

          <h2 className="text-3xl font-bold">
            Categories
          </h2>

        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">

          {categories.map((cat) => (

            <div
              key={cat._id}
              className="cursor-pointer rounded-3xl bg-white p-5 shadow transition hover:-translate-y-2 hover:shadow-xl"
            >

              <img
                src={cat.image}
                alt={cat.name}
                className="mx-auto h-24 w-24 rounded-full object-cover"
              />

              <h3 className="mt-4 text-center text-lg font-semibold">
                {cat.name}
              </h3>

            </div>

          ))}

        </div>

      </section>

      {/* Products */}

      <section className="mx-auto max-w-7xl px-6 pb-20">

        <div className="mb-8 flex justify-between">

          <h2 className="text-3xl font-bold">
            Popular Dishes
          </h2>

          <Link
            to="/products"
            className="font-semibold text-orange-500"
          >
            View All
          </Link>

        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

          {products.slice(0, 8).map((product) => (

            <div
              key={product._id}
              className="overflow-hidden rounded-3xl bg-white shadow transition hover:-translate-y-2 hover:shadow-2xl"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-60 w-full object-cover"
              />

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <h3 className="text-xl font-bold">
                    {product.name}
                  </h3>

                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" />
                    {product.rating || 4.8}
                  </span>

                </div>

                <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                  {product.description}
                </p>

                <div className="mt-5 flex items-center justify-between">

                  <span className="text-2xl font-bold text-orange-500">
                    ₹{product.price}
                  </span>

                  <button
                    className="rounded-xl bg-orange-500 p-3 text-white transition hover:bg-orange-600"
                  >
                    <ShoppingCart size={18} />
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="bg-orange-500 py-20 text-white">

        <div className="mx-auto max-w-6xl text-center">

          <UtensilsCrossed
            className="mx-auto mb-5"
            size={50}
          />

          <h2 className="text-4xl font-bold">
            Hungry?
          </h2>

          <p className="mt-4 text-orange-100">
            Order now and get your favourite meals delivered in minutes.
          </p>

          <button className="mt-8 rounded-full bg-white px-8 py-4 font-bold text-orange-600 transition hover:scale-105">
            Order Foodimport { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/axios";
import { toast } from "react-hot-toast";
import {
  Search,
  ShoppingCart,
  Star,
  ArrowRight,
  UtensilsCrossed,
  Sparkles,
} from "lucide-react";

function Home() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      const [catRes, productRes] = await Promise.all([
        API.get("/categories"),
        API.get("/products"),
      ]);

      setCategories(catRes.data.categories || []);
      setProducts(productRes.data.products || []);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-sm font-medium text-slate-600">
            Fetching delicious recipes...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 antialiased">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-600 text-white">
        {/* Subtle decorative background circles */}
        <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/10 blur-3xl" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center justify-between gap-12 px-6 py-20 lg:flex-row lg:py-28">
          <div className="flex max-w-xl flex-col items-start text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-yellow-300" />
              Fast Delivery 🚀
            </span>

            <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl/tight">
              Delicious Food Delivered To Your Door
            </h1>

            <p className="mt-5 text-base text-orange-100 sm:text-lg">
              Order your favorite meals from top restaurants near you. Fast,
              fresh, and hot.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center justify-center rounded-xl bg-white px-7 py-3.5 font-bold text-orange-600 shadow-lg shadow-black/10 transition-all hover:-translate-y-0.5 hover:bg-orange-50 hover:shadow-xl active:translate-y-0 active:scale-95"
              >
                Order Now
              </Link>

              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold backdrop-blur-md transition-all hover:border-white hover:bg-white hover:text-orange-600 active:scale-95"
              >
                Explore Menu
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="relative w-full max-w-md lg:max-w-lg">
            <div className="aspect-square overflow-hidden rounded-3xl shadow-2xl ring-1 ring-white/20">
              <img
                src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900"
                alt="Delicious Burger"
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Search Bar */}
      <section className="relative z-10 mx-auto -mt-8 max-w-4xl px-6">
        <div className="flex items-center rounded-2xl bg-white p-3 shadow-xl ring-1 ring-slate-900/5 transition-all focus-within:ring-2 focus-within:ring-orange-500">
          <Search className="ml-3 h-5 w-5 shrink-0 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for pizza, burger, sushi..."
            className="w-full bg-transparent px-4 py-2 text-slate-800 placeholder-slate-400 outline-none"
          />
          <button className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-600 active:scale-95">
            Search
          </button>
        </div>
      </section>

      {/* Categories Section */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Explore Categories
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Find what you're craving today
            </p>
          </div>
        </div>

        {categories.length === 0 ? (
          <p className="text-slate-400">No categories found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat._id}
                className="group flex flex-col items-center rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:ring-orange-200"
              >
                <div className="h-20 w-20 overflow-hidden rounded-full bg-orange-50 p-1 transition-transform group-hover:scale-105">
                  <img
                    src={cat.image || "https://via.placeholder.com/150"}
                    alt={cat.name}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <h3 className="mt-4 text-center text-sm font-bold text-slate-800 group-hover:text-orange-500">
                  {cat.name}
                </h3>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Popular Dishes
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Top rated meals picked for you
            </p>
          </div>

          <Link
            to="/products"
            className="group flex items-center gap-1 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
          >
            View All
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {products.length === 0 ? (
          <p className="text-slate-400">No products available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 8).map((product) => (
              <div
                key={product._id}
                className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-900/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  <img
                    src={product.image || "https://via.placeholder.com/300"}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-md">
                    <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                    {product.rating || "4.8"}
                  </div>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h3 className="line-clamp-1 text-base font-bold text-slate-900 group-hover:text-orange-600">
                      {product.name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500">
                      {product.description || "Fresh and delicious item."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between pt-2">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-slate-400">
                        Price
                      </span>
                      <span className="text-lg font-extrabold text-slate-900">
                        ₹{product.price}
                      </span>
                    </div>

                    <button
                      aria-label={`Add ${product.name} to cart`}
                      className="inline-flex items-center justify-center rounded-xl bg-orange-500 p-2.5 text-white shadow-md shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-lg active:scale-90"
                    >
                      <ShoppingCart className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Call To Action */}
      <section className="relative overflow-hidden bg-slate-900 py-20 text-white">
        <div className="pointer-events-none absolute inset-0 opacity-20 bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-500 ring-1 ring-orange-500/20">
            <UtensilsCrossed className="h-8 w-8" />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Hungry for something specific?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Order now and get your favorite meals delivered straight to your
            doorstep in minutes.
          </p>

          <Link
            to="/products"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-orange-500 px-8 py-4 font-bold text-white shadow-lg shadow-orange-500/20 transition-all hover:bg-orange-600 hover:shadow-orange-500/30 active:scale-95"
          >
            Order Food Now
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
          </button>

        </div>

      </section>

    </div>
  );
}

export default Home;
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import API from "../../services/axios";

import { FiArrowLeft, FiStar, FiMapPin, FiShoppingCart } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingRelated, setLoadingRelated] = useState(true);
  const [addingToCart, setAddingToCart] = useState(false);

  // ── Floating cart icon state ──
  const [cartCount, setCartCount] = useState(0);
  const [cartPos, setCartPos] = useState({
    x: window.innerWidth - 90,
    y: window.innerHeight - 120,
  });
  const [dragging, setDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    fetchProduct();
    fetchCartCount();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/products/${id}`
      );

      if (res.data.success) {
        setProduct(res.data.product);
        setReviews(res.data.product.reviews || []);
        fetchRelated(res.data.product.category);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelated = async (categoryId) => {
    try {
      setLoadingRelated(true);

      const res = await axios.get(
        `http://localhost:5000/api/products/category/${categoryId}`
      );

      if (res.data.success) {
        setRelatedProducts(
          res.data.products.filter((p) => p._id !== id).slice(0, 8)
        );
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingRelated(false);
    }
  };

  const fetchCartCount = async () => {
    try {
      const res = await API.get("/cart");
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

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      const res = await API.post("/cart/add", {
        productId: id,
        quantity: 1,
      });

      if (res.data.success) {
        toast.success("Added to Cart");
        setCartCount((prev) => prev + 1);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add item");
    } finally {
      setAddingToCart(false);
    }
  };

  // ── Drag handlers ──
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
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <p className="text-sm font-medium text-stone-400">Product not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans">
      {/* ── Header image ── */}
      <div className="relative h-64 sm:h-96 w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/10" />

        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-stone-800 shadow-md backdrop-blur-sm transition-colors hover:bg-white"
        >
          <FiArrowLeft className="h-4 w-4" />
        </button>

        {product.foodType && (
          <span
            className={`absolute top-4 right-4 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide shadow-md ${
              product.foodType === "veg"
                ? "bg-emerald-500 text-white"
                : "bg-red-500 text-white"
            }`}
          >
            {product.foodType === "veg" ? "Veg" : "Non-Veg"}
          </span>
        )}
      </div>

      <div className="mx-auto max-w-3xl px-4 -mt-8 relative">
        {/* ── Main card ── */}
        <div className="rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-lg">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-stone-900">
                {product.name}
              </h1>

              {product.restaurant?.name && (
                <p className="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-orange-600">
                  <FiMapPin className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{product.restaurant.name}</span>
                </p>
              )}
            </div>
          </div>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-2">
            {avgRating ? (
              <>
                <span className="flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
                  {avgRating}
                  <FiStar className="h-3 w-3 fill-white" />
                </span>
                <span className="text-xs font-medium text-stone-500">
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
                </span>
              </>
            ) : (
              <span className="rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-400">
                No ratings yet
              </span>
            )}
          </div>

          <p className="mt-4 text-sm leading-relaxed text-stone-500">
            {product.description}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-stone-100 pt-5">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              ₹{product.price}
            </span>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="flex items-center gap-2 rounded-xl bg-orange-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-700 active:scale-[0.98] disabled:opacity-60"
            >
              {addingToCart ? (
                <CgSpinner className="h-4 w-4 animate-spin" />
              ) : (
                <FiShoppingCart className="h-4 w-4" />
              )}
              Add to Cart
            </button>
          </div>
        </div>

        {/* ── Reviews ── */}
        <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-6 sm:p-8 shadow-sm">
          <h2 className="text-base font-bold text-stone-900">
            Reviews {reviews.length > 0 && (
              <span className="text-stone-400 font-medium">({reviews.length})</span>
            )}
          </h2>

          {reviews.length === 0 ? (
            <p className="mt-3 text-sm text-stone-400">
              No reviews yet — be the first to try this!
            </p>
          ) : (
            <div className="mt-4 divide-y divide-stone-100">
              {reviews.map((review) => (
                <div key={review._id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-stone-800">
                      {review.userName || "Anonymous"}
                    </span>
                    <span className="flex shrink-0 items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      {review.rating}
                      <FiStar className="h-2.5 w-2.5 fill-white" />
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-stone-500">
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── More like this ── */}
        <div className="mt-6">
          <h2 className="mb-3 text-base font-bold text-stone-900">More like this</h2>

          {loadingRelated ? (
            <div className="flex justify-center rounded-3xl border border-stone-200/80 bg-white py-8">
              <CgSpinner className="h-6 w-6 animate-spin text-orange-600" />
            </div>
          ) : relatedProducts.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-stone-300 bg-white py-8 text-center">
              <p className="text-sm text-stone-400">No similar items found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              {relatedProducts.map((rel) => (
                <button
                  key={rel._id}
                  onClick={() => navigate(`/product/${rel._id}`)}
                  className="group overflow-hidden rounded-2xl border border-stone-200/80 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-300 hover:shadow-md focus:outline-none"
                >
                  <div className="h-24 sm:h-28 w-full overflow-hidden bg-stone-100">
                    <img
                      src={rel.image}
                      alt={rel.name}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate text-xs font-semibold text-stone-800 group-hover:text-orange-600">
                      {rel.name}
                    </p>
                    <p className="mt-0.5 text-xs font-bold text-orange-600">
                      ₹{rel.price}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Floating Draggable Cart Icon ── */}
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

export default ProductDetails;
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FiArrowLeft, FiSave } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

// 💡 Isko EditItem.jsx ke top par replace karein hamesha ke liye
const getAuthConfig = () => {
  // Teeno possible keys check karein (accessToken, Token, token)
  let token = localStorage.getItem("accessToken") || 
              localStorage.getItem("Token") || 
              localStorage.getItem("token");

  // Agar token quotes ke sath saved hai toh string extract karein
  if (token && token.startsWith('"') && token.endsWith('"')) {
    token = token.slice(1, -1);
  }

  console.log("SENDING TOKEN TO BACKEND:", token);

  return {
    headers: {
      Authorization: token ? `Bearer ${token.trim()}` : "",
    },
    withCredentials: true,
  };
};
 

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    foodType: "veg",
    category: "",
    isAvailable: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const config = getAuthConfig();

        const [productRes, categoryRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/products/${id}`, config),
          axios.get(`${import.meta.env.VITE_APP_API_URL}/api/categories`, config),
        ]);

        if (productRes.data.success) {
          const p = productRes.data.product;
          setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            foodType: p.foodType || "veg",
            category: p.category?._id || p.category || "",
            isAvailable: p.isAvailable !== false,
          });
        }

        if (categoryRes.data.success) {
          setCategories(categoryRes.data.categories || categoryRes.data.data || []);
        }
      } catch (err) {
        console.error("Failed to load item:", err.response?.data || err.message);
        setError("Item load nahi ho paya.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError("");

      const config = getAuthConfig();

      const res = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/products/${id}`,
        form,
        config 
      );

      if (res.data.success) {

        navigate("/"); 
      }
    } catch (err) {
      console.error("Failed to update item:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Update fail ho gaya.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <CgSpinner className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans">
      <div className="mx-auto max-w-2xl px-4 pt-6">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center gap-1.5 text-sm font-semibold text-stone-500 hover:text-orange-600"
        >
          <FiArrowLeft className="h-4 w-4" />
          Back
        </button>

        <h1 className="mb-6 text-2xl font-extrabold text-stone-900">Edit Item</h1>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">Price (₹)</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                min="0"
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-stone-600">Food Type</label>
              <select
                name="foodType"
                value={form.foodType}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
              >
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-stone-600">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-stone-200 px-3 py-2 text-sm focus:border-orange-400 focus:outline-none"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isAvailable"
              name="isAvailable"
              checked={form.isAvailable}
              onChange={handleChange}
              className="h-4 w-4 rounded border-stone-300"
            />
            <label htmlFor="isAvailable" className="text-sm font-semibold text-stone-700">
              Available for ordering
            </label>
          </div>

          <Button
            type="submit"
            disabled={saving}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 py-2.5 text-sm font-semibold text-white hover:bg-stone-800"
          >
            {saving ? (
              <CgSpinner className="h-4 w-4 animate-spin" />
            ) : (
              <FiSave className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;

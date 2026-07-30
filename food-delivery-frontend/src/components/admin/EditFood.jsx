import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FiArrowLeft, FiCheck, FiTrash2 } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner"; // ⚠️ swap for your actual toast lib if different

const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
  withCredentials: true,
});

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "", // "veg" | "non-veg"
  });
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [errors, setErrors] = useState({});

  /* ---------- Load existing product ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/products/${id}`,
          authHeaders()
        );
        if (res.data.success) {
          const p = res.data.product;
          setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.price ?? "",
            category: p.category || "",
          });
          setExistingImage(p.image || "");
        } else {
          toast.error("Product not found");
          navigate("/");
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        toast.error(err.response?.data?.message || "Failed to load item");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, navigate]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
    if (!form.category) newErrors.category = "Please select Veg or Non-Veg";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);

      // ⚠️ Note: the current PUT /api/products/:id route has no multer
      // middleware, so it can only update text fields (name, description,
      // price, category) — not the image. Sending JSON here, not FormData.
      const res = await axios.put(
        `${import.meta.env.VITE_APP_API_URL}/api/products/${id}`,
        {
          name: form.name.trim(),
          description: form.description.trim(),
          price: Number(form.price),
          category: form.category,
        },
        authHeaders()
      );

      if (res.data.success) {
        toast.success("Item updated successfully");
        navigate("/admin"); // ⚠️ ADJUST route to your dashboard/items list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update item");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this item? This cannot be undone.")) return;

    try {
      setDeleting(true);
      const res = await axios.delete(
        `${import.meta.env.VITE_APP_API_URL}/api/products/${id}`,
        authHeaders()
      );
      if (res.data.success) {
        toast.success("Item deleted");
        navigate("/admin"); // ⚠️ ADJUST route to your dashboard/items list
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete item");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-stone-50">
        <CgSpinner className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans overflow-x-hidden">
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate(-1)}
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            Edit Item
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-orange-100">
            Update the details for this menu item
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-6"
        >
          {/* Existing Image (read-only) */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Item Image
            </label>
            <div className="h-44 w-full sm:w-56 overflow-hidden rounded-2xl border border-stone-200 bg-stone-100">
              {existingImage ? (
                <img
                  src={existingImage}
                  alt={form.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs text-stone-400">
                  No image
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[11px] text-stone-400">
              Image editing isn't supported yet — add multer to the PUT route to enable this.
            </p>
          </div>

          {/* Name */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Item Name
            </label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="e.g. Paneer Butter Masala"
              className={`h-11 rounded-xl ${errors.name ? "border-red-300" : "border-stone-200"}`}
            />
            {errors.name && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Description
            </label>
            <Textarea
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Briefly describe the item..."
              rows={4}
              className={`resize-none rounded-xl ${
                errors.description ? "border-red-300" : "border-stone-200"
              }`}
            />
            {errors.description && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Price */}
          <div>
            <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Price (₹)
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) => handleChange("price", e.target.value)}
              placeholder="e.g. 249"
              className={`h-11 max-w-xs rounded-xl ${
                errors.price ? "border-red-300" : "border-stone-200"
              }`}
            />
            {errors.price && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.price}</p>
            )}
          </div>

          {/* Veg / Non-Veg Toggle */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Item Type
            </label>

            <div className="grid grid-cols-2 gap-3 max-w-sm">
              <button
                type="button"
                onClick={() => handleChange("category", "veg")}
                className={`relative flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                  form.category === "veg"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-stone-200 bg-white hover:border-emerald-300"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-emerald-600 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </span>
                <span className="text-sm font-bold text-stone-800">Veg</span>
                {form.category === "veg" && (
                  <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-emerald-600" />
                )}
              </button>

              <button
                type="button"
                onClick={() => handleChange("category", "non-veg")}
                className={`relative flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                  form.category === "non-veg"
                    ? "border-red-600 bg-red-50"
                    : "border-stone-200 bg-white hover:border-red-300"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-red-600 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                </span>
                <span className="text-sm font-bold text-stone-800">Non-Veg</span>
                {form.category === "non-veg" && (
                  <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-red-600" />
                )}
              </button>
            </div>

            {errors.category && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.category}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-between gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleDelete}
              disabled={deleting || submitting}
              className="h-11 rounded-xl border-red-200 text-sm font-semibold text-red-600 hover:bg-red-50"
            >
              {deleting ? (
                <>
                  <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <FiTrash2 className="mr-2 h-4 w-4" />
                  Delete Item
                </>
              )}
            </Button>

            <div className="flex flex-col-reverse sm:flex-row gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="h-11 rounded-xl border-stone-200 text-sm font-semibold text-stone-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting || deleting}
                className="h-11 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
              >
                {submitting ? (
                  <>
                    <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFood;
// import React, { useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// import { FiUploadCloud, FiX, FiArrowLeft, FiCheck } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";
// import { toast } from "sonner"; // ⚠️ swap for your actual toast lib if different

// const authHeaders = () => ({
//   headers: {
//     // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//     "Content-Type": "multipart/form-data",
//   },
//   withCredentials: true,
// });

// const AddItem = () => {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     description: "",
//     price: "",
//     foodType: "veg",
//     category: "",
//   });
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [submitting, setSubmitting] = useState(false);
//   const [errors, setErrors] = useState({});

//   const handleChange = (field, value) => {
//     setForm((prev) => ({ ...prev, [field]: value }));
//     if (errors[field]) setErrors((prev) => ({ ...prev, [field]: null }));
//   };

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!file.type.startsWith("image/")) {
//       toast.error("Please select a valid image file");
//       return;
//     }
//     if (file.size > 5 * 1024 * 1024) {
//       toast.error("Image must be under 5MB");
//       return;
//     }

//     setImageFile(file);
//     setImagePreview(URL.createObjectURL(file));
//     setErrors((prev) => ({ ...prev, image: null }));
//   };

//   const removeImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//   };

//   const validate = () => {
//     const newErrors = {};
//     if (!form.name.trim()) newErrors.name = "Name is required";
//     if (!form.description.trim()) newErrors.description = "Description is required";
//     if (!form.price || Number(form.price) <= 0) newErrors.price = "Enter a valid price";
//     if (!form.foodType)
//       newErrors.foodType = "Please select Veg or Non-Veg";

//     if (!form.category)
//       newErrors.category = "Please select Category";
//     if (!imageFile) newErrors.image = "Image is required";
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!validate()) return;

//     try {
//       setSubmitting(true);

//       const formData = new FormData();
//       formData.append("name", form.name.trim());
//       formData.append("description", form.description.trim());
//       formData.append("price", form.price);
//       formData.append("foodType", form.foodType); // "veg" or "non-veg"
//       formData.append("category", form.category);
//       formData.append("image", imageFile); // must match multer's upload.single("image")

//       // ⚠️ ADJUST: swap for your actual "add product" endpoint
//       const res = await axios.post(
//         `${import.meta.env.VITE_APP_API_URL}/api/products/add`,
//         formData,
//         authHeaders()
//       );

//       if (res.data.success) {
//         toast.success("Item added successfully");
//         navigate("/admin/items"); // ⚠️ ADJUST route to your items list page
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to add item");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full bg-stone-50 pb-20 font-sans overflow-x-hidden">
//       {/* ── Header ── */}
//       <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
//         <div className="mx-auto max-w-3xl">
//           <button
//             onClick={() => navigate(-1)}
//             className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
//           >
//             <FiArrowLeft className="h-3.5 w-3.5" />
//             Back
//           </button>
//           <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
//             Add New Item
//           </h1>
//           <p className="mt-1 text-xs sm:text-sm text-orange-100">
//             Fill in the details below to add a new item to your menu
//           </p>
//         </div>
//       </div>

//       {/* ── Form ── */}
//       <div className="mx-auto max-w-3xl px-4 pt-6">
//         <form
//           onSubmit={handleSubmit}
//           className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-6"
//         >
//           {/* Image Upload */}
//           <div>
//             <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
//               Item Image
//             </label>

//             {imagePreview ? (
//               <div className="relative h-44 w-full sm:w-56 overflow-hidden rounded-2xl border border-stone-200">
//                 <img
//                   src={imagePreview}
//                   alt="Preview"
//                   className="h-full w-full object-cover"
//                 />
//                 <button
//                   type="button"
//                   onClick={removeImage}
//                   className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
//                 >
//                   <FiX className="h-4 w-4" />
//                 </button>
//               </div>
//             ) : (
//               <label
//                 htmlFor="image-upload"
//                 className={`flex h-44 w-full sm:w-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed ${errors.image ? "border-red-300 bg-red-50" : "border-stone-300 bg-stone-50"
//                   } text-center transition-colors hover:border-orange-400 hover:bg-orange-50`}
//               >
//                 <FiUploadCloud className="h-7 w-7 text-stone-400" />
//                 <span className="px-4 text-xs font-semibold text-stone-500">
//                   Click to upload image
//                 </span>
//                 <span className="text-[10px] text-stone-400">PNG, JPG up to 5MB</span>
//                 <input
//                   id="image-upload"
//                   type="file"
//                   accept="image/*"
//                   onChange={handleImageChange}
//                   className="hidden"
//                 />
//               </label>
//             )}
//             {errors.image && (
//               <p className="mt-1.5 text-xs font-medium text-red-500">{errors.image}</p>
//             )}
//           </div>

//           {/* Name */}
//           <div>
//             <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
//               Item Name
//             </label>
//             <Input
//               value={form.name}
//               onChange={(e) => handleChange("name", e.target.value)}
//               placeholder="e.g. Paneer Butter Masala"
//               className={`h-11 rounded-xl ${errors.name ? "border-red-300" : "border-stone-200"}`}
//             />
//             {errors.name && (
//               <p className="mt-1.5 text-xs font-medium text-red-500">{errors.name}</p>
//             )}
//           </div>

//           {/* Description */}
//           <div>
//             <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
//               Description
//             </label>
//             <Textarea
//               value={form.description}
//               onChange={(e) => handleChange("description", e.target.value)}
//               placeholder="Briefly describe the item..."
//               rows={4}
//               className={`resize-none rounded-xl ${errors.description ? "border-red-300" : "border-stone-200"
//                 }`}
//             />
//             {errors.description && (
//               <p className="mt-1.5 text-xs font-medium text-red-500">{errors.description}</p>
//             )}
//           </div>

//           {/* Price */}
//           <div>
//             <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-stone-700">
//               Price (₹)
//             </label>
//             <Input
//               type="number"
//               min="0"
//               step="0.01"
//               value={form.price}
//               onChange={(e) => handleChange("price", e.target.value)}
//               placeholder="e.g. 249"
//               className={`h-11 max-w-xs rounded-xl ${errors.price ? "border-red-300" : "border-stone-200"
//                 }`}
//             />
//             {errors.price && (
//               <p className="mt-1.5 text-xs font-medium text-red-500">{errors.price}</p>
//             )}
//           </div>

//           {/* Veg / Non-Veg Toggle */}
//           <div>
//             <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
//               Item Type
//             </label>

//             <div className="grid grid-cols-2 gap-3 max-w-sm">
//               {/* Veg */}
//               <button
//                 type="button"
//                 onClick={() => handleChange("foodType", "veg")}
//                 className={`relative flex items-center gap-3 rounded-xl border-2 p-4
// ${form.foodType === "veg"
//                     ? "border-green-600 bg-green-50"
//                     : "border-gray-200"
//                   }`}
//               >

//                 <span className="h-5 w-5 rounded-full bg-green-600"></span>

//                 Veg

//               </button>
//               <button
// type="button"
// onClick={() => handleChange("foodType","non-veg")}
// className={`relative flex items-center gap-3 rounded-xl border-2 p-4
// ${
// form.foodType==="non-veg"
// ?"border-red-600 bg-red-50"
// :"border-gray-200"
// }`}
// >

// <span className="h-5 w-5 rounded-full bg-red-600"></span>

// Non Veg

// </button>
//               <div>
//                 <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
//                   Food Category
//                 </label>

//                 <select
//                   value={form.category}
//                   onChange={(e) => handleChange("category", e.target.value)}
//                   className="w-full h-11 rounded-xl border border-stone-300 px-3"
//                 >
//                   <option value="">Select Category</option>

//                   <option value="Burger">Burger</option>

//                   <option value="Pizza">Pizza</option>

//                   <option value="Pasta">Pasta</option>

//                   <option value="Chinese">Chinese</option>

//                   <option value="Biryani">Biryani</option>

//                   <option value="Rolls">Rolls</option>

//                   <option value="Momos">Momos</option>


//                   <option value="Desserts">Desserts</option>

//                   <option value="Drinks">Drinks</option>
//                 </select>

//                 {errors.category && (
//                   <p className="mt-2 text-red-500 text-sm">
//                     {errors.category}
//                   </p>
//                 )}
//               </div>
//               <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-emerald-600 bg-white">
//                 <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
//               </span>
//               <span className="text-sm font-bold text-stone-800">Veg</span>
//               {form.category === "veg" && (
//                 <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-emerald-600" />
//               )}
//             </button>

//             {/* Non-Veg */}
//             <button
//               type="button"
//               onClick={() => handleChange("category", "non-veg")}
//               className={`relative flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${form.category === "non-veg"
//                   ? "border-red-600 bg-red-50"
//                   : "border-stone-200 bg-white hover:border-red-300"
//                 }`}
//             >
//               <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-red-600 bg-white">
//                 <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
//               </span>
//               <span className="text-sm font-bold text-stone-800">Non-Veg</span>
//               {form.category === "non-veg" && (
//                 <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-red-600" />
//               )}
//             </button>
//           </div>

//           {errors.category && (
//             <p className="mt-1.5 text-xs font-medium text-red-500">{errors.category}</p>
//           )}
//       </div>

//       {/* Submit */}
//       <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={() => navigate(-1)}
//           className="h-11 rounded-xl border-stone-200 text-sm font-semibold text-stone-700"
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={submitting}
//           className="h-11 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
//         >
//           {submitting ? (
//             <>
//               <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
//               Adding Item...
//             </>
//           ) : (
//             "Add Item"
//           )}
//         </Button>
//       </div>
//     </form>
//       </div >
//     </div >
//   );
// };

// export default AddItem;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { FiUploadCloud, FiX, FiArrowLeft, FiCheck } from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";
import { toast } from "sonner";


const authHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "multipart/form-data",
  },
  withCredentials: true,
});

const AddItem = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    foodType: "veg",
    category: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);

      const res = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/categories`
      );

      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load categories");
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select image only");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validate = () => {
    const err = {};

    if (!form.name.trim()) err.name = "Item name required";

    if (!form.description.trim())
      err.description = "Description required";

    if (!form.price || Number(form.price) <= 0)
      err.price = "Valid price required";

    if (!form.foodType)
      err.foodType = "Select Veg/Non-Veg";

    if (!form.category)
      err.category = "Select Category";

    if (!imageFile)
      err.image = "Image required";

    setErrors(err);

    return Object.keys(err).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      setSubmitting(true);

      const data = new FormData();

      data.append("name", form.name);
      data.append("description", form.description);
      data.append("price", form.price);
      data.append("foodType", form.foodType);
      data.append("category", form.category);
      data.append("image", imageFile);

      const res = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/api/products/add`,
        data,
        authHeaders()
      );

      if (res.data.success) {
        toast.success("Product Added Successfully");
        navigate("/admin/dashboard"); // Navigate to the admin dashboard or items list page
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  };

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
            Add New Item
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-orange-100">
            Fill in the details below to add a new item to your menu
          </p>
        </div>
      </div>

      {/* ── Form ── */}
      <div className="mx-auto max-w-3xl px-4 pt-6">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-stone-200/80 bg-white p-5 sm:p-7 shadow-sm space-y-6"
        >
          {/* Image Upload */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
              Item Image
            </label>

            {imagePreview ? (
              <div className="relative h-44 w-full sm:w-56 overflow-hidden rounded-2xl border border-stone-200">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <label
                htmlFor="image-upload"
                className={`flex h-44 w-full sm:w-56 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed ${
                  errors.image ? "border-red-300 bg-red-50" : "border-stone-300 bg-stone-50"
                } text-center transition-colors hover:border-orange-400 hover:bg-orange-50`}
              >
                <FiUploadCloud className="h-7 w-7 text-stone-400" />
                <span className="px-4 text-xs font-semibold text-stone-500">
                  Click to upload image
                </span>
                <span className="text-[10px] text-stone-400">PNG, JPG up to 5MB</span>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
            {errors.image && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.image}</p>
            )}
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
              {/* Veg */}
              <button
                type="button"
                onClick={() => handleChange("foodType", "veg")}
                className={`relative flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                  form.foodType === "veg"
                    ? "border-emerald-600 bg-emerald-50"
                    : "border-stone-200 bg-white hover:border-emerald-300"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-emerald-600 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-600" />
                </span>
                <span className="text-sm font-bold text-stone-800">Veg</span>
                {form.foodType === "veg" && (
                  <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-emerald-600" />
                )}
              </button>

              {/* Non-Veg */}
              <button
                type="button"
                onClick={() => handleChange("foodType", "non-veg")}
                className={`relative flex items-center gap-2.5 rounded-xl border-2 p-3.5 text-left transition-all ${
                  form.foodType === "non-veg"
                    ? "border-red-600 bg-red-50"
                    : "border-stone-200 bg-white hover:border-red-300"
                }`}
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-sm border-2 border-red-600 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                </span>
                <span className="text-sm font-bold text-stone-800">Non-Veg</span>
                {form.foodType === "non-veg" && (
                  <FiCheck className="absolute right-2.5 top-2.5 h-4 w-4 text-red-600" />
                )}
              </button>
            </div>

            {errors.foodType && (
              <p className="mt-1.5 text-xs font-medium text-red-500">{errors.foodType}</p>
            )}
          </div>

          {/* Food Category */}
          {/* Food Category */}
<div>
  <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-stone-700">
    Food Category
  </label>

  <select
    value={form.category}
    onChange={(e) => handleChange("category", e.target.value)}
    disabled={loadingCategories}
    className={`w-full max-w-xs h-11 rounded-xl border px-3 ${
      errors.category ? "border-red-300" : "border-stone-300"
    }`}
  >
    <option value="">
      {loadingCategories ? "Loading Categories..." : "Select Category"}
    </option>

    {categories.map((cat) => (
      <option
        key={cat._id}
        value={cat._id}   // IMPORTANT
      >
        {cat.name}
      </option>
    ))}
  </select>

  {errors.category && (
    <p className="mt-1.5 text-xs font-medium text-red-500">
      {errors.category}
    </p>
  )}
</div>

          {/* Submit */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-2">
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
              disabled={submitting}
              className="h-11 rounded-xl bg-orange-600 text-sm font-semibold text-white hover:bg-orange-700"
            >
              {submitting ? (
                <>
                  <CgSpinner className="mr-2 h-4 w-4 animate-spin" />
                  Adding Item...
                </>
              ) : (
                "Add Item"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddItem;
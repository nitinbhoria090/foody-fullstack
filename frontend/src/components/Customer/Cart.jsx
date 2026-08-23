// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import API from "../../services/axios";
// // import { toast } from "sonner";

// // import {
// //   FiArrowLeft,
// //   FiTrash2,
// //   FiPlus,
// //   FiMinus,
// //   FiShoppingBag,
// //   FiMapPin,
// //   FiX,
// //   FiCheck,
// // } from "react-icons/fi";
// // import { CgSpinner } from "react-icons/cg";

// // function Cart() {
// //   const navigate = useNavigate();

// //   const [cartItems, setCartItems] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [updatingId, setUpdatingId] = useState(null);
// //   const [placingOrder, setPlacingOrder] = useState(false);
// //   const [paymentMethod, setPaymentMethod] = useState("COD");
// //   const [paymentProcessing, setPaymentProcessing] = useState(false);
// //   // ── Address states ──
// //   const [addresses, setAddresses] = useState([]);
// //   const [addressLoading, setAddressLoading] = useState(true);
// //   const [selectedAddressId, setSelectedAddressId] = useState(null);
// //   const [showAddressForm, setShowAddressForm] = useState(false);
// //   const [savingAddress, setSavingAddress] = useState(false);
// //   const [addressForm, setAddressForm] = useState({
// //     fullName: "",
// //     phone: "",
// //     addressLine1: "",
// //     addressLine2: "",
// //     city: "",
// //     state: "",
// //     postalCode: "",
// //     addressType: "Home",
// //     isDefault: false,
// //   });

// //   useEffect(() => {
// //     getCart();
// //     getAddresses();
// //   }, []);

// //   // 1. Fixed Cart Fetch Route
// //   const getCart = async () => {
// //     try {
// //       setLoading(true);

// //       const res = await API.get("/api/cart", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });

// //       if (res.data.success) {
// //         setCartItems(res.data.cart.items || []);
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       toast.error("Failed to load cart");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   // 2. Fixed Address Fetch Route
// //   const getAddresses = async () => {
// //     try {
// //       setAddressLoading(true);

// //       const res = await API.get("/api/address", {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });

// //       if (res.data.success) {
// //         const list = res.data.addresses || [];
// //         setAddresses(list);

// //         // auto-select default address, or first one
// //         const defaultAddr = list.find((a) => a.isDefault);
// //         if (defaultAddr) {
// //           setSelectedAddressId(defaultAddr._id);
// //         } else if (list.length > 0) {
// //           setSelectedAddressId(list[0]._id);
// //         }
// //       }
// //     } catch (error) {
// //       console.log(error);
// //       toast.error("Failed to load addresses");
// //     } finally {
// //       setAddressLoading(false);
// //     }
// //   };

// //   const loadRazorpayScript = () => {
// //     return new Promise((resolve) => {
// //       if (window.Razorpay) {
// //         resolve(true);
// //         return;
// //       }
// //       const script = document.createElement("script");
// //       script.src = "https://razorpay.com";
// //       script.onload = () => resolve(true);
// //       script.onerror = () => resolve(false);
// //       document.body.appendChild(script);
// //     });
// //   };

// //   const handleAddressFormChange = (e) => {
// //     const { name, value, type, checked } = e.target;
// //     setAddressForm((prev) => ({
// //       ...prev,
// //       [name]: type === "checkbox" ? checked : value,
// //     }));
// //   };

// //   // 3. Fixed Add Address Route
// //   const handleAddAddress = async (e) => {
// //     e.preventDefault();

// //     const { fullName, phone, addressLine1, city, state, postalCode } =
// //       addressForm;

// //     if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
// //       toast.error("Please fill all required fields");
// //       return;
// //     }

// //     try {
// //       setSavingAddress(true);

// //       const res = await API.post("/api/address/add", addressForm, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });

// //       if (res.data.success) {
// //         toast.success("Address added successfully");
// //         setSelectedAddressId(res.data.address._id);
// //         setShowAddressForm(false);
// //         setAddressForm({
// //           fullName: "",
// //           phone: "",
// //           addressLine1: "",
// //           addressLine2: "",
// //           city: "",
// //           state: "",
// //           postalCode: "",
// //           addressType: "Home",
// //           isDefault: false,
// //         });
// //         getAddresses();
// //       }
// //     } catch (error) {
// //       toast.error(error.response?.data?.message || "Failed to add address");
// //     } finally {
// //       setSavingAddress(false);
// //     }
// //   };

// //   // 4. Fixed Quantity Update Route
// //   const handleQuantityChange = async (
// //     productId,
// //     currentQty,
// //     delta
// //   ) => {
// //     const newQty = currentQty + delta;

// //     if (newQty < 1) return;

// //     try {
// //       setUpdatingId(productId);

// //       const res = await API.put(
// //         `/api/cart/update/${productId}`,
// //         {
// //           quantity: newQty,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       if (res.data.success) {
// //         getCart();
// //       }
// //     } catch (error) {
// //       toast.error("Failed to update quantity");
// //     } finally {
// //       setUpdatingId(null);
// //     }
// //   };

// //   // 5. Fixed Remove Item Route
// //   const handleRemoveItem = async (productId) => {
// //     try {
// //       setUpdatingId(productId);

// //       const res = await API.delete(
// //         `/api/cart/remove/${productId}`,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       if (res.data.success) {
// //         toast.success("Item removed from cart");
// //         getCart();
// //       }
// //     } catch (error) {
// //       toast.error("Failed to remove item");
// //     } finally {
// //       setUpdatingId(null);
// //     }
// //   };

// //   const subtotal = cartItems.reduce((sum, item) => {
// //     if (!item.product) return sum;
// //     return sum + item.product.price * item.quantity;
// //   }, 0);
// //   const deliveryFee = subtotal > 0 ? 40 : 0;
// //   const total = subtotal + deliveryFee;

// //   // 6. Fixed Place Order Route
// //   const handlePlaceOrder = async () => {
// //     if (cartItems.length === 0) return;

// //     if (!selectedAddressId) {
// //       toast.error("Please select a delivery address");
// //       return;
// //     }

// //     try {
// //       setPlacingOrder(true);

// //       // Step 1: Create the order in our DB
// //       const res = await API.post(
// //         "/api/orders/place",
// //         {
// //           addressId: selectedAddressId,
// //           paymentMethod,
// //         },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       if (!res.data.success) {
// //         toast.error(res.data.message || "Failed to place order");
// //         return;
// //       }

// //       const order = res.data.order;

// //       if (paymentMethod === "COD") {
// //         toast.success("Order placed successfully");
// //         setCartItems([]);
// //         navigate("/orders_history");
// //         return;
// //       }

// //       // Step 2: Online payment via Razorpay
// //       await handleRazorpayPayment(order);
// //     } catch (error) {
// //       toast.error(
// //         error.response?.data?.message || "Failed to place order"
// //       );
// //     } finally {
// //       setPlacingOrder(false);
// //     }
// //   };

// //   // 7. Fixed Razorpay Create Order & Verify Routes
// //   const handleRazorpayPayment = async (order) => {
// //     const scriptLoaded = await loadRazorpayScript();

// //     if (!scriptLoaded) {
// //       toast.error("Failed to load payment gateway. Please try again.");
// //       return;
// //     }

// //     try {
// //       setPaymentProcessing(true);

// //       const { data } = await API.post(
// //         "/api/payment/create-order",
// //         { orderId: order._id },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       if (!data.success) {
// //         toast.error("Failed to initiate payment");
// //         return;
// //       }

// //       const { razorpayOrder, key } = data;

// //       const options = {
// //         key,
// //         amount: razorpayOrder.amount,
// //         currency: razorpayOrder.currency,
// //         name: "Your Store Name",
// //         description: "Order Payment",
// //         order_id: razorpayOrder.id,
// //         handler: async (response) => {
// //           try {
// //             const verifyRes = await API.post(
// //               "/api/payment/verify",
// //               {
// //                 razorpay_order_id: response.razorpay_order_id,
// //                 razorpay_payment_id: response.razorpay_payment_id,
// //                 razorpay_signature: response.razorpay_signature,
// //               },
// //               {
// //                 headers: {
// //                   Authorization: `Bearer ${localStorage.getItem("token")}`,
// //                 },
// //               }
// //             );

// //             if (verifyRes.data.success) {
// //               toast.success("Payment successful & order verified");
// //               setCartItems([]);
// //               navigate("/orders_history");
// //             } else {
// //               toast.error("Payment verification failed");
// //             }
// //           } catch (err) {
// //             toast.error("Error during payment verification");
// //           } finally {
// //             setPaymentProcessing(false);
// //           }
// //         },
// //         prefill: {
// //           name: "User Name",
// //           email: "user@example.com",
// //         },
// //         theme: {
// //           color: "#ea580c",
// //         },
// //       };

// //       const rzp = new window.Razorpay(options);
// //       rzp.open();
// //     } catch (error) {
// //       toast.error("Failed to process Razorpay payment");
// //       setPaymentProcessing(false);
// //     }
// //   };


// // }

// // export default Cart;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../../services/axios";
// import { toast } from "sonner";

// import {
//   FiArrowLeft,
//   FiTrash2,
//   FiPlus,
//   FiMinus,
//   FiShoppingBag,
//   FiMapPin,
//   FiX,
//   FiCheck,
// } from "react-icons/fi";
// import { CgSpinner } from "react-icons/cg";

// function Cart() {
//   const navigate = useNavigate();

//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [placingOrder, setPlacingOrder] = useState(false);
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [paymentProcessing, setPaymentProcessing] = useState(false);
//   // ── Address states ──
//   const [addresses, setAddresses] = useState([]);
//   const [addressLoading, setAddressLoading] = useState(true);
//   const [selectedAddressId, setSelectedAddressId] = useState(null);
//   const [showAddressForm, setShowAddressForm] = useState(false);
//   const [savingAddress, setSavingAddress] = useState(false);
//   const [addressForm, setAddressForm] = useState({
//     fullName: "",
//     phone: "",
//     addressLine1: "",
//     addressLine2: "",
//     city: "",
//     state: "",
//     postalCode: "",
//     addressType: "Home",
//     isDefault: false,
//   });

//   useEffect(() => {
//     getCart();
//     getAddresses();
//   }, []);

//   const getCart = async () => {
//     try {
//       setLoading(true);

//       const res = await API.get("/api/cart", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         setCartItems(res.data.cart.items || []);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to load cart");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getAddresses = async () => {
//     try {
//       setAddressLoading(true);

//       const res = await API.get("/api/address", {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         const list = res.data.addresses || [];
//         setAddresses(list);

//         const defaultAddr = list.find((a) => a.isDefault);
//         if (defaultAddr) {
//           setSelectedAddressId(defaultAddr._id);
//         } else if (list.length > 0) {
//           setSelectedAddressId(list[0]._id);
//         }
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error("Failed to load addresses");
//     } finally {
//       setAddressLoading(false);
//     }
//   };

//   const loadRazorpayScript = () => {
//     return new Promise((resolve) => {
//       if (window.Razorpay) {
//         resolve(true);
//         return;
//       }
//       const script = document.createElement("script");
//       script.src = "https://checkout.razorpay.com/v1/checkout.js";
//       script.onload = () => resolve(true);
//       script.onerror = () => resolve(false);
//       document.body.appendChild(script);
//     });
//   };

//   const handleAddressFormChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setAddressForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }));
//   };

//   const handleAddAddress = async (e) => {
//     e.preventDefault();

//     const { fullName, phone, addressLine1, city, state, postalCode } =
//       addressForm;

//     if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     try {
//       setSavingAddress(true);

//       const res = await API.post("/api/address/add", addressForm, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success("Address added successfully");
//         setSelectedAddressId(res.data.address._id);
//         setShowAddressForm(false);
//         setAddressForm({
//           fullName: "",
//           phone: "",
//           addressLine1: "",
//           addressLine2: "",
//           city: "",
//           state: "",
//           postalCode: "",
//           addressType: "Home",
//           isDefault: false,
//         });
//         getAddresses();
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to add address");
//     } finally {
//       setSavingAddress(false);
//     }
//   };

//   const handleQuantityChange = async (productId, currentQty, delta) => {
//     const newQty = currentQty + delta;

//     if (newQty < 1) return;

//     try {
//       setUpdatingId(productId);

//       const res = await API.put(
//         `/api/cart/update/${productId}`,
//         { quantity: newQty },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (res.data.success) {
//         getCart();
//       }
//     } catch (error) {
//       toast.error("Failed to update quantity");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const handleRemoveItem = async (productId) => {
//     try {
//       setUpdatingId(productId);

//       const res = await API.delete(`/api/cart/remove/${productId}`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       if (res.data.success) {
//         toast.success("Item removed from cart");
//         getCart();
//       }
//     } catch (error) {
//       toast.error("Failed to remove item");
//     } finally {
//       setUpdatingId(null);
//     }
//   };

//   const subtotal = cartItems.reduce((sum, item) => {
//     if (!item.product) return sum;
//     return sum + item.product.price * item.quantity;
//   }, 0);
//   const deliveryFee = subtotal > 0 ? 40 : 0;
//   const total = subtotal + deliveryFee;

//   const handlePlaceOrder = async () => {
//     if (cartItems.length === 0) return;

//     if (!selectedAddressId) {
//       toast.error("Please select a delivery address");
//       return;
//     }

//     try {
//       setPlacingOrder(true);

//       const res = await API.post(
//         "/api/orders/place",
//         {
//           addressId: selectedAddressId,
//           paymentMethod,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (!res.data.success) {
//         toast.error(res.data.message || "Failed to place order");
//         return;
//       }

//       const order = res.data.order;

//       if (paymentMethod === "COD") {
//         toast.success("Order placed successfully");
//         setCartItems([]);
//         navigate("/orders_history");
//         return;
//       }

//       await handleRazorpayPayment(order);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to place order");
//     } finally {
//       setPlacingOrder(false);
//     }
//   };

//   const handleRazorpayPayment = async (order) => {
//     const scriptLoaded = await loadRazorpayScript();

//     if (!scriptLoaded) {
//       toast.error("Failed to load payment gateway. Please try again.");
//       return;
//     }

//     try {
//       setPaymentProcessing(true);

//       const { data } = await API.post(
//         "/api/payment/create-order",
//         { orderId: order._id },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       if (!data.success) {
//         toast.error("Failed to initiate payment");
//         return;
//       }

//       const { razorpayOrder, key } = data;

//       const options = {
//         key,
//         amount: razorpayOrder.amount,
//         currency: razorpayOrder.currency,
//         name: "Your Store Name",
//         description: "Order Payment",
//         order_id: razorpayOrder.id,
//         handler: async (response) => {
//           try {
//             const verifyRes = await API.post(
//               "/api/payment/verify",
//               {
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               },
//               {
//                 headers: {
//                   Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//               }
//             );

//             if (verifyRes.data.success) {
//               toast.success("Payment successful & order verified");
//               setCartItems([]);
//               navigate("/orders_history");
//             } else {
//               toast.error("Payment verification failed");
//             }
//           } catch (err) {
//             toast.error("Error during payment verification");
//           } finally {
//             setPaymentProcessing(false);
//           }
//         },
//         prefill: {
//           name: "User Name",
//           email: "user@example.com",
//         },
//         theme: {
//           color: "#ea580c",
//         },
//       };

//       const rzp = new window.Razorpay(options);
//       rzp.open();
//     } catch (error) {
//       toast.error("Failed to process Razorpay payment");
//       setPaymentProcessing(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-stone-50">
//         <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen w-full bg-stone-50 pb-32 font-sans">
//       {/* ── Header ── */}
//       <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
//         <div className="mx-auto max-w-3xl">
//           <button
//             onClick={() => navigate("/")}
//             className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
//           >
//             <FiArrowLeft className="h-3.5 w-3.5" />
//             Back to Menu
//           </button>
//           <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
//             My Cart
//           </h1>
//           <p className="mt-1 text-xs sm:text-sm text-orange-100">
//             {cartItems.length === 0
//               ? "Your cart is empty"
//               : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in cart`}
//           </p>
//         </div>
//       </div>

//       <div className="mx-auto max-w-3xl px-4 pt-6">
//         {cartItems.length === 0 ? (
//           <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
//             <FiShoppingBag className="h-10 w-10 text-stone-300" />
//             <p className="mt-3 text-sm font-semibold text-stone-600">
//               Your cart is empty
//             </p>
//             <button
//               onClick={() => navigate("/")}
//               className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
//             >
//               Browse Menu
//             </button>
//           </div>
//         ) : (
//           <>
//             {/* ── Cart items ── */}
//             <div className="space-y-3">
//               {cartItems.map((item) => {
//                 if (!item.product) return null;
//                 return (
//                   <div
//                     key={item.product._id}
//                     className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm"
//                   >
//                     <img
//                       src={item.product.image}
//                       alt={item.product.name}
//                       className="h-16 w-16 shrink-0 rounded-xl object-cover bg-stone-100"
//                     />

//                     <div className="min-w-0 flex-1">
//                       <p className="truncate text-sm font-semibold text-stone-800">
//                         {item.product.name}
//                       </p>
//                       <p className="mt-0.5 text-sm font-bold text-orange-600">
//                         ₹{item.product.price}
//                       </p>
//                     </div>

//                     <div className="flex items-center gap-2 rounded-full border border-stone-200 px-1.5 py-1">
//                       <button
//                         onClick={() =>
//                           handleQuantityChange(item.product._id, item.quantity, -1)
//                         }
//                         disabled={updatingId === item.product._id}
//                         className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50"
//                       >
//                         <FiMinus className="h-3 w-3" />
//                       </button>
//                       <span className="w-4 text-center text-xs font-bold text-stone-800">
//                         {updatingId === item.product._id ? (
//                           <CgSpinner className="mx-auto h-3 w-3 animate-spin" />
//                         ) : (
//                           item.quantity
//                         )}
//                       </span>
//                       <button
//                         onClick={() =>
//                           handleQuantityChange(item.product._id, item.quantity, 1)
//                         }
//                         disabled={updatingId === item.product._id}
//                         className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50"
//                       >
//                         <FiPlus className="h-3 w-3" />
//                       </button>
//                     </div>

//                     <button
//                       onClick={() => handleRemoveItem(item.product._id)}
//                       disabled={updatingId === item.product._id}
//                       className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
//                     >
//                       <FiTrash2 className="h-4 w-4" />
//                     </button>
//                   </div>
//                 );
//               })}
//             </div>

//             {/* ── Delivery address ── */}
//             <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-sm font-bold text-stone-900">Delivery Address</h2>
//                 <button
//                   onClick={() => setShowAddressForm((v) => !v)}
//                   className="text-xs font-semibold text-orange-600 hover:text-orange-700"
//                 >
//                   {showAddressForm ? "Cancel" : "+ Add New"}
//                 </button>
//               </div>

//               {addressLoading ? (
//                 <div className="mt-4 flex justify-center py-4">
//                   <CgSpinner className="h-5 w-5 animate-spin text-orange-600" />
//                 </div>
//               ) : (
//                 <div className="mt-3 space-y-2">
//                   {addresses.map((addr) => (
//                     <button
//                       key={addr._id}
//                       onClick={() => setSelectedAddressId(addr._id)}
//                       className={`flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition-colors ${
//                         selectedAddressId === addr._id
//                           ? "border-orange-500 bg-orange-50"
//                           : "border-stone-200 hover:border-stone-300"
//                       }`}
//                     >
//                       <FiMapPin
//                         className={`mt-0.5 h-4 w-4 shrink-0 ${
//                           selectedAddressId === addr._id
//                             ? "text-orange-600"
//                             : "text-stone-400"
//                         }`}
//                       />
//                       <div className="min-w-0 flex-1">
//                         <p className="text-xs font-bold text-stone-800">
//                           {addr.fullName}{" "}
//                           <span className="ml-1 rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
//                             {addr.addressType}
//                           </span>
//                         </p>
//                         <p className="mt-0.5 truncate text-xs text-stone-500">
//                           {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
//                           {addr.postalCode}
//                         </p>
//                         <p className="mt-0.5 text-xs text-stone-400">{addr.phone}</p>
//                       </div>
//                       {selectedAddressId === addr._id && (
//                         <FiCheck className="h-4 w-4 shrink-0 text-orange-600" />
//                       )}
//                     </button>
//                   ))}

//                   {addresses.length === 0 && !showAddressForm && (
//                     <p className="py-2 text-xs text-stone-400">
//                       No saved addresses. Add one to continue.
//                     </p>
//                   )}
//                 </div>
//               )}

//               {showAddressForm && (
//                 <form onSubmit={handleAddAddress} className="mt-4 space-y-3 border-t border-stone-100 pt-4">
//                   <div className="grid grid-cols-2 gap-3">
//                     <input
//                       name="fullName"
//                       value={addressForm.fullName}
//                       onChange={handleAddressFormChange}
//                       placeholder="Full Name"
//                       className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="phone"
//                       value={addressForm.phone}
//                       onChange={handleAddressFormChange}
//                       placeholder="Phone Number"
//                       className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="addressLine1"
//                       value={addressForm.addressLine1}
//                       onChange={handleAddressFormChange}
//                       placeholder="Address Line 1"
//                       className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="addressLine2"
//                       value={addressForm.addressLine2}
//                       onChange={handleAddressFormChange}
//                       placeholder="Address Line 2 (optional)"
//                       className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="city"
//                       value={addressForm.city}
//                       onChange={handleAddressFormChange}
//                       placeholder="City"
//                       className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="state"
//                       value={addressForm.state}
//                       onChange={handleAddressFormChange}
//                       placeholder="State"
//                       className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <input
//                       name="postalCode"
//                       value={addressForm.postalCode}
//                       onChange={handleAddressFormChange}
//                       placeholder="Postal Code"
//                       className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     />
//                     <select
//                       name="addressType"
//                       value={addressForm.addressType}
//                       onChange={handleAddressFormChange}
//                       className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
//                     >
//                       <option value="Home">Home</option>
//                       <option value="Work">Work</option>
//                       <option value="Other">Other</option>
//                     </select>
//                   </div>

//                   <label className="flex items-center gap-2 text-xs text-stone-600">
//                     <input
//                       type="checkbox"
//                       name="isDefault"
//                       checked={addressForm.isDefault}
//                       onChange={handleAddressFormChange}
//                       className="h-3.5 w-3.5"
//                     />
//                     Set as default address
//                   </label>

//                   <button
//                     type="submit"
//                     disabled={savingAddress}
//                     className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-60"
//                   >
//                     {savingAddress ? (
//                       <CgSpinner className="h-4 w-4 animate-spin" />
//                     ) : (
//                       "Save Address"
//                     )}
//                   </button>
//                 </form>
//               )}
//             </div>

//             {/* ── Payment method ── */}
//             <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
//               <h2 className="text-sm font-bold text-stone-900">Payment Method</h2>
//               <div className="mt-3 grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => setPaymentMethod("COD")}
//                   className={`rounded-xl border py-3 text-xs font-bold transition-colors ${
//                     paymentMethod === "COD"
//                       ? "border-orange-500 bg-orange-50 text-orange-700"
//                       : "border-stone-200 text-stone-500 hover:border-stone-300"
//                   }`}
//                 >
//                   Cash on Delivery
//                 </button>
//                 <button
//                   onClick={() => setPaymentMethod("ONLINE")}
//                   className={`rounded-xl border py-3 text-xs font-bold transition-colors ${
//                     paymentMethod === "ONLINE"
//                       ? "border-orange-500 bg-orange-50 text-orange-700"
//                       : "border-stone-200 text-stone-500 hover:border-stone-300"
//                   }`}
//                 >
//                   Pay Online
//                 </button>
//               </div>
//             </div>

//             {/* ── Price summary ── */}
//             <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
//               <h2 className="text-sm font-bold text-stone-900">Bill Summary</h2>
//               <div className="mt-3 space-y-2 text-xs">
//                 <div className="flex justify-between text-stone-500">
//                   <span>Subtotal</span>
//                   <span className="font-medium text-stone-700">₹{subtotal}</span>
//                 </div>
//                 <div className="flex justify-between text-stone-500">
//                   <span>Delivery Fee</span>
//                   <span className="font-medium text-stone-700">₹{deliveryFee}</span>
//                 </div>
//                 <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-stone-900">
//                   <span>Total</span>
//                   <span>₹{total}</span>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* ── Sticky place order bar ── */}
//       {cartItems.length > 0 && (
//         <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
//           <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
//             <div>
//               <p className="text-[11px] text-stone-400">Total</p>
//               <p className="text-base font-extrabold text-stone-900">₹{total}</p>
//             </div>
//             <button
//               onClick={handlePlaceOrder}
//               disabled={placingOrder || paymentProcessing}
//               className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-[0.98] disabled:opacity-60 sm:flex-none sm:px-10"
//             >
//               {placingOrder || paymentProcessing ? (
//                 <CgSpinner className="h-4 w-4 animate-spin" />
//               ) : (
//                 "Place Order"
//               )}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Cart;




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/axios";
import { toast } from "sonner";

import {
  FiArrowLeft,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiShoppingBag,
  FiMapPin,
  FiX,
  FiCheck,
  FiCrosshair,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

function Cart() {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  // ── Address states ──
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [locatingUser, setLocatingUser] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    addressType: "Home",
    isDefault: false,
  });

  useEffect(() => {
    getCart();
    getAddresses();
  }, []);

  const getCart = async () => {
    try {
      setLoading(true);

      const res = await API.get("/api/cart", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        setCartItems(res.data.cart.items || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  const getAddresses = async () => {
    try {
      setAddressLoading(true);

      const res = await API.get("/api/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        const list = res.data.addresses || [];
        setAddresses(list);

        const defaultAddr = list.find((a) => a.isDefault);
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        } else if (list.length > 0) {
          setSelectedAddressId(list[0]._id);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ==========================================
  // USE CURRENT LOCATION (auto-fill address)
  // ==========================================
  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setLocatingUser(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
            {
              headers: {
                Accept: "application/json",
              },
            }
          );

          if (!res.ok) {
            throw new Error("Reverse geocoding failed");
          }

          const data = await res.json();
          const addr = data.address || {};

          // Build a sensible line-1 from whatever house/road info is present
          const line1 = [addr.house_number, addr.road || addr.suburb]
            .filter(Boolean)
            .join(", ") || data.display_name?.split(",")[0] || "";

          setAddressForm((prev) => ({
            ...prev,
            addressLine1: line1,
            addressLine2:
              addr.neighbourhood || addr.suburb || prev.addressLine2,
            city:
              addr.city ||
              addr.town ||
              addr.village ||
              addr.county ||
              prev.city,
            state: addr.state || prev.state,
            postalCode: addr.postcode || prev.postalCode,
          }));

          // GPS accuracy is in meters — warn if it's coarse (e.g. IP-based
          // location on a laptop instead of a phone's real GPS chip)
          if (accuracy > 100) {
            toast.info(
              `Location detected, but only accurate to ~${Math.round(
                accuracy
              )}m — please double check the details below`
            );
          } else {
            toast.success("Location detected — please review the details");
          }
        } catch (error) {
          console.log(error);
          toast.error("Couldn't fetch address for your location");
        } finally {
          setLocatingUser(false);
        }
      },
      (error) => {
        console.log(error);
        if (error.code === error.PERMISSION_DENIED) {
          toast.error("Location permission denied");
        } else {
          toast.error("Failed to detect your location");
        }
        setLocatingUser(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();

    const { fullName, phone, addressLine1, city, state, postalCode } =
      addressForm;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSavingAddress(true);

      const res = await API.post("/api/address/add", addressForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Address added successfully");
        setSelectedAddressId(res.data.address._id);
        setShowAddressForm(false);
        setAddressForm({
          fullName: "",
          phone: "",
          addressLine1: "",
          addressLine2: "",
          city: "",
          state: "",
          postalCode: "",
          addressType: "Home",
          isDefault: false,
        });
        getAddresses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleQuantityChange = async (productId, currentQty, delta) => {
    const newQty = currentQty + delta;

    if (newQty < 1) return;

    try {
      setUpdatingId(productId);

      const res = await API.put(
        `/api/cart/update/${productId}`,
        { quantity: newQty },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (res.data.success) {
        getCart();
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      setUpdatingId(productId);

      const res = await API.delete(`/api/cart/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        toast.success("Item removed from cart");
        getCart();
      }
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setUpdatingId(null);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => {
    if (!item.product) return sum;
    return sum + item.product.price * item.quantity;
  }, 0);
  const deliveryFee = subtotal > 0 ? 40 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (cartItems.length === 0) return;

    if (!selectedAddressId) {
      toast.error("Please select a delivery address");
      return;
    }

    try {
      setPlacingOrder(true);

      const res = await API.post(
        "/api/orders/place",
        {
          addressId: selectedAddressId,
          paymentMethod,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!res.data.success) {
        toast.error(res.data.message || "Failed to place order");
        return;
      }

      const order = res.data.order;

      if (paymentMethod === "COD") {
        toast.success("Order placed successfully");
        setCartItems([]);
        navigate("/orders_history");
        return;
      }

      await handleRazorpayPayment(order);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to place order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleRazorpayPayment = async (order) => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      toast.error("Failed to load payment gateway. Please try again.");
      return;
    }

    try {
      setPaymentProcessing(true);

      const { data } = await API.post(
        "/api/payment/create-order",
        { orderId: order._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!data.success) {
        toast.error("Failed to initiate payment");
        return;
      }

      const { razorpayOrder, key } = data;

      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Your Store Name",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post(
              "/api/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful & order verified");
              setCartItems([]);
              navigate("/orders_history");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Error during payment verification");
          } finally {
            setPaymentProcessing(false);
          }
        },
        prefill: {
          name: "User Name",
          email: "user@example.com",
        },
        theme: {
          color: "#ea580c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Failed to process Razorpay payment");
      setPaymentProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <CgSpinner className="h-8 w-8 animate-spin text-orange-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-32 font-sans">
      {/* ── Header ── */}
      <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 px-4 pt-6 pb-8 shadow-md">
        <div className="mx-auto max-w-3xl">
          <button
            onClick={() => navigate("/")}
            className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-orange-100 hover:text-white"
          >
            <FiArrowLeft className="h-3.5 w-3.5" />
            Back to Menu
          </button>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">
            My Cart
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-orange-100">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in cart`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <FiShoppingBag className="h-10 w-10 text-stone-300" />
            <p className="mt-3 text-sm font-semibold text-stone-600">
              Your cart is empty
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 rounded-xl bg-orange-600 px-5 py-2.5 text-xs font-bold text-white hover:bg-orange-700"
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            {/* ── Cart items ── */}
            <div className="space-y-3">
              {cartItems.map((item) => {
                if (!item.product) return null;
                return (
                  <div
                    key={item.product._id}
                    className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 shadow-sm"
                  >
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 shrink-0 rounded-xl object-cover bg-stone-100"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-stone-800">
                        {item.product.name}
                      </p>
                      <p className="mt-0.5 text-sm font-bold text-orange-600">
                        ₹{item.product.price}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-stone-200 px-1.5 py-1">
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, -1)
                        }
                        disabled={updatingId === item.product._id}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-stone-800">
                        {updatingId === item.product._id ? (
                          <CgSpinner className="mx-auto h-3 w-3 animate-spin" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, 1)
                        }
                        disabled={updatingId === item.product._id}
                        className="flex h-6 w-6 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100 disabled:opacity-50"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleRemoveItem(item.product._id)}
                      disabled={updatingId === item.product._id}
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-stone-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* ── Delivery address ── */}
            <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-stone-900">Delivery Address</h2>
                <button
                  onClick={() => setShowAddressForm((v) => !v)}
                  className="text-xs font-semibold text-orange-600 hover:text-orange-700"
                >
                  {showAddressForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {addressLoading ? (
                <div className="mt-4 flex justify-center py-4">
                  <CgSpinner className="h-5 w-5 animate-spin text-orange-600" />
                </div>
              ) : (
                <div className="mt-3 space-y-2">
                  {addresses.map((addr) => (
                    <button
                      key={addr._id}
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`flex w-full items-start gap-2.5 rounded-2xl border p-3 text-left transition-colors ${
                        selectedAddressId === addr._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-stone-200 hover:border-stone-300"
                      }`}
                    >
                      <FiMapPin
                        className={`mt-0.5 h-4 w-4 shrink-0 ${
                          selectedAddressId === addr._id
                            ? "text-orange-600"
                            : "text-stone-400"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-stone-800">
                          {addr.fullName}{" "}
                          <span className="ml-1 rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
                            {addr.addressType}
                          </span>
                        </p>
                        <p className="mt-0.5 truncate text-xs text-stone-500">
                          {addr.addressLine1}, {addr.city}, {addr.state} -{" "}
                          {addr.postalCode}
                        </p>
                        <p className="mt-0.5 text-xs text-stone-400">{addr.phone}</p>
                      </div>
                      {selectedAddressId === addr._id && (
                        <FiCheck className="h-4 w-4 shrink-0 text-orange-600" />
                      )}
                    </button>
                  ))}

                  {addresses.length === 0 && !showAddressForm && (
                    <p className="py-2 text-xs text-stone-400">
                      No saved addresses. Add one to continue.
                    </p>
                  )}
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="mt-4 space-y-3 border-t border-stone-100 pt-4">
                  {/* ── Use current location ── */}
                  <button
                    type="button"
                    onClick={handleUseCurrentLocation}
                    disabled={locatingUser}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 py-2.5 text-xs font-bold text-orange-700 hover:bg-orange-100 disabled:opacity-60"
                  >
                    {locatingUser ? (
                      <>
                        <CgSpinner className="h-4 w-4 animate-spin" />
                        Detecting your location...
                      </>
                    ) : (
                      <>
                        <FiCrosshair className="h-4 w-4" />
                        Use Current Location
                      </>
                    )}
                  </button>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressFormChange}
                      placeholder="Full Name"
                      className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressFormChange}
                      placeholder="Phone Number"
                      className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="addressLine1"
                      value={addressForm.addressLine1}
                      onChange={handleAddressFormChange}
                      placeholder="Address Line 1"
                      className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="addressLine2"
                      value={addressForm.addressLine2}
                      onChange={handleAddressFormChange}
                      placeholder="Address Line 2 (optional)"
                      className="col-span-2 rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="City"
                      className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      placeholder="State"
                      className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <input
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressFormChange}
                      placeholder="Postal Code"
                      className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    />
                    <select
                      name="addressType"
                      value={addressForm.addressType}
                      onChange={handleAddressFormChange}
                      className="rounded-xl border border-stone-200 px-3 py-2 text-xs outline-none focus:border-orange-400"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-2 text-xs text-stone-600">
                    <input
                      type="checkbox"
                      name="isDefault"
                      checked={addressForm.isDefault}
                      onChange={handleAddressFormChange}
                      className="h-3.5 w-3.5"
                    />
                    Set as default address
                  </label>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {savingAddress ? (
                      <CgSpinner className="h-4 w-4 animate-spin" />
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* ── Payment method ── */}
            <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-stone-900">Payment Method</h2>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setPaymentMethod("COD")}
                  className={`rounded-xl border py-3 text-xs font-bold transition-colors ${
                    paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  Cash on Delivery
                </button>
                <button
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`rounded-xl border py-3 text-xs font-bold transition-colors ${
                    paymentMethod === "ONLINE"
                      ? "border-orange-500 bg-orange-50 text-orange-700"
                      : "border-stone-200 text-stone-500 hover:border-stone-300"
                  }`}
                >
                  Pay Online
                </button>
              </div>
            </div>

            {/* ── Price summary ── */}
            <div className="mt-6 rounded-3xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-stone-900">Bill Summary</h2>
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span className="font-medium text-stone-700">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-stone-700">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 text-sm font-bold text-stone-900">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky place order bar ── */}
      {cartItems.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-stone-200 bg-white/95 px-4 py-3 backdrop-blur-sm">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="text-[11px] text-stone-400">Total</p>
              <p className="text-base font-extrabold text-stone-900">₹{total}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || paymentProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-600 py-3 text-sm font-bold text-white shadow-sm hover:bg-orange-700 active:scale-[0.98] disabled:opacity-60 sm:flex-none sm:px-10"
            >
              {placingOrder || paymentProcessing ? (
                <CgSpinner className="h-4 w-4 animate-spin" />
              ) : (
                "Place Order"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
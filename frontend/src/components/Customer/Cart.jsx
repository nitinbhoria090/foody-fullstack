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

      const res = await API.get("/cart", {
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

  // ── Fetch saved addresses ──
  const getAddresses = async () => {
    try {
      setAddressLoading(true);

      const res = await API.get("/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.data.success) {
        const list = res.data.addresses || [];
        setAddresses(list);

        // auto-select default address, or first one
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

      const res = await API.post("/address/add", addressForm, {
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

  const handleQuantityChange = async (
    productId,
    currentQty,
    delta
  ) => {
    const newQty = currentQty + delta;

    if (newQty < 1) return;

    try {
      setUpdatingId(productId);

      const res = await API.put(
        `/cart/update/${productId}`,
        {
          quantity: newQty,
        },
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

      const res = await API.delete(
        `/cart/remove/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

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

      // Step 1: Create the order in our DB
      const res = await API.post(
        "/orders/place",
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

      // Step 2: Online payment via Razorpay
      await handleRazorpayPayment(order);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to place order"
      );
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
        "/payment/create-order",
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
              "/payment/verify",
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: order._id,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );

            if (verifyRes.data.success) {
              toast.success("Payment successful! Order placed.");
              setCartItems([]);
              navigate("/orders_history");
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        modal: {
          ondismiss: () => {
            toast.error("Payment cancelled");
          },
        },
        theme: {
          color: "#ea580c",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to initiate payment"
      );
    } finally {
      setPaymentProcessing(false);
    }
  };
  return (
    <div className="min-h-screen w-full bg-stone-50 pb-32 font-sans">
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
            Your Cart
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-orange-100">
            {cartItems.length === 0
              ? "Your cart is empty"
              : `${cartItems.length} ${cartItems.length === 1 ? "item" : "items"} in your cart`}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-stone-300 bg-white py-16 text-center">
            <FiShoppingBag className="h-10 w-10 text-stone-300" />
            <p className="mt-3 text-sm font-semibold text-stone-600">
              No items in your cart yet
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
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center gap-3 rounded-2xl border border-stone-200/80 bg-white p-3 sm:p-4 shadow-sm"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-16 w-16 sm:h-20 sm:w-20 shrink-0 rounded-xl object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="truncate text-sm font-bold text-stone-900">
                        {item.product.name}
                      </p>
                      <button
                        onClick={() => handleRemoveItem(item.product._id)}
                        disabled={updatingId === item.product._id}
                        className="shrink-0 text-stone-300 hover:text-red-500 disabled:opacity-40"
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs font-semibold text-orange-600">
                      ₹{item.product.price} x {item.quantity} = ₹
                      {item.product.price * item.quantity}
                    </p>

                    {/* Quantity stepper */}
                    <div className="mt-2 inline-flex items-center gap-3 rounded-lg border border-stone-200 px-2 py-1">
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, -1)
                        }
                        disabled={
                          item.quantity <= 1 ||
                          updatingId === item.product._id
                        } className="flex h-6 w-6 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100 disabled:opacity-30"
                      >
                        <FiMinus className="h-3 w-3" />
                      </button>
                      <span className="w-4 text-center text-xs font-bold text-stone-900">
                        {updatingId === item.product._id ? (
                          <CgSpinner className="h-3.5 w-3.5 animate-spin mx-auto" />
                        ) : (
                          item.quantity
                        )}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          handleQuantityChange(item.product._id, item.quantity, 1)
                        }
                        disabled={updatingId === item.product._id}
                        className="flex h-6 w-6 items-center justify-center rounded-md text-stone-600 hover:bg-stone-100"
                      >
                        <FiPlus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Delivery Address ── */}
            <div className="mt-6 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
                  <FiMapPin className="h-4 w-4 text-orange-600" />
                  Delivery Address
                </h2>
                <button
                  onClick={() => setShowAddressForm((prev) => !prev)}
                  className="text-xs font-bold text-orange-600 hover:text-orange-700"
                >
                  {showAddressForm ? "Cancel" : "+ Add New"}
                </button>
              </div>

              {/* Add address form */}
              {showAddressForm && (
                <form
                  onSubmit={handleAddAddress}
                  className="mt-3 space-y-2 rounded-xl border border-stone-100 bg-stone-50 p-3"
                >
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      name="fullName"
                      value={addressForm.fullName}
                      onChange={handleAddressFormChange}
                      placeholder="Full Name"
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      name="phone"
                      value={addressForm.phone}
                      onChange={handleAddressFormChange}
                      placeholder="Phone"
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <input
                    name="addressLine1"
                    value={addressForm.addressLine1}
                    onChange={handleAddressFormChange}
                    placeholder="Address Line 1 (House no., Street)"
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    name="addressLine2"
                    value={addressForm.addressLine2}
                    onChange={handleAddressFormChange}
                    placeholder="Address Line 2 (optional)"
                    className="w-full rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      name="city"
                      value={addressForm.city}
                      onChange={handleAddressFormChange}
                      placeholder="City"
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      name="state"
                      value={addressForm.state}
                      onChange={handleAddressFormChange}
                      placeholder="State"
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      name="postalCode"
                      value={addressForm.postalCode}
                      onChange={handleAddressFormChange}
                      placeholder="Postal Code"
                      className="rounded-lg border border-stone-200 px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <select
                      name="addressType"
                      value={addressForm.addressType}
                      onChange={handleAddressFormChange}
                      className="rounded-lg border border-stone-200 px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Home">Home</option>
                      <option value="Work">Work</option>
                      <option value="Other">Other</option>
                    </select>

                    <label className="flex items-center gap-1.5 text-xs text-stone-600">
                      <input
                        type="checkbox"
                        name="isDefault"
                        checked={addressForm.isDefault}
                        onChange={handleAddressFormChange}
                      />
                      Set as default
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={savingAddress}
                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-orange-600 py-2.5 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {savingAddress ? (
                      <CgSpinner className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      "Save Address"
                    )}
                  </button>
                </form>
              )}

              {/* Address list */}
              <div className="mt-3 space-y-2">
                {addressLoading ? (
                  <div className="flex justify-center py-4">
                    <CgSpinner className="h-5 w-5 animate-spin text-orange-600" />
                  </div>
                ) : addresses.length === 0 ? (
                  !showAddressForm && (
                    <p className="py-2 text-xs text-stone-400">
                      No saved address yet. Add one to continue.
                    </p>
                  )
                ) : (
                  addresses.map((addr) => (
                    <button
                      key={addr._id}
                      type="button"
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`flex w-full items-start gap-2 rounded-xl border p-3 text-left transition-colors ${selectedAddressId === addr._id
                          ? "border-orange-500 bg-orange-50"
                          : "border-stone-200 hover:border-stone-300"
                        }`}
                    >
                      <div
                        className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${selectedAddressId === addr._id
                            ? "border-orange-600 bg-orange-600"
                            : "border-stone-300"
                          }`}
                      >
                        {selectedAddressId === addr._id && (
                          <FiCheck className="h-2.5 w-2.5 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-stone-900">
                            {addr.fullName}
                          </span>
                          <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                            {addr.addressType}
                          </span>
                          {addr.isDefault && (
                            <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 text-xs text-stone-500">
                          {addr.addressLine1}
                          {addr.addressLine2 ? `, ${addr.addressLine2}` : ""},{" "}
                          {addr.city}, {addr.state} - {addr.postalCode}
                        </p>
                        <p className="text-xs text-stone-400">{addr.phone}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
            {/* ── Payment Method ── */}
            <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-stone-900">Payment Method</h2>

              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("COD")}
                  className={`rounded-xl border p-3 text-left transition-colors ${paymentMethod === "COD"
                      ? "border-orange-500 bg-orange-50"
                      : "border-stone-200 hover:border-stone-300"
                    }`}
                >
                  <p className="text-xs font-bold text-stone-900">Cash on Delivery</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">
                    Pay when your order arrives
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod("ONLINE")}
                  className={`rounded-xl border p-3 text-left transition-colors ${paymentMethod === "ONLINE"
                      ? "border-orange-500 bg-orange-50"
                      : "border-stone-200 hover:border-stone-300"
                    }`}
                >
                  <p className="text-xs font-bold text-stone-900">Pay Online</p>
                  <p className="mt-0.5 text-[11px] text-stone-500">
                    Card / UPI / Netbanking
                  </p>
                </button>
              </div>
            </div>

            {/* ── Price summary ── */}
            <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
              <h2 className="text-sm font-bold text-stone-900">Bill Details</h2>

              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Item Total</span>
                  <span className="font-medium text-stone-700">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-stone-700">₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between border-t border-stone-100 pt-2 text-base font-bold text-stone-900">
                  <span>To Pay</span>
                  <span>₹{total}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* ── Sticky place order bar ── */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 border-t border-stone-200 bg-white p-4 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4">
            <div>
              <p className="text-xs text-stone-400">Total</p>
              <p className="text-lg font-extrabold text-stone-900">₹{total}</p>
            </div>
            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder || paymentProcessing || !selectedAddressId}
              className="flex flex-1 sm:flex-none items-center justify-center gap-2 rounded-xl bg-orange-600 px-8 py-3.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-orange-700 disabled:opacity-60"
            >
              {placingOrder || paymentProcessing ? (
                <CgSpinner className="h-4 w-4 animate-spin" />
              ) : paymentMethod === "ONLINE" ? (
                "Pay & Place Order"
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
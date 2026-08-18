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

  // 1. Fixed Cart Fetch Route
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

  // 2. Fixed Address Fetch Route
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
      script.src = "https://razorpay.com";
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

  // 3. Fixed Add Address Route
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

  // 4. Fixed Quantity Update Route
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
        `/api/cart/update/${productId}`,
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

  // 5. Fixed Remove Item Route
  const handleRemoveItem = async (productId) => {
    try {
      setUpdatingId(productId);

      const res = await API.delete(
        `/api/cart/remove/${productId}`,
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

  // 6. Fixed Place Order Route
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

  // 7. Fixed Razorpay Create Order & Verify Routes
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


}

export default Cart;

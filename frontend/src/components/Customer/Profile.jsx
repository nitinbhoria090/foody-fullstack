import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../services/axios";
import { toast } from "sonner";
import { getData } from "@/context/userContext";

import {
  FiArrowLeft,
  FiUser,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiLogOut,
} from "react-icons/fi";
import { CgSpinner } from "react-icons/cg";

function Profile() {
  const navigate = useNavigate();
  const { user, setUser } = getData();

  // ── Account info ──
  const [editingInfo, setEditingInfo] = useState(false);
  const [savingInfo, setSavingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState({
    name: user?.name || user?.username || "",
    phone: user?.phone || "",
  });

  // ── Addresses ──
  const [addresses, setAddresses] = useState([]);
  const [addressLoading, setAddressLoading] = useState(true);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
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
    getAddresses();
  }, []);

  const getAddresses = async () => {
    try {
      setAddressLoading(true);

      const res = await API.get("/api/address", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        setAddresses(res.data.addresses || []);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load addresses");
    } finally {
      setAddressLoading(false);
    }
  };

  const handleInfoChange = (e) => {
    setInfoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveInfo = async () => {
    if (!infoForm.name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      setSavingInfo(true);

      // NOTE: was "/users/profile" — missing the "/api" prefix used by every
      // other route in this app, which caused a 404.
      const res = await API.put("/api/users/profile", infoForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        toast.success("Profile updated");
        setUser({ ...user, ...res.data.user });
        setEditingInfo(false);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSavingInfo(false);
    }
  };

  const resetAddressForm = () => {
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
    setEditingAddressId(null);
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const startEditAddress = (addr) => {
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || "",
      city: addr.city,
      state: addr.state,
      postalCode: addr.postalCode,
      addressType: addr.addressType,
      isDefault: addr.isDefault,
    });
    setEditingAddressId(addr._id);
    setShowAddressForm(true);
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const { fullName, phone, addressLine1, city, state, postalCode } =
      addressForm;

    if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setSavingAddress(true);

      const res = editingAddressId
        ? await API.put(`${import.meta.env.VITE_APP_API_URL}/api/address/${editingAddressId}`, addressForm, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          })
        : await API.post(`${import.meta.env.VITE_APP_API_URL}/api/address/add`, addressForm, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          });

      if (res.data.success) {
        toast.success(
          editingAddressId ? "Address updated" : "Address added"
        );
        setShowAddressForm(false);
        resetAddressForm();
        getAddresses();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save address");
    } finally {
      setSavingAddress(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      const res = await API.delete(`${import.meta.env.VITE_APP_API_URL}/api/address/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        toast.success("Address deleted");
        getAddresses();
      }
    } catch (error) {
      toast.error("Failed to delete address");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-stone-50 pb-10 font-sans">
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
            My Profile
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 pt-6">
        {/* ── Account info ── */}
        <div className="rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <FiUser className="h-4 w-4 text-orange-600" />
              Account Info
            </h2>
            {!editingInfo && (
              <button
                onClick={() => setEditingInfo(true)}
                className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                <FiEdit2 className="h-3.5 w-3.5" />
                Edit
              </button>
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl font-extrabold text-orange-600">
              {(infoForm.name || "U").charAt(0).toUpperCase()}
            </span>

            {editingInfo ? (
              <div className="flex-1 space-y-2">
                <input
                  name="name"
                  value={infoForm.name}
                  onChange={handleInfoChange}
                  placeholder="Full Name"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
                <input
                  name="phone"
                  value={infoForm.phone}
                  onChange={handleInfoChange}
                  placeholder="Phone"
                  className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm focus:border-orange-500 focus:outline-none"
                />
              </div>
            ) : (
              <div>
                <p className="text-sm font-bold text-stone-900">
                  {infoForm.name || "—"}
                </p>
                <p className="text-xs text-stone-500">{user?.email}</p>
                {infoForm.phone && (
                  <p className="text-xs text-stone-500">{infoForm.phone}</p>
                )}
              </div>
            )}
          </div>

          {editingInfo && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={handleSaveInfo}
                disabled={savingInfo}
                className="flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-4 py-2 text-xs font-bold text-white hover:bg-orange-700 disabled:opacity-60"
              >
                {savingInfo ? (
                  <CgSpinner className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  "Save Changes"
                )}
              </button>
              <button
                onClick={() => {
                  setEditingInfo(false);
                  setInfoForm({
                    name: user?.name || user?.username || "",
                    phone: user?.phone || "",
                  });
                }}
                className="rounded-lg border border-stone-200 px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ── Saved Addresses ── */}
        <div className="mt-4 rounded-2xl border border-stone-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-stone-900">
              <FiMapPin className="h-4 w-4 text-orange-600" />
              Saved Addresses
            </h2>
            <button
              onClick={() => {
                if (showAddressForm) {
                  setShowAddressForm(false);
                  resetAddressForm();
                } else {
                  resetAddressForm();
                  setShowAddressForm(true);
                }
              }}
              className="flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
            >
              <FiPlus className="h-3.5 w-3.5" />
              {showAddressForm ? "Cancel" : "Add New"}
            </button>
          </div>

          {showAddressForm && (
            <form
              onSubmit={handleAddressSubmit}
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
                ) : editingAddressId ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </button>
            </form>
          )}

          <div className="mt-3 space-y-2">
            {addressLoading ? (
              <div className="flex justify-center py-4">
                <CgSpinner className="h-5 w-5 animate-spin text-orange-600" />
              </div>
            ) : addresses.length === 0 ? (
              !showAddressForm && (
                <p className="py-2 text-xs text-stone-400">
                  No saved address yet.
                </p>
              )
            ) : (
              addresses.map((addr) => (
                <div
                  key={addr._id}
                  className="flex items-start gap-2 rounded-xl border border-stone-200 p-3"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-900">
                        {addr.fullName}
                      </span>
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[10px] font-semibold text-stone-500">
                        {addr.addressType}
                      </span>
                      {addr.isDefault && (
                        <span className="flex items-center gap-1 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-semibold text-orange-600">
                          <FiCheck className="h-2.5 w-2.5" />
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

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      onClick={() => startEditAddress(addr)}
                      className="text-stone-400 hover:text-orange-600"
                    >
                      <FiEdit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteAddress(addr._id)}
                      className="text-stone-300 hover:text-red-500"
                    >
                      <FiTrash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Logout ── */}
        <button
          onClick={handleLogout}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white py-3.5 text-sm font-bold text-red-500 shadow-sm hover:bg-red-50"
        >
          <FiLogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
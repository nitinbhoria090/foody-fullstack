import React, { useState } from "react";
import {
  Package, TrendingUp, Leaf, Flame, Plus, ToggleLeft, ToggleRight,
} from "lucide-react";
// import {  DabbaMark } from "../components/Theme";
import { initialItems, initialAdminOrders } from "../../components/data/mockData";
import { DabbaMark, Theme } from "../../components/Theme";

/* ADMIN PAGE — total orders, new orders, total veg/non-veg item
   counts, menu availability toggles (open/closed), add new item
   form, and a recently-added list. */
export default 
function AdminDashboardPage() {
  const [items, setItems] = useState(initialItems);
  const [orders] = useState(initialAdminOrders);
  const [form, setForm] = useState({ name: "", type: "veg", price: "" });

  const totalOrders = orders.length;
  const newOrders = orders.filter(o => o.status === "new").length;
  const vegCount = items.filter(i => i.type === "veg").length;
  const nonVegCount = items.filter(i => i.type === "non-veg").length;

  const toggleOpen = (id) => setItems(items.map(i => i.id === id ? { ...i, open: !i.open } : i));

  const addItem = () => {
    if (!form.name.trim() || !form.price) return;
    const next = { id: Date.now(), name: form.name.trim(), type: form.type, price: Number(form.price), open: true, added: "Just now" };
    setItems([next, ...items]);
    setForm({ name: "", type: "veg", price: "" });
  };

  const recent = items.slice(0, 5);

  const StatCard = ({ icon, label, value, bg, fg }) => (
    <div className="dabba-card p-5 flex items-center gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: bg }}>
        {React.cloneElement(icon, { size: 20, color: fg })}
      </div>
      <div>
        <p className="text-2xl font-extrabold leading-none">{value}</p>
        <p className="text-xs font-semibold mt-1" style={{ color: "var(--ink-soft)" }}>{label}</p>
      </div>
    </div>
  );

  return (
    <div className="dabba-root min-h-screen">
      <Theme />
      <header className="border-b" style={{ borderColor: "var(--line)" }}>
        <div className="dabba-scroll flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <DabbaMark size={28} ring="var(--indigo)" />
            <span className="dabba-display text-xl font-semibold">Admin Console</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: "var(--indigo-bg)", color: "var(--indigo)" }}>Kitchen: Bombay Tiffins</span>
        </div>
      </header>

      <div className="dabba-scroll py-8">
        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<Package />} label="Total orders" value={totalOrders} bg="var(--indigo-bg)" fg="var(--indigo)" />
          <StatCard icon={<TrendingUp />} label="New orders" value={newOrders} bg="var(--chili-bg)" fg="var(--chili)" />
          <StatCard icon={<Leaf />} label="Veg items" value={vegCount} bg="var(--leaf-bg)" fg="var(--leaf)" />
          <StatCard icon={<Flame />} label="Non-veg items" value={nonVegCount} bg="#FBEBE3" fg="var(--marigold-dk)" />
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Item availability */}
          <div className="lg:col-span-3 dabba-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="dabba-display text-lg font-semibold">Menu availability</h3>
              <span className="text-xs" style={{ color: "var(--ink-soft)" }}>{items.filter(i => i.open).length} open · {items.filter(i => !i.open).length} closed</span>
            </div>
            <div className="flex flex-col divide-y" style={{ borderColor: "var(--line)" }}>
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between py-3" style={{ borderColor: "var(--line)" }}>
                  <div className="flex items-center gap-3">
                    <span className="dabba-ring" style={{ background: item.type === "veg" ? "var(--leaf)" : "var(--chili)" }} />
                    <div>
                      <p className="text-sm font-bold">{item.name}</p>
                      <p className="text-xs" style={{ color: "var(--ink-soft)" }}>₹{item.price} · added {item.added}</p>
                    </div>
                  </div>
                  <button onClick={() => toggleOpen(item.id)} className="flex items-center gap-2 text-xs font-bold" style={{ color: item.open ? "var(--leaf)" : "var(--chili)" }}>
                    {item.open ? <ToggleRight size={26} /> : <ToggleLeft size={26} />}
                    {item.open ? "Open" : "Closed"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Add new item */}
          <div className="lg:col-span-2 dabba-card p-5 h-fit">
            <h3 className="dabba-display text-lg font-semibold mb-4">Add new item</h3>
            <div className="flex flex-col gap-3">
              <input
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Dish name"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid var(--line)" }}
              />
              <div className="flex gap-2">
                {["veg", "non-veg"].map(t => (
                  <button
                    key={t}
                    onClick={() => setForm({ ...form, type: t })}
                    className="flex-1 rounded-lg py-2 text-xs font-bold capitalize"
                    style={{
                      background: form.type === t ? (t === "veg" ? "var(--leaf)" : "var(--chili)") : "var(--cream-2)",
                      color: form.type === t ? "#fff" : "var(--ink)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <input
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                placeholder="Price (₹)"
                type="number"
                className="rounded-lg px-3 py-2 text-sm outline-none"
                style={{ border: "1px solid var(--line)" }}
              />
              <button onClick={addItem} className="dabba-btn rounded-lg py-2.5 text-sm text-white flex items-center justify-center gap-2" style={{ background: "var(--ink)" }}>
                <Plus size={16} /> Add to menu
              </button>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wide mt-6 mb-3" style={{ color: "var(--ink-soft)" }}>Recently added</h4>
            <div className="flex flex-col gap-2">
              {recent.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 font-semibold">
                    <span className="dabba-ring" style={{ background: item.type === "veg" ? "var(--leaf)" : "var(--chili)" }} />
                    {item.name}
                  </span>
                  <span style={{ color: "var(--ink-soft)" }}>{item.added}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
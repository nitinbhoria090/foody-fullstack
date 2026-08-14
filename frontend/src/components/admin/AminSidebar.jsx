import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiPlusCircle,
  FiShoppingBag,
  FiBarChart2,
  FiX,
} from "react-icons/fi";

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Add Item",
      icon: FiPlusCircle,
      path: "/admin/items/add",
    },
    {
      label: "Orders",
      icon: FiShoppingBag,
      path: "/admin/orders",
    },
    {
      label: "Analytics",
      icon: FiBarChart2,
      path: "/admin/analytics",
    },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          left-0
          top-0
          z-50
          h-screen
          w-64
          bg-white
          border-r
          border-stone-200
          shadow-xl
          transition-transform
          duration-300

          ${isOpen ? "translate-x-0" : "-translate-x-full"}

          lg:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex h-20 items-center justify-between border-b border-stone-100 px-5">
          <div>
            <h2 className="text-lg font-extrabold text-stone-900">
              Admin Panel
            </h2>

            <p className="text-xs text-stone-400">
              Restaurant Management
            </p>
          </div>

          {/* Close button only mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-2 text-stone-500 hover:bg-stone-100 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Menu */}
        <nav className="px-3 py-6">
          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Manage
          </p>

          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              const active = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    group
                    flex
                    w-full
                    items-center
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-sm
                    font-semibold
                    transition-all

                    ${
                      active
                        ? "bg-orange-500 text-white shadow-sm"
                        : "text-stone-600 hover:bg-orange-50 hover:text-orange-600"
                    }
                  `}
                >
                  <Icon
                    className={`
                      h-5 w-5

                      ${
                        active
                          ? "text-white"
                          : "text-stone-400 group-hover:text-orange-500"
                      }
                    `}
                  />

                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>
    </>
  );
};

export default AdminSidebar;
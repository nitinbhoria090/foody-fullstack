// import { createBrowserRouter, RouterProvider } from "react-router-dom";

// // 1. Add missing layout and page imports
// import MainLayout from "./components/layouts/MainLayout"; // or "./layouts/MainLayout"
// import Home from "./pages/Home";

// // Existing imports
// import AddItem from "./components/admin/AddItem";
// import AdminDashboard from "./components/admin/AdminDashboard";
// import AdminOrders from "./components/admin/AdminOrder";
// import EditItem from "./components/admin/EditItem";
// import Cart from "./components/Customer/Cart";
// import CategoryPage from "./components/Customer/CategoryPage";
// import Orders_history from "./components/Customer/Orders_history";
// import OrderTracking from "./components/Customer/OrderTracking";
// import ProductDetails from "./components/Customer/ProductDetails";
// import Profile from "./components/Customer/Profile";
// import RiderDashboard from "./components/Rider/RiderDashboard";
// import Login from "./pages/Login";
// import Register from "./pages/Register";
// import AdminAssignRider from "./components/admin/AdminAssignRider"; 

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <MainLayout />,
//     children: [
//       {
//         index: true,
//         element: <Home />,
//       },
//     ],
//   },

//   {
//     path: "/login",
//     element: <Login />,
//   },

//   {
//     path: "/register",
//     element: <Register />,
//   },

//   {
//     path: "/admin/dashboard",
//     element: <AdminDashboard />,
//   },

//   {
//     path: "/rider/dashboard",
//     element: <RiderDashboard />,
//   },
//   {
//      path: "/admin/riders",
//       element: <AdminAssignRider />,
//   },

//   {
//     path: "/product/:id",
//     element: <ProductDetails />,
//   },

//   {
//     path: "/cart",
//     element: <Cart />,
//   },

//   {
//     path: "/orders_history",
//     element: <Orders_history />,
//   },

//   {
//     path: "/profile",
//     element: <Profile />,
//   },

//   {
//     path: "/order-tracking/:id",
//     element: <OrderTracking />,
//   },

//   {
//     path: "/category/:category",
//     element: <CategoryPage />,
//   },

//   {
//     path: "/admin/items/add",
//     element: <AddItem />,
//   },

//   {
//     path: "/admin/items/edit/:id",
//     element: <EditItem />,
//   },

//   {
//     path: "/admin/orders",
//     element: <AdminOrders />,
//   },

//   {
//     path: "*",
//     element: <div>404 Page Not Found</div>,
//   },
// ]);

// function App() {
//   return <RouterProvider router={router} />;
// }

// export default App;



import { useEffect, useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// 1. Add missing layout and page imports
import MainLayout from "./components/layouts/MainLayout"; // or "./layouts/MainLayout"
import Home from "./pages/Home";

// Existing imports
import AddItem from "./components/admin/AddItem";
import AdminDashboard from "./components/admin/AdminDashboard";
import AdminOrders from "./components/admin/AdminOrder";
import EditItem from "./components/admin/EditItem";
import Cart from "./components/Customer/Cart";
import CategoryPage from "./components/Customer/CategoryPage";
import Orders_history from "./components/Customer/Orders_history";
import OrderTracking from "./components/Customer/OrderTracking";
import ProductDetails from "./components/Customer/ProductDetails";
import Profile from "./components/Customer/Profile";
import RiderDashboard from "./components/Rider/RiderDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminAssignRider from "./components/admin/AdminAssignRider";
import Adminanalytics from "./components/admin/AdminAnalytics"; // Import AdminAnalytics

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/register",
    element: <Register />,
  },

  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
  },

  {
    path: "/rider/dashboard",
    element: <RiderDashboard />,
  },
  {
    path: "/admin/riders",
    element: <AdminAssignRider />,
  },
  {
  path: "/admin/analytics",
  element: <Adminanalytics />,
},

  {
    path: "/product/:id",
    element: <ProductDetails />,
  },

  {
    path: "/cart",
    element: <Cart />,
  },

  {
    path: "/orders_history",
    element: <Orders_history />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/order-tracking/:id",
    element: <OrderTracking />,
  },

  {
    path: "/category/:category",
    element: <CategoryPage />,
  },

  {
    path: "/admin/items/add",
    element: <AddItem />,
  },

  {
    path: "/admin/items/edit/:id",
    element: <EditItem />,
  },

  {
    path: "/admin/orders",
    element: <AdminOrders />,
  },
  

  {
    path: "*",
    element: <div>404 Page Not Found</div>,
  },
]);

function App() {

  // ==========================================
  // SPLASH / LOADING SCREEN
  // ==========================================

  const [appLoading, setAppLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAppLoading(false);
    }, 1800); // 1.8 second splash

    return () => clearTimeout(timer);
  }, []);

  if (appLoading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-orange-500 to-red-500">

        <div className="text-7xl animate-bounce">
          🛵
        </div>

        <h1 className="text-white text-2xl font-extrabold mt-4 tracking-wide">
          FoodExpress
        </h1>

        <p className="text-orange-100 text-sm mt-1">
          Getting things ready...
        </p>

        <div className="mt-6 flex gap-1.5">
          <span className="h-2.5 w-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
          <span className="h-2.5 w-2.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
          <span className="h-2.5 w-2.5 bg-white rounded-full animate-bounce"></span>
        </div>

      </div>
    );
  }

  return <RouterProvider router={router} />;
}

export default App;
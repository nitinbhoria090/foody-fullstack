import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout
// import MainLayout from "./components/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./components/layouts/MainLayout";
import AddItem from "./components/admin/AddItem";
import CategoryPage from "./components/Customer/categoryPage";
// Optional
// import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./pages/Dashboard";
// import AdminDashboard from "./pages/AdminDashboard";
import ProductDetails from "./components/Customer/ProductDetails";
import Cart from "./components/Customer/Cart";
import Orders from "./components/Customer/Orders_history";
import OrderTracking from "./components/Customer/OrderTracking";
import Profile from "./components/Customer/Profile";
import EditItem from "./components/admin/EditItem";


const router = createBrowserRouter([
  // Public Layout
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <Home /> },

      // Add more public pages here
      // { path: "about", element: <About /> },
      // { path: "contact", element: <Contact /> },
    ],
  },
  {
    path: "/order-tracking/:id",
    element: <OrderTracking />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

  // Authentication
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
    path: "/category/:category",
    element: <CategoryPage />
},
{
  path: "/product/:id",
  element: <ProductDetails />
},
{
  path: "/cart",
  element: <Cart />
},
{
  path: "/orders_history",
  element: <Orders />
},

  // User Protected Routes
  // {
  //   element: <ProtectedRoute allowedRoles={["user"]} />,
  //   children: [
  //     {
  //       path: "/dashboard",
  //       element: <Dashboard />,
  //     },
  //   ],
  // },

  // Admin Protected Routes
  // {
  //   element: <ProtectedRoute allowedRoles={["admin"]} />,
  //   children: [
  //     {
  //       path: "/admin",
  //       element: <AdminDashboard />,
  //     },
  //   ],
  // },

  // 404

  {
    path: "*",
    element: <h1 className="text-center text-3xl mt-20">404 Page Not Found</h1>,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Layout
// import MainLayout from "./components/MainLayout";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MainLayout from "./components/layouts/MainLayout";
import AddItem from "./components/admin/AddItem";

// Optional
// import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./pages/Dashboard";
// import AdminDashboard from "./pages/AdminDashboard";

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
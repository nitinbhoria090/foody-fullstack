import AdminDashboardPage from "@/components/admin/AdminDashboard";
import CustomerHome from "../components/Customer/CustomerHome";
import { getData } from "../context/userContext";

const Home = () => {
  const { user } = getData();

  if (!user) {
    return <CustomerHome />;
  }

  if (user.role === "admin") {
    return <AdminDashboardPage />;
  }
  if (user.role === "rider") {
    return <RiderDashboard />;
  }

  return <CustomerHome />;
};

export default Home;
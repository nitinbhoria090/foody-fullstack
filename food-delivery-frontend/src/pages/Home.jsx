
const Home = () => {
  const { user } = getData();

  if (!user) {
    return <CustomerHome />;
  }

  if (user.role === "restaurant") {
    return <RestaurantHome />;
  }
  if (user.role === "rider") {
    return <RiderDashboard />;
  }

  return <CustomerHome />;
};

export default Home;
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Products from "./pages/Property";
import PageNotFound from "./pages/PageNotFound";
import "./App.css";
import ProductDetail from "./pages/PropertyDetail";
import AppLayout from "./Components/AppLayout";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProperty";
import { CartProvider } from "./context/CartContext";
import Success from "./pages/Success";
import Cancel from "./pages/Cancel";
import UserOrder from "./pages/UserOrder";
import AdminOrder from "./pages/AdminOrder";
import Edit from "./pages/Edit";
import AddCategory from "./pages/AddCategory";
import Website from "./pages/Website";
import Contactus from "./pages/Contactus";
import Visit from "./pages/Visit";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user?.role !== "admin") {
    return <PageNotFound />;
  }

  return children;
}

function App() {
  return (
    <CartProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<Website />} />
            <Route path="/property" element={<Products />} />
            <Route path="/:id" element={<ProductDetail />} />
            {<Route path="contact" element={<Contactus />} />}
            <Route
              path="dashboard"
              element={
                <AdminRoute>
                  <Dashboard />
                </AdminRoute>
              }
            />
            <Route
              path="addProduct"
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              }
            />
            <Route path="success" element={<Success />} />
            <Route path="cancel" element={<Cancel />} />
            <Route path="userOrder" element={<UserOrder />} />
            <Route
              path="category"
              element={
                <AdminRoute>
                  <AddCategory />
                </AdminRoute>
              }
            />
            <Route
              path="adminOrders"
              element={
                <AdminRoute>
                  <AdminOrder />
                </AdminRoute>
              }
            />
            <Route
              path="edit"
              element={
                <AdminRoute>
                  <Edit />
                </AdminRoute>
              }
            />
            <Route
              path="edit/:id"
              element={
                <AdminRoute>
                  <Edit />
                </AdminRoute>
              }
            />
            <Route
              path="visit"
              element={
                <AdminRoute>
                  <Visit />
                </AdminRoute>
              }
            />
          </Route>
          <Route path="*" element={<PageNotFound />} />
          <Route path="login" element={<Login />} />
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AIHub from "./AIHub";
import Home from "./components/Home";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Website from "./components/Website";
import AdminLogin from "./components/AdminLogin";

import { ShopProvider } from "./context/ShopContext";

import {
  Products as ShopProducts,
  ProductDetails,
  Cart,
  Wishlist,
  InfoPage,
} from "./components/ShopPages";

import AdminLayout from "./admin/AdminLayout";
import AdminGuard from "./admin/AdminGuard";
import Products from "./admin/Products";
import AddProduct from "./admin/AddProduct";
import EditProduct from "./admin/EditProduct";
import Contact from "./components/Contact";
import About from "./components/About";

function AdminDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-3 text-gray-500">
        Welcome to your store admin panel.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ShopProvider>
        <Toaster position="top-right" />

        <Routes>
          {/* Customer pages */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/ai" element={<AIHub />} />

          {/* Store website */}
          <Route path="/website" element={<Website />} />
          <Route path="/products" element={<ShopProducts />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/about" element={<InfoPage type="about" />} />
          <Route path="/contact" element={<InfoPage type="contact" />} />

          {/* Separate admin login */}
          <Route
            path="/admin-login"
            element={<AdminLogin />}
          />

          {/* Protected admin dashboard */}
          <Route
            path="/admin"
            element={
              <AdminGuard>
                <AdminLayout />
              </AdminGuard>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="products/create" element={<AddProduct />} />
            <Route path="products/edit/:id" element={<EditProduct />} />
          </Route>

          {/* Unknown page */}
          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />
        </Routes>
      </ShopProvider>
    </BrowserRouter>
  );
}

export default App;
import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Signup from "../pages/auth/Signup";
import Home from "../pages/user/Home";
import SellerDashboard from "../pages/seller/SellerDashboard";
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminOrders from "../pages/admin/AdminOrders";
import SellerProducts from "../pages/seller/SellerProducts";
import SellerOrders from "../pages/seller/SellerOrders";
import ProtectedRoute from "../components/ProtectedRoute";
import ProductDetail from "../pages/user/ProductDetail";
import EditProduct from "../pages/seller/EditProduct";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import Profile from "../pages/user/Profile";
import Orders from "../pages/user/Orders";
import OrderDetail from "../pages/user/OrderDetail";
import AllProducts from "../pages/user/AllProducts";
import Wishlist from "../pages/user/Wishlist";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/seller"
        element={
          <ProtectedRoute role="seller">
            <SellerDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="products" element={<SellerProducts />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="edit-product/:id" element={<EditProduct />} />
        <Route
          path="analytics"
          element={
            <div className="p-10 text-2xl font-bold">
              Seller Analytics (Coming Soon)
            </div>
          }
        />
        <Route
          path="settings"
          element={
            <div className="p-10 text-2xl font-bold">
              Seller Settings (Coming Soon)
            </div>
          }
        />
      </Route>
      {/* ... existing user routes ... */}
      <Route
        path="/cart"
        element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/order/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/products" element={<AllProducts />} />

      {/* Admin */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      >
        <Route path="users" element={<AdminUsers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route
          path="analytics"
          element={
            <div className="p-10 text-2xl font-bold">
              Store Analytics (Coming Soon)
            </div>
          }
        />
      </Route>

      {/* Fallback for other navbar links */}
      <Route path="/collection" element={<AllProducts />} />
      <Route path="/new-arrivals" element={<AllProducts />} />
      <Route path="/sale" element={<AllProducts />} />
      <Route
        path="/designers"
        element={
          <div className="p-20 text-center text-3xl font-bold font-heading">
            Our Featured Designers (Coming Soon)
          </div>
        }
      />
      <Route
        path="/wishlist"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/likes"
        element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        }
      />
      <Route
        path="/reviews"
        element={
          <div className="p-20 text-center text-3xl font-bold font-heading">
            Product Reviews (Coming Soon)
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;

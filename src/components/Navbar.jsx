import { Link } from "react-router-dom";
import { ShoppingCart, Heart, User, Store, LogIn, UserPlus } from "lucide-react";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const { cart, wishlist } = useShop();

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3.5">
        {/* Logo */}
        <Link
          to="/website"
          className="flex items-center gap-2.5 text-2xl font-bold tracking-tight text-gray-900 transition hover:text-violet-600"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
            <Store size={20} />
          </div>
          ShopZone
        </Link>

        {/* Navigation Links */}
        <div className="hidden items-center gap-1 md:flex">
          <Link
            to="/website"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Home
          </Link>
          <Link
            to="/products"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Products
          </Link>
          <Link
            to="/about"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
          >
            About
          </Link>
          <Link
            to="/contact"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-violet-50 hover:text-violet-600"
          >
            Contact
          </Link>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Wishlist */}
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-violet-600"
          >
            <Heart size={20} />
            {wishlist.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-semibold text-white">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-violet-600"
          >
            <ShoppingCart size={20} />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-violet-600 px-1 text-[11px] font-semibold text-white">
                {cart.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-gray-200" />

          {/* Login Button */}
          <Link
            to="/login"
            className="hidden items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:border-violet-600 hover:bg-violet-50 hover:text-violet-600 sm:flex"
          >
            <LogIn size={16} />
            Login
          </Link>

          {/* Sign Up Button */}
          <Link
            to="/signup"
            className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 hover:shadow"
          >
            <UserPlus size={16} />
            Sign Up
          </Link>

          {/* Profile (optional - agar user logged in ho to dikhana) */}
          <Link
            to="/profile"
            aria-label="Profile"
            className="ml-1 flex h-10 w-10 items-center justify-center rounded-lg text-gray-700 transition hover:bg-gray-100 hover:text-violet-600"
          >
            <User size={20} />
          </Link>
        </div>
      </div>
    </nav>
  );
}
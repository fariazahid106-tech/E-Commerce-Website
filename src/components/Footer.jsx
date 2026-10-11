import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="mt-16 bg-gray-950 px-6 py-10 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-3">
        <div>
          <h2 className="text-2xl font-bold">ShopZone</h2>
          <p className="mt-3 text-sm text-gray-400">
            Discover products you'll love, all in one place.
          </p>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Quick Links</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <Link to="/website">Home</Link>
            <Link to="/products">Products</Link>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-semibold">Your Account</h3>
          <div className="flex flex-col gap-2 text-sm text-gray-300">
            <Link to="/profile">My Profile</Link>
            <Link to="/wishlist">My Wishlist</Link>
            <Link to="/cart">Shopping Cart</Link>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-gray-800 pt-5 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} ShopZone. All rights reserved.
      </div>
    </footer>
  );
}
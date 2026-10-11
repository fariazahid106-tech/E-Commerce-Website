import { Store, ShoppingBag, Heart, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function About() {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-12">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 md:text-4xl">
              About ShopZone
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-gray-500">
              Your one-stop destination for quality products at the best prices.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Left - Text */}
            <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
              <h2 className="text-2xl font-semibold text-gray-900">Who We Are</h2>
              <p className="mt-4 leading-relaxed text-gray-600">
                Welcome to <span className="font-semibold text-violet-600">ShopZone</span>! 
                We are dedicated to bringing you a seamless shopping experience with a wide range of quality products.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Our product catalog is carefully managed through our Admin Panel, ensuring that you always get the latest and best items. 
                Whether you're looking for something specific or just browsing, we've got you covered.
              </p>
              <p className="mt-4 leading-relaxed text-gray-600">
                Thank you for choosing ShopZone. We look forward to serving you!
              </p>
            </div>

            {/* Right - Features */}
            <div className="space-y-5">
              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <ShoppingBag size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Wide Collection</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Explore a variety of products carefully selected for you.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Heart size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Save Favorites</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add products to your wishlist and buy them later.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Secure & Reliable</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Shop with confidence. We prioritize your experience.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 text-violet-600">
                  <Store size={22} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Easy Shopping</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Simple and clean interface for a better shopping journey.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
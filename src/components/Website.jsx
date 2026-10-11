import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, onSnapshot } from "firebase/firestore";
import {
  ArrowRight,
  Heart,
  ShoppingCart,
  Sparkles,
  ShieldCheck,
  Truck,
  Headphones,
} from "lucide-react";
import { db } from "../firebase";
import { useShop } from "../context/ShopContext";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Website() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { addToCart, wishlist, toggleWishlist } = useShop();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        setProducts(
          snapshot.docs.map((item) => ({
            id: item.id,
            ...item.data(),
          }))
        );
        setLoading(false);
        setError("");
      },
      (err) => {
        console.error(err);
        setError("Products load nahi ho sake. Firebase rules check karo.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090f] text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden px-5 py-24 sm:py-36">
        <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-[100px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-2 text-sm text-violet-300">
              <Sparkles size={16} /> Discover Something Special
            </span>

            <h1 className="mt-7 text-5xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              Find Your
              <span className="block text-violet-400">Next Favourite.</span>
            </h1>

            <p className="mt-6 max-w-lg leading-8 text-gray-400">
              Explore our latest collection, discover products you love, and
              save your favourites. Your next great find starts here.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold transition hover:bg-violet-500"
              >
                Shop Collection <ArrowRight size={19} />
              </Link>

              <Link
                to="/wishlist"
                className="inline-flex items-center gap-2 rounded-xl border border-gray-700 px-6 py-4 font-semibold hover:bg-white/5"
              >
                <Heart size={18} /> Wishlist
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-5 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-violet-400" />
                Easy shopping
              </span>
              <span className="flex items-center gap-2">
                <ShoppingCart size={18} className="text-violet-400" />
                Simple cart
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] border border-violet-500/20 bg-gradient-to-br from-violet-600/20 via-[#151522] to-fuchsia-600/10 p-5 sm:p-8">
              <div className="rounded-3xl border border-white/10 bg-[#09090f]/80 p-6 sm:p-9">
                <Sparkles size={45} className="text-violet-400" />
                <p className="mt-8 text-sm uppercase tracking-[4px] text-violet-300">
                  Curated for you
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Your style. Your choice.
                </h2>
                <p className="mt-4 leading-7 text-gray-400">
                  Browse the collection and find something that feels just
                  right for you.
                </p>
                <Link
                  to="/products"
                  className="mt-7 inline-flex items-center gap-2 font-semibold text-violet-300 hover:text-white"
                >
                  Explore products <ArrowRight size={18} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="border-y border-white/10 bg-[#10101a]">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:grid-cols-3">
          <div className="flex items-center gap-4">
            <Truck size={28} className="text-violet-400" />
            <div>
              <h3 className="font-semibold">Browse with Ease</h3>
              <p className="mt-1 text-sm text-gray-400">
                Discover the collection
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ShieldCheck size={28} className="text-violet-400" />
            <div>
              <h3 className="font-semibold">Your Favourites</h3>
              <p className="mt-1 text-sm text-gray-400">
                Keep products in your wishlist
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Headphones size={28} className="text-violet-400" />
            <div>
              <h3 className="font-semibold">Need Help?</h3>
              <p className="mt-1 text-sm text-gray-400">
                Visit our contact page
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Firebase Products */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[3px] text-violet-400">
              Our Collection
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Featured Products
            </h2>
            <p className="mt-3 text-gray-400">
              Fresh from our product collection.
            </p>
          </div>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-violet-300 hover:text-white"
          >
            View All <ArrowRight size={18} />
          </Link>
        </div>

        {loading && (
          <p className="py-10 text-center text-gray-400">
            Loading products from Firebase...
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-500/20 bg-red-500/5 p-5 text-red-300">
            {error}
          </p>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-gray-800 px-5 py-14 text-center">
            <ShoppingCart size={40} className="mx-auto text-violet-400" />
            <h3 className="mt-4 text-xl font-semibold">
              Products coming soon
            </h3>
            <p className="mt-2 text-gray-400">
              Admin Panel se pehla product add karo. Woh yahan automatically
              show hoga.
            </p>
          </div>
        )}

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 8).map((product) => {
            const saved = wishlist.some((item) => item.id === product.id);

            return (
              <article
                key={product.id}
                className="group overflow-hidden rounded-2xl border border-gray-800 bg-[#12121c] transition hover:-translate-y-1 hover:border-violet-500/50"
              >
                <div className="relative">
                  <Link to={`/products/${product.id}`}>
                    <img
                      src={
                        product.image ||
                        "https://placehold.co/600x450?text=Product"
                      }
                      alt={product.name || "Product"}
                      loading="lazy"
                      className="h-56 w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                  </Link>

                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label={
                      saved ? "Remove from wishlist" : "Add to wishlist"
                    }
                    className="absolute right-3 top-3 rounded-full bg-black/70 p-3 text-white backdrop-blur hover:bg-violet-600"
                  >
                    <Heart
                      size={19}
                      className={
                        saved
                          ? "fill-pink-500 text-pink-500"
                          : "text-white"
                      }
                    />
                  </button>
                </div>

                <div className="p-5">
                  <Link to={`/products/${product.id}`}>
                    <h3 className="truncate text-lg font-semibold hover:text-violet-300">
                      {product.name || "Untitled Product"}
                    </h3>
                  </Link>

                  <p className="mt-2 text-xl font-bold text-violet-300">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </p>

                  <p className="mt-3 line-clamp-2 min-h-10 text-sm leading-5 text-gray-400">
                    {product.description || "Discover more about this product."}
                  </p>

                  <div className="mt-5 flex gap-2">
                    <Link
                      to={`/products/${product.id}`}
                      className="flex-1 rounded-xl border border-gray-700 py-3 text-center text-sm font-semibold hover:bg-white/5"
                    >
                      View Details
                    </Link>

                    <button
                      onClick={() => addToCart(product)}
                      aria-label="Add to cart"
                      className="rounded-xl bg-violet-600 px-4 hover:bg-violet-500"
                    >
                      <ShoppingCart size={19} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Call to action */}
      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 px-6 py-14 text-center sm:px-12">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Found something you love?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Keep your favourite finds close and explore the entire collection.
          </p>
          <Link
            to="/products"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold hover:bg-violet-500"
          >
            Explore All Products <ArrowRight size={19} />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
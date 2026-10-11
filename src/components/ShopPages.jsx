import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useShop } from "../context/ShopContext";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Heart, ShoppingCart, Minus, Plus, Trash2, ArrowLeft } from "lucide-react";

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-[70vh] bg-gray-50">
        <div className="mx-auto max-w-7xl px-5 py-10">{children}</div>
      </main>
      <Footer />
    </>
  );
}

function ProductCard({ product }) {
  const { addToCart, toggleWishlist } = useShop();

  return (
    <div className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/products/${product.id}`} className="block overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-56 items-center justify-center bg-gray-100 text-gray-400">
            No image
          </div>
        )}
      </Link>

      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="truncate text-base font-semibold text-gray-900 transition group-hover:text-violet-600">
            {product.name}
          </h3>
        </Link>

        <p className="mt-1.5 text-lg font-bold text-violet-600">
          Rs. {Number(product.price || 0).toLocaleString()}
        </p>

        <div className="mt-4 flex gap-2">
          <button
            onClick={() => addToCart(product)}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2.5 text-sm font-medium text-white transition hover:bg-violet-700"
          >
            <ShoppingCart size={16} />
            Add to Cart
          </button>

          <button
            onClick={() => toggleWishlist(product)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600"
            aria-label="Toggle wishlist"
          >
            <Heart size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        const snapshot = await getDocs(collection(db, "products"));
        const data = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
        console.log("Products fetched:", data); // Browser console mein dekho
        setProducts(data);
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Our Products</h1>
        <p className="mt-2 text-gray-500">Explore our latest collection.</p>
      </div>

      {loading && <p>Loading products...</p>}
      {error && <p className="text-red-600">Error: {error}</p>}

      {!loading && products.length === 0 && (
        <div className="rounded-2xl bg-white py-16 text-center">
          <p>No products found in Firestore "products" collection.</p>
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Layout>
  );
}

export function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart, toggleWishlist } = useShop();

  useEffect(() => {
    async function loadProduct() {
      try {
        const snapshot = await getDoc(doc(db, "products", id));
        if (snapshot.exists()) {
          setProduct({ id: snapshot.id, ...snapshot.data() });
        }
      } catch (error) {
        console.error("Product loading error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [id]);

  return (
    <Layout>
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">Loading product...</p>
        </div>
      ) : !product ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <p className="text-gray-500">Product not found.</p>
        </div>
      ) : (
        <div className="grid items-start gap-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm md:grid-cols-2 lg:gap-12 lg:p-8">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="max-h-[520px] w-full rounded-xl object-cover"
            />
          ) : (
            <div className="flex h-80 items-center justify-center rounded-xl bg-gray-100 text-gray-400">
              No image available
            </div>
          )}

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {product.name}
            </h1>
            <p className="mt-3 text-3xl font-bold text-violet-600">
              Rs. {Number(product.price || 0).toLocaleString()}
            </p>
            <p className="mt-6 whitespace-pre-line leading-relaxed text-gray-600">
              {product.description || "No description available."}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => addToCart(product)}
                className="flex items-center gap-2 rounded-lg bg-violet-600 px-6 py-3 font-medium text-white transition hover:bg-violet-700"
              >
                <ShoppingCart size={18} />
                Add to Cart
              </button>
              <button
                onClick={() => toggleWishlist(product)}
                className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition hover:border-violet-400 hover:bg-violet-50 hover:text-violet-600"
              >
                <Heart size={18} />
                Add to Wishlist
              </button>
            </div>

            <Link
              to="/products"
              className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700"
            >
              <ArrowLeft size={16} />
              Back to Products
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
}

export function Cart() {
  const { cart, removeFromCart, changeQuantity } = useShop();

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.quantity,
    0
  );

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        Shopping Cart
      </h1>

      {cart.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <ShoppingCart className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="mb-4 text-gray-500">Your cart is empty.</p>
          <Link
            to="/products"
            className="inline-block rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-700"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-gray-900">{item.name}</h2>
                <p className="mt-1 text-violet-600 font-medium">
                  Rs. {Number(item.price || 0).toLocaleString()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center rounded-lg border border-gray-200">
                  <button
                    onClick={() => changeQuantity(item.id, -1)}
                    className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => changeQuantity(item.id, 1)}
                    className="flex h-9 w-9 items-center justify-center text-gray-600 hover:bg-gray-50"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900">
              Total: Rs. {total.toLocaleString()}
            </h2>
          </div>

          <p className="text-sm text-gray-500">
            Checkout and online payment are not configured yet.
          </p>
        </div>
      )}
    </Layout>
  );
}

export function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useShop();

  return (
    <Layout>
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">
        My Wishlist
      </h1>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl bg-white py-16 text-center shadow-sm">
          <Heart className="mx-auto mb-4 text-gray-300" size={48} />
          <p className="text-gray-500">Your wishlist is empty.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product.id}>
              <ProductCard product={product} />
              <div className="mt-3 flex justify-between px-1">
                <button
                  onClick={() => toggleWishlist(product)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
                <button
                  onClick={() => addToCart(product)}
                  className="text-sm font-medium text-violet-600 hover:text-violet-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export function InfoPage({ type }) {
  const isAbout = type === "about";

  return (
    <Layout>
      <div className="mx-auto max-w-3xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          {isAbout ? "About ShopZone" : "Contact Us"}
        </h1>

        {isAbout ? (
          <p className="mt-6 max-w-2xl leading-relaxed text-gray-600">
            Welcome to ShopZone! Browse our collection, explore product
            details, and save your favorite items. Our product catalog is
            managed through our store's Admin Panel.
          </p>
        ) : (
          <div className="mt-6 space-y-3 text-gray-600">
            <p>Have a question about our products? We would love to hear from you.</p>
            <p>Please add your store's real contact email here.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
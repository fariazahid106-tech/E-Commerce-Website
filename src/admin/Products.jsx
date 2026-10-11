import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  async function getProducts() {
    try {
      const snapshot = await getDocs(collection(db, "products"));
      setProducts(
        snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Products load nahi hue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getProducts();
  }, []);

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Kya tum ye product delete karna chahti ho?"
    );

    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((oldProducts) =>
        oldProducts.filter((product) => product.id !== id)
      );
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Product delete nahi hua");
    }
  }

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-violet-400">Manage your store</p>
          <h1 className="mt-2 text-3xl font-bold">All Products</h1>
        </div>

        <Link
          to="/admin/products/create"
          className="flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-semibold hover:bg-violet-500"
        >
          <Plus size={19} /> Add Product
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-400">Loading products...</p>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-gray-800 p-8 text-center">
          <p className="text-gray-400">Abhi koi product nahi hai.</p>
          <Link
            to="/admin/products/create"
            className="mt-4 inline-block text-violet-400"
          >
            Add your first product →
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-800">
          <table className="w-full min-w-[650px] text-left">
            <thead className="bg-[#151520] text-sm text-gray-400">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t border-gray-800">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "https://placehold.co/80x80"}
                        alt={product.name || "Product"}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold">{product.name}</p>
                        <p className="max-w-xs truncate text-sm text-gray-500">
                          {product.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    Rs. {Number(product.price || 0).toLocaleString()}
                  </td>

                  <td className="p-4">
                    <div className="flex gap-2">
                      <Link
                        to={`/admin/products/edit/${product.id}`}
                        aria-label="Edit product"
                        className="rounded-lg bg-blue-500/10 p-2 text-blue-400"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(product.id)}
                        aria-label="Delete product"
                        className="rounded-lg bg-red-500/10 p-2 text-red-400"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
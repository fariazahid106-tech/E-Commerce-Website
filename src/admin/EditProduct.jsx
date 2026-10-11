import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getProduct() {
      try {
        const result = await getDoc(doc(db, "products", id));

        if (!result.exists()) {
          toast.error("Product nahi mila");
          navigate("/admin/products");
          return;
        }

        const data = result.data();

        setForm({
          name: data.name || "",
          price: String(data.price ?? ""),
          image: data.image || "",
          description: data.description || "",
        });
      } catch (error) {
        console.error(error);
        toast.error("Product load nahi hua");
      } finally {
        setLoading(false);
      }
    }

    getProduct();
  }, [id, navigate]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!form.name.trim() || form.price === "" || Number(form.price) < 0) {
      toast.error("Name aur valid price enter karo");
      return;
    }

    setSaving(true);

    try {
      await updateDoc(doc(db, "products", id), {
        name: form.name.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        description: form.description.trim(),
      });

      toast.success("Product updated successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Product update nahi hua");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle =
    "mt-2 w-full rounded-xl border border-gray-700 bg-[#09090f] px-4 py-3 text-white outline-none focus:border-violet-500";

  if (loading) return <p className="text-gray-400">Loading product...</p>;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-violet-400"
      >
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold">Edit Product</h1>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5 rounded-2xl border border-gray-800 bg-[#12121c] p-6"
      >
        <div>
          <label htmlFor="name">Product Name</label>
          <input
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="price">Price (Rs.)</label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            className={inputStyle}
            required
          />
        </div>

        <div>
          <label htmlFor="image">Image URL</label>
          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            className={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            className={inputStyle}
            rows={4}
          />
        </div>

        <button
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
}
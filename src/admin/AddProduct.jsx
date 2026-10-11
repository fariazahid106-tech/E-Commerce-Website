import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { db } from "../firebase";

export default function AddProduct() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

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
      await addDoc(collection(db, "products"), {
        name: form.name.trim(),
        price: Number(form.price),
        image: form.image.trim(),
        description: form.description.trim(),
        createdAt: new Date(),
      });

      toast.success("Product created successfully!");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Product save nahi hua. Firebase rules check karo.");
    } finally {
      setSaving(false);
    }
  }

  const inputStyle =
    "mt-2 w-full rounded-xl border border-gray-700 bg-[#09090f] px-4 py-3 text-white outline-none focus:border-violet-500";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/admin/products"
        className="mb-6 inline-flex items-center gap-2 text-violet-400"
      >
        <ArrowLeft size={18} /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold">Add New Product</h1>
      <p className="mt-2 text-gray-400">
        Product details enter karke save karo.
      </p>

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
            placeholder="Enter product name"
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
            placeholder="Enter price"
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
            placeholder="https://example.com/image.jpg"
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
            placeholder="Describe your product"
            rows={4}
          />
        </div>

        <button
          disabled={saving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 font-semibold hover:bg-violet-500 disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
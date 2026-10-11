import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import toast from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("Signed-in UID:", result.user.uid);
      console.log("Firebase project:", db.app.options.projectId);

      const adminRef = doc(db, "admins", result.user.uid);
      const adminSnapshot = await getDoc(adminRef);

      console.log("Admin document exists:", adminSnapshot.exists());
      console.log(
        "Admin document data:",
        adminSnapshot.exists() ? adminSnapshot.data() : "DOCUMENT NOT FOUND"
      );

      if (
        !adminSnapshot.exists() ||
        adminSnapshot.data().role !== "admin"
      ) {
        await signOut(auth);

        toast.error("Admin document or role does not match.");
        return;
      }

      toast.success("Admin login successful!");
      navigate("/admin", { replace: true });
    } catch (error) {
      console.error("ADMIN LOGIN ERROR:", error.code, error.message);

      toast.error(
        error.code === "permission-denied"
          ? "Firestore permission denied. Check admin document and rules."
          : error.message
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 p-5">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md space-y-5 rounded-2xl bg-white p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-gray-900">
          Admin Login
        </h1>

        <p className="text-gray-500">
          Sign in with your authorized administrator account.
        </p>

        <div>
          <label className="mb-2 block font-medium">Admin Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border p-3 outline-violet-600"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border p-3 outline-violet-600"
            placeholder="Enter admin password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-violet-600 p-3 font-semibold text-white disabled:opacity-60"
        >
          {loading ? "Checking..." : "Login as Admin"}
        </button>
      </form>
    </div>
  );
}

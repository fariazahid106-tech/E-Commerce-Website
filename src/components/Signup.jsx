import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../firebase";
import { UserPlus, ArrowLeft } from "lucide-react";

function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      await updateProfile(result.user, {
        displayName: name.trim(),
      });

      // Firestore mein user save karo
      await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name: name.trim(),
        email: result.user.email,
        createdAt: serverTimestamp(),
      });

      toast.success("Account created successfully!");
      navigate("/login", { replace: true });
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("This email is already registered");
      } else if (error.code === "auth/weak-password") {
        toast.error("Password must be at least 6 characters");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Please enter a valid email");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090f] px-4 py-8 text-white">
      <div className="w-full max-w-md rounded-3xl border border-gray-800 bg-[#12121c] p-7 shadow-2xl sm:p-9">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Home
        </Link>

        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
          <UserPlus size={27} />
        </div>

        <h1 className="text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-gray-400">
          Sign up to get started.
        </p>

        <form onSubmit={handleSignup} className="mt-7 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#09090f] px-4 py-3 outline-none transition focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Email Address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#09090f] px-4 py-3 outline-none transition focus:border-violet-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">
              Password
            </label>
            <input
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-700 bg-[#09090f] px-4 py-3 outline-none transition focus:border-violet-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
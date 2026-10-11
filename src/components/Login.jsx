import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import toast from "react-hot-toast";
import { auth, db } from "../firebase"; // db bhi import karo
import { LogIn, ArrowLeft } from "lucide-react";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast.error("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Device detect
      const ua = navigator.userAgent;
      let device = "Unknown";
      if (/Windows/i.test(ua)) device = "Windows";
      else if (/Mac/i.test(ua)) device = "Mac";
      else if (/Android/i.test(ua)) device = "Android";
      else if (/iPhone|iPad/i.test(ua)) device = "iOS";

      // Firestore mein save karo
      await setDoc(doc(db, "activeUsers", user.uid), {
        email: user.email,
        uid: user.uid,
        device: device,
        loginTime: serverTimestamp(),
        status: "online",
      });

      toast.success("Login successful! Welcome back.");
      navigate("/profile", { replace: true });
    } catch (error) {
      if (
        error.code === "auth/invalid-credential" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/wrong-password"
      ) {
        toast.error("Incorrect email or password");
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
          <LogIn size={27} />
        </div>

        <h1 className="text-3xl font-bold">Welcome Back</h1>
        <p className="mt-2 text-sm text-gray-400">
          Login to access your profile.
        </p>

        <form onSubmit={handleLogin} className="mt-7 space-y-5">
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
              placeholder="Enter your password"
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
            {loading ? "Logging In..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-violet-400 hover:text-violet-300"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
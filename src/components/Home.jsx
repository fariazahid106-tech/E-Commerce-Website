import { Link } from "react-router-dom";
import { UserPlus, LogIn, Sparkles } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-[#09090f] text-white flex items-center justify-center px-5">
      <div className="w-full max-w-3xl text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-600/20 text-violet-400">
          <Sparkles size={32} />
        </div>

        <p className="mb-4 text-sm font-semibold uppercase tracking-[4px] text-violet-400">
          Welcome to our website
        </p>

        <h1 className="text-4xl font-extrabold leading-tight sm:text-6xl">
          Your Journey
          <span className="block text-violet-400">Starts Here.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-400">
          Create your account, sign in, and explore your personal profile.
          Everything starts with one simple step.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            to="/signup"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-7 py-4 font-semibold transition hover:bg-violet-500"
          >
            <UserPlus size={19} />
            Sign Up
          </Link>

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-700 px-7 py-4 font-semibold transition hover:border-violet-400 hover:bg-white/5"
          >
            <LogIn size={19} />
            Login
          </Link>
        </div>

        <p className="mt-12 text-sm text-gray-600">
          Simple. Secure. Made for you.
        </p>
      </div>
    </div>
  );
}

export default Home;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import toast from "react-hot-toast";
import { auth } from "../firebase";
import { UserRound, Mail, House } from "lucide-react";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        toast.error("Please login to access your profile");
        navigate("/login", { replace: true });
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  if (checkingAuth || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090f] text-white">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090f] px-4 py-10 text-white">
      <div className="w-full max-w-lg rounded-3xl border border-gray-800 bg-[#12121c] p-8 text-center shadow-2xl sm:p-10">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-violet-600/20 text-violet-400">
          <UserRound size={40} />
        </div>

        <p className="text-sm font-semibold uppercase tracking-widest text-violet-400">
          Your Account
        </p>

        <h1 className="mt-3 text-3xl font-bold">
          My Profile
        </h1>

        <p className="mt-2 text-gray-400">
          Welcome, {user.displayName || "User"}!
        </p>

        <div className="mt-8 space-y-4 text-left">
          <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#09090f] p-4">
            <UserRound className="shrink-0 text-violet-400" size={22} />

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Full Name</p>
              <p className="break-words font-medium">
                {user.displayName || "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-[#09090f] p-4">
            <Mail className="shrink-0 text-violet-400" size={22} />

            <div className="min-w-0">
              <p className="text-xs text-gray-500">Email Address</p>
              <p className="break-all font-medium">{user.email}</p>
            </div>
          </div>
        </div>

       <button
  type="button"
  onClick={() => {
    navigate("/website");
  }}
  className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold transition hover:bg-violet-500"
>
  <House size={19} />
  Go to Home
</button>
      </div>
    </div>
  );
}

export default Profile;
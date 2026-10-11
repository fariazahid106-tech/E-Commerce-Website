import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Store,
  LogOut,
  Monitor,
} from "lucide-react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useEffect, useState } from "react";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState([]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    const unsubscribeUsers = onSnapshot(
      collection(db, "users"),
      (snapshot) => {
        const usersList = snapshot.docs.map((item) => ({
          id: item.id,
          ...item.data(),
        }));

        setRegisteredUsers(usersList);
      },
      (error) => {
        console.error("Users load error:", error);
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeUsers();
    };
  }, []);

  async function handleLogout() {
    try {
      await signOut(auth);
      navigate("/admin-login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  const linkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 transition ${
      isActive
        ? "bg-violet-600 text-white"
        : "text-gray-400 hover:bg-white/5 hover:text-white"
    }`;

  return (
    <div className="min-h-screen bg-[#09090f] text-white md:flex">
      {/* Sidebar */}
      <aside className="w-full border-b border-white/10 bg-[#11111b] p-5 md:min-h-screen md:w-72 md:border-b-0 md:border-r">
        <h1 className="mb-6 flex items-center gap-2 text-xl font-bold">
          <LayoutDashboard className="text-violet-400" />
          Admin Panel
        </h1>

        {user && (
          <div className="mb-6 rounded-xl bg-white/5 p-3 text-sm">
            <p className="text-gray-400">Admin Account</p>
            <p className="truncate font-medium">{user.email}</p>
          </div>
        )}

        <nav className="space-y-2">
          <NavLink end to="/admin" className={linkStyle}>
            <LayoutDashboard size={19} />
            Dashboard
          </NavLink>

          <NavLink to="/admin/products" className={linkStyle}>
            <Package size={19} />
            All Products
          </NavLink>

          <NavLink to="/admin/products/create" className={linkStyle}>
            <PlusCircle size={19} />
            Add Product
          </NavLink>

          <NavLink to="/website" className={linkStyle}>
            <Store size={19} />
            View Website
          </NavLink>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-gray-400 hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut size={19} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex min-w-0 flex-1 flex-col p-5 sm:p-8">
        <div className="flex-1">
          <Outlet />
        </div>

        {/* Users section at the bottom */}
        <section className="mt-10 border-t border-white/10 pt-6">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Monitor size={20} className="text-violet-400" />
            Registered Users ({registeredUsers.length})
          </h2>

          {registeredUsers.length === 0 ? (
            <p className="text-sm text-gray-400">
              Koi registered user nahi mila.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {registeredUsers.map((registeredUser) => (
                <div
                  key={registeredUser.id}
                  className="rounded-xl border border-white/10 bg-[#11111b] p-4"
                >
                  <p className="truncate font-medium">
                    {registeredUser.email || "Email not found"}
                  </p>
                  <p className="mt-1 text-sm text-gray-400">
                    {registeredUser.name || "User"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

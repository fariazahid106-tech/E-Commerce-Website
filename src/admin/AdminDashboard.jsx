import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, "activeUsers"),
      orderBy("loginTime", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(list);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="mt-2 text-gray-400">Welcome to your store admin panel.</p>

      <div className="mt-10">
        <h2 className="mb-4 text-xl font-semibold">
          Logged In Users ({users.length})
        </h2>

        {loading ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
            Loading...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-white/5 p-10 text-center text-gray-400">
            Abhi koi user login nahi hai
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <p className="font-medium text-white truncate">{user.email}</p>
                <p className="mt-1 text-sm text-gray-400">
                  {user.device || "Unknown Device"}
                </p>
                <div className="mt-4">
                  <span className="rounded-full bg-green-500/20 px-3 py-1 text-xs text-green-400">
                    Online
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
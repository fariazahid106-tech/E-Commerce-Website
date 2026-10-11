import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

export default function AdminGuard({ children }) {
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let cancelled = false;

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        if (!cancelled) setStatus("denied");
        return;
      }

      try {
        const adminSnapshot = await getDoc(
          doc(db, "admins", currentUser.uid)
        );

        if (cancelled) return;

        if (
          adminSnapshot.exists() &&
          adminSnapshot.data().role === "admin"
        ) {
          setStatus("allowed");
        } else {
          await signOut(auth);
          if (!cancelled) setStatus("denied");
        }
      } catch (error) {
        console.error(
          "AdminGuard error:",
          error.code,
          error.message
        );

        if (!cancelled) setStatus("error");
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 text-white">
        Checking admin access...
      </div>
    );
  }

  if (status === "denied") {
    return <Navigate to="/admin-login" replace />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 p-5 text-red-400">
        Admin verification failed. Check the browser console.
      </div>
    );
  }

  return children;
}

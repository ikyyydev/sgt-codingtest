import { auth } from "@/common/lib/firebase";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

export const UserButton = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const session = sessionStorage.getItem("user");

  if (!user && !session) {
    router.push("/login");
  }

  const handleLogout = () => {
    auth.signOut();
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <div className="user-button">
      <div className="email">
        <p>{user?.email}</p>
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

"use client";

import { auth } from "@/common/lib/firebase";
import { useRouter } from "next/navigation";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const HeroSection = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const session = sessionStorage.getItem("user");

  if (!user && !session) {
    router.push("/login");
  }
  return (
    <section className="hero">
      <h1>Welcome to the Home Page</h1>
      <p>You are logged in.</p>
    </section>
  );
};

export default HeroSection;

"use client";

import { navlist } from "@/common/constants";
import { auth } from "@/common/lib/firebase";
import Link from "next/link";
import { useAuthState } from "react-firebase-hooks/auth";
import { UserButton } from "./UserButton";

const HeaderNav = () => {
  const [user] = useAuthState(auth);
  return (
    <nav>
      <div className="container">
        <div className="wrapper">
          <div className="logo">
            <h1>Coding Test</h1>
          </div>
          <div className="navlist">
            <ul>
              {navlist.map((item) => {
                return (
                  <Link key={item.name} href={item.path}>
                    <li>{item.name}</li>
                  </Link>
                );
              })}
            </ul>
          </div>
          {!user ? (
            <div className="button">
              <Link href="/login">Login</Link>
            </div>
          ) : (
            <UserButton />
          )}
        </div>
      </div>
    </nav>
  );
};

export default HeaderNav;

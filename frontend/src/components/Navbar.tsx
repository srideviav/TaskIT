"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { Button } from "antd";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-blue-900 text-white">

      {/* Logo */}
      <h1 className="text-xl font-bold">
        TaskIt
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">

        {user ? (
          <>
            <span>Welcome, {user.name}</span>

            <Button
              className="!bg-white !text-black !border-none hover:!bg-gray-200"
              onClick={logout}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Link href="/login">
              <Button className="!bg-white !text-black !border-none hover:!bg-gray-200">
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button className="!bg-white !text-black !border-none hover:!bg-gray-200">
                Register
              </Button>
            </Link>
          </>
        )}

      </div>
    </div>
  );
}
"use client";

import Link from "next/link";
import { useAuth } from "../hooks/useAuth";
import { Button } from "antd";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      backgroundColor: "#0066cc",
      color: "white"
    }}>

      {/* Logo - Left */}
      <h1 style={{
        fontSize: "24px",
        fontWeight: "bold",
        margin: 0,
        color: "white"
      }}>
        TaskIt
      </h1>

      {/* Welcome Message - Center */}
      <div style={{
        flex: 1,
        textAlign: "center",
        color: "white"
      }}>
        {user && (
          <span style={{ color: "white", fontSize: "16px" }}>
            Welcome, {user.name}
          </span>
        )}
      </div>

      {/* Buttons - Right */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "16px"
      }}>
        {user ? (
          <Button
            style={{
              backgroundColor: "white",
              color: "#0066cc",
              border: "none",
              fontWeight: "600"
            }}
            onClick={logout}
          >
            Logout
          </Button>
        ) : (
          <>
            <Link href="/login">
              <Button style={{
                backgroundColor: "white",
                color: "#0066cc",
                border: "none",
                fontWeight: "600"
              }}>
                Login
              </Button>
            </Link>

            <Link href="/register">
              <Button style={{
                backgroundColor: "white",
                color: "#0066cc",
                border: "none",
                fontWeight: "600"
              }}>
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
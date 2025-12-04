"use client";

import Link from "next/link";

type WelcomeBannerProps = {
  displayName: string;
  displayAvatar?: string;
  hasHellraiserNFTs: boolean;
};

export function WelcomeBanner({ displayName, displayAvatar, hasHellraiserNFTs }: WelcomeBannerProps) {
  return (
    <div
      style={{
        backgroundColor: "#2a2a2a",
        borderBottom: "2px solid #333",
        padding: "10px 2rem 6px 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        animation: "slideDown 0.3s ease-out",
      }}
      className="welcome-banner"
    >
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <div
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid #d34836",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#1a1a1a",
            flexShrink: 0,
          }}
        >
          {displayAvatar ? (
            <img
              src={displayAvatar}
              alt="Avatar"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <div style={{ fontSize: "1.5rem" }}>👤</div>
          )}
        </div>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
            Welcome Back{displayName !== "User" ? `, ${displayName}` : ""}!
          </div>
          <div style={{ fontSize: "0.85rem", color: "#999" }}>
            Ready to train your {hasHellraiserNFTs ? "Hellraisers" : "Fighters"}?
          </div>
        </div>
      </div>
      <Link
        href="/profile"
        style={{
          padding: "0.5rem 1rem",
          backgroundColor: "#d34836",
          color: "white",
          borderRadius: "6px",
          textDecoration: "none",
          fontSize: "0.9rem",
          fontWeight: "500",
          transition: "transform 0.2s, opacity 0.2s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.05)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        Edit Profile
      </Link>
    </div>
  );
}


"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUserProfile } from "@/hooks/useUserProfile";
import Image from "next/image";
import Link from "next/link";

export default function ProfilePage() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const { profile, isLoading, updateProfile } = useUserProfile();
  const [username, setUsername] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Redirect if not connected
  useEffect(() => {
    if (!isLoading && !isConnected) {
      router.push("/");
    }
  }, [isConnected, isLoading, router]);

  // Load existing profile data
  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setAvatarPreview(profile.avatar || null);
    }
  }, [profile]);

  // Handle file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSaveMessage("Please select an image file");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    // Validate file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setSaveMessage("Image size must be less than 2MB");
      setTimeout(() => setSaveMessage(null), 3000);
      return;
    }

    setIsUploading(true);

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setAvatarPreview(base64String);
      setIsUploading(false);
    };
    reader.onerror = () => {
      setSaveMessage("Error reading image file");
      setIsUploading(false);
      setTimeout(() => setSaveMessage(null), 3000);
    };
    reader.readAsDataURL(file);
  };

  // Handle save
  const handleSave = async () => {
    if (!isConnected || !address) return;

    setIsSaving(true);
    setSaveMessage(null);

    try {
      const success = updateProfile({
        username: username.trim() || undefined,
        avatar: avatarPreview || undefined,
      });

      if (success) {
        setSaveMessage("Profile saved successfully!");
        setTimeout(() => {
          setSaveMessage(null);
          router.push("/");
        }, 1500);
      } else {
        setSaveMessage("Failed to save profile");
        setTimeout(() => setSaveMessage(null), 3000);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      setSaveMessage("Error saving profile");
      setTimeout(() => setSaveMessage(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle remove avatar
  const handleRemoveAvatar = () => {
    setAvatarPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <main style={{ backgroundColor: "#202020", color: "white", minHeight: "100vh" }}>
        <div className="index_wrapper__epjO8" style={{ padding: "4rem 2rem" }}>
          <div style={{ textAlign: "center" }}>
            <div className="spinner" style={{ margin: "0 auto 1rem" }}></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!isConnected) {
    return null; // Will redirect
  }

  return (
    <main style={{ backgroundColor: "#202020", color: "white", minHeight: "100vh" }}>
      <div className="index_wrapper__epjO8" style={{ padding: "4rem 2rem", maxWidth: "600px", margin: "0 auto" }}>
        <div style={{ marginBottom: "2rem", textAlign: "center" }}>
          <Link href="/" style={{ display: "inline-block", marginBottom: "1rem" }}>
            <Image
              src="/assets/logo.png"
              alt="Fighters Unbound"
              width={120}
              height={120}
              priority
            />
          </Link>
          <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", fontWeight: "bold" }}>
            Profile Settings
          </h1>
          <p style={{ color: "#999", fontSize: "0.9rem" }}>
            Customize your username and avatar
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
          {/* Avatar Section */}
          <div>
            <label style={{ display: "block", marginBottom: "1rem", fontSize: "1.1rem", fontWeight: "500" }}>
              Avatar
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div
                style={{
                  width: "120px",
                  height: "120px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "3px solid #333",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#2a2a2a",
                  position: "relative",
                }}
              >
                {isUploading ? (
                  <div className="spinner" style={{ width: "40px", height: "40px" }}></div>
                ) : avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar preview"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : (
                  <div style={{ fontSize: "3rem" }}>👤</div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  style={{
                    padding: "0.75rem 1.5rem",
                    backgroundColor: "#d34836",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isUploading ? "not-allowed" : "pointer",
                    fontSize: "0.9rem",
                    fontWeight: "500",
                    opacity: isUploading ? 0.6 : 1,
                    transition: "opacity 0.2s",
                  }}
                >
                  {isUploading ? "Uploading..." : "Upload Avatar"}
                </button>
                {avatarPreview && (
                  <button
                    type="button"
                    onClick={handleRemoveAvatar}
                    style={{
                      padding: "0.5rem 1rem",
                      backgroundColor: "transparent",
                      color: "#999",
                      border: "1px solid #444",
                      borderRadius: "6px",
                      cursor: "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    Remove Avatar
                  </button>
                )}
              </div>
            </div>
            <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#999" }}>
              Recommended: Square image, max 2MB
            </p>
          </div>

          {/* Username Section */}
          <div>
            <label
              htmlFor="username"
              style={{ display: "block", marginBottom: "0.75rem", fontSize: "1.1rem", fontWeight: "500" }}
            >
              Username (Optional)
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              maxLength={30}
              style={{
                width: "100%",
                padding: "0.875rem 1rem",
                backgroundColor: "#2a2a2a",
                border: "2px solid #444",
                borderRadius: "8px",
                color: "white",
                fontSize: "1rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#d34836")}
              onBlur={(e) => (e.target.style.borderColor = "#444")}
            />
            <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "#999" }}>
              Leave empty to use wallet address
            </p>
          </div>

          {/* Wallet Address Display */}
          <div>
            <label style={{ display: "block", marginBottom: "0.75rem", fontSize: "1.1rem", fontWeight: "500" }}>
              Wallet Address
            </label>
            <div
              style={{
                padding: "0.875rem 1rem",
                backgroundColor: "#2a2a2a",
                border: "2px solid #444",
                borderRadius: "8px",
                color: "#999",
                fontSize: "0.9rem",
                fontFamily: "monospace",
                wordBreak: "break-all",
              }}
            >
              {address}
            </div>
          </div>

          {/* Save Message */}
          {saveMessage && (
            <div
              style={{
                padding: "1rem",
                borderRadius: "8px",
                backgroundColor: saveMessage.includes("success") ? "#1a4d1a" : "#4d1a1a",
                color: "white",
                textAlign: "center",
                animation: "fadeIn 0.3s ease-in",
              }}
            >
              {saveMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={() => router.push("/")}
              style={{
                flex: 1,
                padding: "1rem",
                backgroundColor: "transparent",
                color: "white",
                border: "2px solid #444",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                transition: "border-color 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#666")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#444")}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              style={{
                flex: 1,
                padding: "1rem",
                backgroundColor: "#d34836",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: isSaving ? "not-allowed" : "pointer",
                fontSize: "1rem",
                fontWeight: "500",
                opacity: isSaving ? 0.6 : 1,
                transition: "opacity 0.2s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!isSaving) {
                  e.currentTarget.style.transform = "scale(1.02)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {isSaving ? "Saving..." : "Save Profile"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .spinner {
          border: 3px solid #333;
          border-top: 3px solid #d34836;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </main>
  );
}


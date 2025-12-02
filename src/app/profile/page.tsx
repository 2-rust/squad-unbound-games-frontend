"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { useUserProfile } from "@/hooks/useUserProfile";
import Image from "next/image";
import Link from "next/link";
import { COLORS, SPACING, BREAKPOINTS, HEADER_HEIGHT, BORDER_RADIUS, TRANSITIONS, FONT_SIZES } from "@/constants/ui";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_USERNAME_LENGTH = 30;

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

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
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
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">
            <div className="spinner" />
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
    <>
      <main className="profile-page">
        <div className="profile-container">
          <div className="profile-header">
            <Link href="/" className="profile-logo-link">
              <Image
                src="/assets/logo.png"
                alt="Fighters Unbound"
                width={150}
                height={150}
                priority
                className="profile-logo"
              />
            </Link>
            <h1 className="profile-title">Profile Settings</h1>
            <p className="profile-subtitle">Customize your username and avatar</p>
          </div>

          <div className="profile-content">
            {/* Avatar Section */}
            <div className="profile-section">
              <div className="avatar-container">
                <div className="avatar-preview">
                  {isUploading ? (
                    <div className="spinner avatar-spinner" />
                  ) : avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="avatar-image"
                    />
                  ) : (
                    <div className="avatar-placeholder">👤</div>
                  )}
                </div>
                <div className="avatar-controls">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="avatar-input"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="btn btn-primary btn-upload"
                  >
                    {isUploading ? "Uploading..." : "Upload Avatar"}
                  </button>
                  {avatarPreview && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="btn btn-secondary btn-remove"
                    >
                      Remove Avatar
                    </button>
                  )}
                </div>
              </div>
              <p className="profile-hint">Recommended: Square image, max 2MB</p>
            </div>

            {/* Username Section */}
            <div className="profile-section">
              <label htmlFor="username" className="profile-label">
                Username (Optional)
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                maxLength={MAX_USERNAME_LENGTH}
                className="profile-input"
              />
              <p className="profile-hint">Leave empty to use wallet address</p>
            </div>

            {/* Wallet Address Display */}
            <div className="profile-section">
              <label className="profile-label">Wallet Address</label>
              <div className="profile-address">
                {address}
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`profile-message ${saveMessage.includes("success") ? "success" : "error"}`}>
                {saveMessage}
              </div>
            )}

            {/* Action Buttons */}
            <div className="profile-actions">
              <button
                type="button"
                onClick={() => router.push("/")}
                className="btn btn-outline btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="btn btn-primary btn-save"
              >
                {isSaving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        .profile-page {
          background-color: ${COLORS.background.primary};
          color: ${COLORS.text.primary};
          min-height: 100vh;
          padding-top: ${HEADER_HEIGHT.desktop}px;
        }

        .profile-container {
          padding: ${SPACING["3xl"]} ${SPACING["2xl"]};
          max-width: 600px;
          margin: 0 auto;
        }

        .profile-loading {
          text-align: center;
        }

        .profile-header {
          margin-bottom: ${SPACING["2xl"]};
          text-align: center;
          display: grid;
          grid-template-columns: 1fr;
          justify-items: center;
        }

        .profile-logo-link {
          justify-self: center;
          margin-bottom: ${SPACING.xl};
        }

        .profile-logo {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
          image-rendering: crisp-edges;
        }

        .profile-title {
          font-size: ${FONT_SIZES["2xl"]};
          margin-bottom: ${SPACING.sm};
          font-weight: bold;
        }

        .profile-subtitle {
          color: ${COLORS.text.secondary};
          font-size: ${FONT_SIZES.base};
        }

        .profile-content {
          display: flex;
          flex-direction: column;
          gap: ${SPACING.xl};
        }

        .profile-section {
          display: flex;
          flex-direction: column;
        }

        .avatar-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: ${SPACING.xl};
          margin-bottom: ${SPACING.md};
        }

        .avatar-preview {
          width: 120px;
          height: 120px;
          border-radius: ${BORDER_RADIUS.full};
          overflow: hidden;
          border: 3px solid ${COLORS.border.default};
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${COLORS.background.secondary};
          position: relative;
          flex-shrink: 0;
        }

        .avatar-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .avatar-placeholder {
          font-size: 3rem;
        }

        .avatar-spinner {
          width: 40px;
          height: 40px;
        }

        .avatar-controls {
          display: flex;
          flex-direction: column;
          gap: ${SPACING.md};
          flex: 1;
        }

        .avatar-input {
          display: none;
        }

        .profile-label {
          display: block;
          margin-bottom: ${SPACING.md};
          font-size: ${FONT_SIZES.lg};
          font-weight: 500;
        }

        .profile-input {
          width: 100%;
          padding: ${SPACING.md} ${SPACING.lg};
          background-color: ${COLORS.background.secondary};
          border: 2px solid ${COLORS.border.light};
          border-radius: ${BORDER_RADIUS.md};
          color: ${COLORS.text.primary};
          font-size: ${FONT_SIZES.md};
          outline: none;
          transition: border-color ${TRANSITIONS.normal};
        }

        .profile-input:focus {
          border-color: ${COLORS.accent.primary};
        }

        .profile-address {
          padding: ${SPACING.md} ${SPACING.lg};
          background-color: ${COLORS.background.secondary};
          border: 2px solid ${COLORS.border.light};
          border-radius: ${BORDER_RADIUS.md};
          color: ${COLORS.text.secondary};
          font-size: ${FONT_SIZES.base};
          font-family: monospace;
          word-break: break-all;
        }

        .profile-hint {
          margin-top: ${SPACING.md};
          font-size: ${FONT_SIZES.sm};
          color: ${COLORS.text.secondary};
        }

        .profile-message {
          padding: ${SPACING.lg};
          border-radius: ${BORDER_RADIUS.md};
          color: ${COLORS.text.primary};
          text-align: center;
          animation: fadeIn ${TRANSITIONS.slow} ease-in;
          margin-top: ${SPACING.sm};
        }

        .profile-message.success {
          background-color: ${COLORS.status.success};
        }

        .profile-message.error {
          background-color: ${COLORS.status.error};
        }

        .profile-actions {
          display: flex;
          gap: ${SPACING.lg};
          margin-top: ${SPACING.sm};
        }

        .btn {
          flex: 1;
          padding: ${SPACING.lg};
          border-radius: ${BORDER_RADIUS.md};
          font-size: ${FONT_SIZES.md};
          font-weight: 500;
          cursor: pointer;
          transition: all ${TRANSITIONS.normal};
          border: none;
        }

        .btn-primary {
          background-color: ${COLORS.accent.primary};
          color: ${COLORS.text.primary};
        }

        .btn-primary:hover:not(:disabled) {
          transform: scale(1.02);
          opacity: 0.9;
        }

        .btn-primary:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .btn-secondary {
          padding: ${SPACING.sm} ${SPACING.lg};
          background-color: transparent;
          color: ${COLORS.text.secondary};
          border: 1px solid ${COLORS.border.light};
          font-size: ${FONT_SIZES.sm};
        }

        .btn-secondary:hover {
          border-color: ${COLORS.border.default};
        }

        .btn-outline {
          background-color: transparent;
          color: ${COLORS.text.primary};
          border: 2px solid ${COLORS.border.light};
        }

        .btn-outline:hover {
          border-color: ${COLORS.border.default};
        }

        .btn-upload {
          padding: ${SPACING.md} ${SPACING.xl};
        }

        .spinner {
          border: 3px solid ${COLORS.border.default};
          border-top: 3px solid ${COLORS.accent.primary};
          border-radius: ${BORDER_RADIUS.full};
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
        }

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

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Mobile Responsive */
        @media (max-width: ${BREAKPOINTS.mobile}) {
          .profile-page {
            padding-top: ${HEADER_HEIGHT.mobile}px;
          }

          .profile-container {
            padding: ${SPACING["2xl"]} ${SPACING.lg};
          }

          .profile-logo {
            width: 120px;
            height: 120px;
          }

          .profile-title {
            font-size: ${FONT_SIZES.xl};
          }

          .avatar-container {
            flex-direction: column;
            align-items: center;
            gap: ${SPACING.lg};
          }

          .avatar-preview {
            width: 100px;
            height: 100px;
          }

          .avatar-controls {
            width: 100%;
          }

          .profile-actions {
            flex-direction: column;
          }

          .btn {
            width: 100%;
          }
        }

        @media (max-width: ${BREAKPOINTS.smallMobile}) {
          .profile-container {
            padding: ${SPACING.xl} ${SPACING.md};
          }

          .profile-logo {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </>
  );
}

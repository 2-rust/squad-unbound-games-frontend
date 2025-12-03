"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";

function AuthorizeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Get the authorization code from Strava OAuth callback
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      // Handle OAuth error
      console.error("Strava OAuth error:", error);
      // Store error state
      localStorage.setItem("strava_oauth_error", error);
      localStorage.removeItem("strava_connected");
      // Redirect back to home
      router.push("/?strava_error=" + encodeURIComponent(error));
      return;
    }

    if (code) {
      // Store the authorization code and connection state
      localStorage.setItem("strava_auth_code", code);
      localStorage.setItem("strava_connected", "true");
      localStorage.setItem("strava_connected_timestamp", Date.now().toString());
      
      // In a real implementation, you would exchange this code for an access token
      // via your backend API. For now, we'll just store the code and redirect.
      console.log("Strava authorization code received:", code);
      
      // Redirect back to home page with success indicator
      router.push("/?strava_connected=true");
    } else {
      // No code received, redirect back to home
      router.push("/");
    }
  }, [searchParams, router]);

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center", 
      minHeight: "100vh",
      backgroundColor: "#202020",
      color: "white"
    }}>
      <div style={{ textAlign: "center" }}>
        <h1>Connecting to Strava...</h1>
        <p>Please wait while we complete the authorization.</p>
      </div>
    </div>
  );
}

export default function AuthorizePage() {
  return (
    <Suspense fallback={
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        minHeight: "100vh",
        backgroundColor: "#202020",
        color: "white"
      }}>
        <div style={{ textAlign: "center" }}>
          <h1>Loading...</h1>
        </div>
      </div>
    }>
      <AuthorizeContent />
    </Suspense>
  );
}


"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import { useState } from "react";

type WelcomeScreenProps = {
  isLoadingHellraiser: boolean;
  hasHellraiserNFTs: boolean;
};

export function WelcomeScreen({ isLoadingHellraiser, hasHellraiserNFTs }: WelcomeScreenProps) {
  const [videoFadeOut, setVideoFadeOut] = useState(false);

  return (
    <main style={{ backgroundColor: "#202020", color: "white", minHeight: "100vh" }}>
      <div className="index_wrapper__epjO8">
        <Image
          src="/assets/logo.png"
          alt="Fighters Unbound logo"
          width={200}
          height={200}
        />
        
        {/* Welcome Video - Center Section */}
        <div className="w-full max-w-4xl mx-auto my-8 rounded-lg overflow-hidden shadow-2xl relative">
          <video
            autoPlay
            loop
            muted
            playsInline
            className={`w-full h-auto transition-opacity duration-500 ${
              videoFadeOut ? "opacity-0" : "opacity-100"
            }`}
            controls
            controlsList="nodownload"
            onTimeUpdate={(e) => {
              const video = e.currentTarget;
              const fadeOutTime = 2; // Start fading 2 seconds before end
              if (video.duration && video.currentTime >= video.duration - fadeOutTime) {
                setVideoFadeOut(true);
              } else if (videoFadeOut && video.currentTime < video.duration - fadeOutTime) {
                setVideoFadeOut(false);
              }
            }}
            onLoadedMetadata={(e) => {
              // Reset fade state when video metadata loads
              setVideoFadeOut(false);
            }}
          >
            <source src="/assets/welcome.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        <ConnectButton.Custom>
          {({
            account: accountFromButton,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && accountFromButton && chain;

            if (!connected) {
              return (
                <button
                  type="button"
                  className="connectbutton_redConnectButton__SrvWE mt-6"
                  onClick={openConnectModal}
                >
                  CONNECT WALLET
                </button>
              );
            }

            return (
              <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
                <button
                  type="button"
                  className="connectbutton_blackConnectButtonSmall__MDYTu"
                  onClick={openChainModal}
                >
                  <span className="mr-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[rgb(72,76,80)]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  {chain?.name ?? "Network"}
                </button>
                <button
                  type="button"
                  className="connectbutton_redConnectButtonSmall__GSJ3j"
                  onClick={openAccountModal}
                >
                  {accountFromButton?.displayName}
                </button>
              </div>
            );
          }}
        </ConnectButton.Custom>
        <p className="index_connect_text__MfK9o">
          Connect your wallet to view your {isLoadingHellraiser ? "NFTs" : hasHellraiserNFTs ? "Hellraisers" : "Fighters"}
        </p>
      </div>
    </main>
  );
}


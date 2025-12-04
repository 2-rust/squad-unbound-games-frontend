"use client";

import type { FighterCard, NumericAttribute } from "@/types";
import { attributeOptions } from "@/data";
import { DEFAULT_ATTRIBUTE_VALUES } from "@/constants";

type StravaConnectionSectionProps = {
  activeFighter: FighterCard;
  numericAttributes: NumericAttribute[];
  isShowingEmptyState: boolean;
  hasHellraiserNFTs: boolean;
  stravaRedirectUri: string;
};

export function StravaConnectionSection({
  activeFighter,
  numericAttributes,
  isShowingEmptyState,
  hasHellraiserNFTs,
  stravaRedirectUri,
}: StravaConnectionSectionProps) {
  if (!activeFighter || isShowingEmptyState || !activeFighter.isOwned) {
    return (
      <section id="third-section" className="strava-connection-section" style={{ margin: 0, padding: 0 }}>
        <div className="fighter-display-wrapper" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
          <span className="fighter-display-error-text" style={{ color: "black" }}>
            Please set your {hasHellraiserNFTs ? "Hellraiser" : "fighter"} first
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="third-section" className="strava-connection-section" style={{ margin: 0, padding: 0 }}>
      <div 
        className="fighter-display-wrapper" 
        style={{ 
          backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat", 
          width: "100%", 
          minHeight: "100vh" 
        }}
      >
        <div className="fighter-display-image-bar-left"></div>
        <div className="fighter-display-background">
          <div className="fighter-display-container">
            <div className="fighter-display-left">
              <img
                alt={activeFighter.name || "Fighter"}
                className="fighter-display-image"
                src={activeFighter.image || "/assets/defaultnft.png"}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.src.includes("defaultnft.png")) {
                    target.src = "/assets/defaultnft.png";
                  }
                }}
              />
              YOUR CHOSEN FIGHTER
            </div>
            <div className="fighter-display-info-container">
              <div className="fighter-display-header">
                <div className="fighter-display-level-circle">{activeFighter.level || "0"}</div>
                <div className="fighter-display-name-container">
                  <div className="fighter-display-name">{activeFighter.name?.toUpperCase() || "UNKNOWN"}</div>
                  <div className="fighter-display-mini-level">Level: {activeFighter.level || "0"}</div>
                </div>
              </div>
              <div className="fighter-display-stats-container">
                {numericAttributes.length > 0 ? (
                  numericAttributes.map((attr, index) => (
                    <div key={index} className="fighter-display-stat">
                      <div className="fighter-display-stat-bar">
                        <div 
                          className="fighter-display-stat-fill" 
                          style={{ width: `${attr.value}%` }}
                        />
                        <span className="fighter-display-stat-name">{attr.name.toLowerCase()}</span>
                      </div>
                      <span className="fighter-display-stat-text">{attr.value}</span>
                    </div>
                  ))
                ) : (
                  attributeOptions.map((attr) => {
                    const value = DEFAULT_ATTRIBUTE_VALUES[attr.id] || 0;
                    return (
                      <div key={attr.id} className="fighter-display-stat">
                        <div className="fighter-display-stat-bar">
                          <div 
                            className="fighter-display-stat-fill" 
                            style={{ width: `${value}%` }}
                          />
                          <span className="fighter-display-stat-name">{attr.title.toLowerCase()}</span>
                        </div>
                        <span className="fighter-display-stat-text">{value}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="strava-container">
            <div className="strava-info">
              Step 2.Connect with Strava to start training (Check Both Boxes ✅)
            </div>
            <a
              href={`https://www.strava.com/oauth/authorize?client_id=151081&response_type=code&redirect_uri=${encodeURIComponent(stravaRedirectUri)}&approval_prompt=force&scope=read,activity:read_all`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="strava-connect-button"
                alt="Connect with Strava"
                src="/assets/btn_strava_connect_with_orange_x2.png"
              />
            </a>
          </div>
          <div className="fighter-display-square-text">
            Strava linked to @dillon_marszalek! You&apos;re ready for training
          </div>
        </div>
        <div className="fighter-display-image-bar-right"></div>
      </div>
    </section>
  );
}


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
      <section id="third-section" className="index_wrapper3__A9vvd" style={{ margin: 0, padding: 0 }}>
        <div className="fighterdisplay_wrapper__q5JIV" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
          <span className="fighterdisplay_error_text__3Oc7Y" style={{ color: "black" }}>
            Please set your {hasHellraiserNFTs ? "Hellraiser" : "fighter"} first
          </span>
        </div>
      </section>
    );
  }

  return (
    <section id="third-section" className="index_wrapper3__A9vvd" style={{ margin: 0, padding: 0 }}>
      <div 
        className="fighterdisplay_wrapper__q5JIV" 
        style={{ 
          backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, 
          backgroundSize: "cover", 
          backgroundPosition: "center", 
          backgroundRepeat: "no-repeat", 
          width: "100%", 
          minHeight: "100vh" 
        }}
      >
        <div className="fighterdisplay_imageBarLeft__ECvHX"></div>
        <div className="fighterdisplay_background__tOjhW">
          <div className="fighterdisplay_container__rLuu4">
            <div className="fighterdisplay_left__d1S_v">
              <img
                alt={activeFighter.name || "Fighter"}
                className="fighterdisplay_image__bwaQS"
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
            <div className="fighterdisplay_infoContainer__QH0Nt">
              <div className="fighterdisplay_header__J7q6o">
                <div className="fighterdisplay_levelCircle__WymYf">{activeFighter.level || "0"}</div>
                <div className="fighterdisplay_nameContainer__Eestk">
                  <div className="fighterdisplay_name__fmw1j">{activeFighter.name?.toUpperCase() || "UNKNOWN"}</div>
                  <div className="fighterdisplay_miniLevel__dSxVK">Level: {activeFighter.level || "0"}</div>
                </div>
              </div>
              <div className="fighterdisplay_statsContainer__CTHxE">
                {numericAttributes.length > 0 ? (
                  numericAttributes.map((attr, index) => (
                    <div key={index} className="fighterdisplay_stat__ntomZ">
                      <div className="fighterdisplay_statBar__oHh4v">
                        <div 
                          className="fighterdisplay_statFill__chn8I" 
                          style={{ width: `${attr.value}%` }}
                        />
                        <span className="fighterdisplay_statName__VE87k">{attr.name.toLowerCase()}</span>
                      </div>
                      <span className="fighterdisplay_statText__9cAK1">{attr.value}</span>
                    </div>
                  ))
                ) : (
                  attributeOptions.map((attr) => {
                    const value = DEFAULT_ATTRIBUTE_VALUES[attr.id] || 0;
                    return (
                      <div key={attr.id} className="fighterdisplay_stat__ntomZ">
                        <div className="fighterdisplay_statBar__oHh4v">
                          <div 
                            className="fighterdisplay_statFill__chn8I" 
                            style={{ width: `${value}%` }}
                          />
                          <span className="fighterdisplay_statName__VE87k">{attr.title.toLowerCase()}</span>
                        </div>
                        <span className="fighterdisplay_statText__9cAK1">{value}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
          <div className="strava_container__qvP8U">
            <div className="strava_info__4tOFg">
              Step 2.Connect with Strava to start training (Check Both Boxes ✅)
            </div>
            <a
              href={`https://www.strava.com/oauth/authorize?client_id=151081&response_type=code&redirect_uri=${encodeURIComponent(stravaRedirectUri)}&approval_prompt=force&scope=read,activity:read_all`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                className="strava_connectButton__LTkhf"
                alt="Connect with Strava"
                src="/assets/btn_strava_connect_with_orange_x2.png"
              />
            </a>
          </div>
          <div className="fighterdisplay_squaretext__xkfDf">
            Strava linked to @dillon_marszalek! You&apos;re ready for training
          </div>
        </div>
        <div className="fighterdisplay_imageBarRight__h36Ad"></div>
      </div>
    </section>
  );
}


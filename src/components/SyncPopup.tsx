"use client";

import type { FighterCard, SyncResult, NumericAttribute } from "@/types";
import { attributeOptions } from "@/data";

type SyncPopupProps = {
  show: boolean;
  syncResult: SyncResult | null;
  activeFighter: FighterCard;
  numericAttributes: NumericAttribute[];
  selectedAttribute: string;
  onClose: () => void;
};

export function SyncPopup({
  show,
  syncResult,
  activeFighter,
  numericAttributes,
  selectedAttribute,
  onClose,
}: SyncPopupProps) {
  if (!show || !syncResult) return null;

  const selectedAttr = attributeOptions.find(a => a.id === selectedAttribute);
  const currentAttr = numericAttributes.find(a => a.name.toLowerCase() === selectedAttribute.toLowerCase());
  const currentValue = currentAttr?.value || 85;
  const emoji = selectedAttr?.emoji || "🔋";
  const attrName = selectedAttr?.title || "Endurance";

  return (
    <div className="training_popup2_overlay__aTZaR">
      <div className="training_popup2_popup__ySQBi">
        <h2 className="training_popup2_title__sHkW2">
          Synced! No new activity detected
        </h2>
        
        <div className="training_popup2_fighter__VqV3O">
          <img 
            alt={activeFighter.name || "Fighter"} 
            className="training_popup2_image__f_4Oz" 
            src={activeFighter.image || "/assets/defaultnft.png"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("defaultnft.png")) {
                target.src = "/assets/defaultnft.png";
              }
            }}
          />
          <div className="training_popup2_nameContainer__ByiCj">
            <div className="training_popup2_name__GZbQm">
              {activeFighter.name?.toUpperCase() || "UNKNOWN"}
            </div>
          </div>
        </div>
      
        <p className="training_popup2_subtitle__DMb9E">Trainable Skill</p>
        
        <div className="training_popup2_progressBarContainer__u21vO">
          <div className="training_popup2_progressBar__IiPqH">
            <div 
              className="training_popup2_lastEndurance__5uSX_" 
              style={{ width: `${currentValue}%` }}
            >
              {emoji} {attrName} : {currentValue} (+ {syncResult.enduranceDelta})
            </div>
            <div 
              className="training_popup2_enduranceDelta__nzK8A" 
              style={{ width: `${syncResult.enduranceDelta}%` }}
            />
            <div 
              className="training_popup2_maxMarker__bEW3q" 
              style={{ left: "100%" }}
            />
          </div>
        </div>
        
        <p className="training_popup2_subtitle__DMb9E">Last Session</p>
        
        <ul className="training_popup2_statsList__BIlFW">
          <li>
            Endurance:
            <span className="training_greentext__mRZOS">+ {syncResult.enduranceDelta}</span>
          </li>
          <li>
            Distance:
            <span className="training_greentext__mRZOS">+ {syncResult.distance.toFixed(1)} km</span>
          </li>
          <li>
            Level:
            <span className="training_greentext__mRZOS">+ {syncResult.levelDelta}</span>
          </li>
        </ul>
        
        <div className="training_shareButtonList__xScJ7">
          <button 
            className="training_shareButton__7aUVX training_twitter_icon__adOYY"
            onClick={() => {
              const fighterName = activeFighter.name?.toUpperCase() || "FIGHTER";
              const distance = syncResult.distance.toFixed(1);
              const endurance = syncResult.enduranceDelta >= 0 ? `+${syncResult.enduranceDelta}` : `${syncResult.enduranceDelta}`;
              const text = `I've just upgraded my fighter : ${fighterName}\nDistance: ${distance} km 🥇\nEndurance: ${endurance} 🔋\nGet your Unbound Fighters Here https://www.unbound.games/`;
              const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
          />
          <button 
            className="training_shareButton__7aUVX training_wrapcast_icon__FNYq_"
            onClick={() => {
              const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
              const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
          />
          <button 
            className="training_shareButton__7aUVX training_telegram_icon__aO2RH"
            onClick={() => {
              const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
              const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
          />
        </div>
        
        <button 
          className="training_closeButton__e_l3I" 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}


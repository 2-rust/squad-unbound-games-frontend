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
    <div className="sync-popup-overlay">
      <div className="sync-popup">
        <h2 className="sync-popup-title">
          Synced! No new activity detected
        </h2>
        
        <div className="sync-popup-fighter">
          <img 
            alt={activeFighter.name || "Fighter"} 
            className="sync-popup-image" 
            src={activeFighter.image || "/assets/defaultnft.png"}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (!target.src.includes("defaultnft.png")) {
                target.src = "/assets/defaultnft.png";
              }
            }}
          />
          <div className="sync-popup-name-container">
            <div className="sync-popup-name">
              {activeFighter.name?.toUpperCase() || "UNKNOWN"}
            </div>
          </div>
        </div>
      
        <p className="sync-popup-subtitle">Trainable Skill</p>
        
        <div className="sync-popup-progress-bar-container">
          <div className="sync-popup-progress-bar">
            <div 
              className="sync-popup-last-endurance" 
              style={{ width: `${currentValue}%` }}
            >
              {emoji} {attrName} : {currentValue} (+ {syncResult.enduranceDelta})
            </div>
            <div 
              className="sync-popup-endurance-delta" 
              style={{ width: `${syncResult.enduranceDelta}%` }}
            />
            <div 
              className="sync-popup-max-marker" 
              style={{ left: "100%" }}
            />
          </div>
        </div>
        
        <p className="sync-popup-subtitle">Last Session</p>
        
        <ul className="sync-popup-stats-list">
          <li>
            Endurance:
            <span className="sync-popup-green-text">+ {syncResult.enduranceDelta}</span>
          </li>
          <li>
            Distance:
            <span className="sync-popup-green-text">+ {syncResult.distance.toFixed(1)} km</span>
          </li>
          <li>
            Level:
            <span className="sync-popup-green-text">+ {syncResult.levelDelta}</span>
          </li>
        </ul>
        
        <div className="sync-popup-share-button-list">
          <button 
            className="sync-popup-share-button sync-popup-share-button--twitter"
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
            className="sync-popup-share-button sync-popup-share-button--wrapcast"
            onClick={() => {
              const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
              const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
          />
          <button 
            className="sync-popup-share-button sync-popup-share-button--telegram"
            onClick={() => {
              const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
              const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
              window.open(url, "_blank");
            }}
          />
        </div>
        
        <button 
          className="sync-popup-close-button" 
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}


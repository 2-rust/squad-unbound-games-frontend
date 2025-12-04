"use client";

/**
 * Leaderboard Page
 * Displays rankings for fighters, trainers, and activity
 */

import { useMemo, useState, useEffect } from "react";
import { HELLRAISER_NFT_CONTRACT } from "@/config/nft-config";
import type { FighterRow, TrainerRow, ActivityRow, LeaderboardViewTab, TimeFilter } from "@/types/leaderboard";
import {
  LEADERBOARD_VIEW_TABS,
  TIME_FILTERS,
  FIGHTER_TABLE_HEADERS,
  TRAINER_TABLE_HEADERS,
  ACTIVITY_TABLE_HEADERS,
  LOADING_DELAY_MS,
  TRANSITION_DELAY_MS,
  DEFAULT_NFT_IMAGE,
  LOADING_MESSAGE,
  TOTAL_DISTANCE_TOOLTIP,
  MAIN_BACKGROUND_COLOR,
  MAIN_TEXT_COLOR,
  TABS_CONTAINER_STYLE,
  LINK_CONTAINER_STYLE,
  LINK_CONTAINER_WITH_MARGIN_STYLE,
} from "@/constants/leaderboard";
import {
  rotate,
  createTimeFilteredData,
  getFighterImage,
  getFighterName,
  formatRankDisplay,
  isPositiveDelta,
} from "@/utils/leaderboard";
import { getOpenSeaUrl } from "@/utils/nft-urls";
import {
  ImageWithFallback,
  ProfileDisplay,
  AttributeWithDelta,
  PodiumItem,
  NFTLinks,
} from "@/components/leaderboard";
import { fighterBase, trainerBase, activityBase } from "@/data/leaderboard";

// ============================================
// Constants
// ============================================

/** Contract address for NFT links */
const NFT_CONTRACT_ADDRESS = HELLRAISER_NFT_CONTRACT;

// ============================================
// Data Processing
// ============================================

/** Create time-filtered data for fighters */
const fighterData = createTimeFilteredData(fighterBase, TIME_FILTERS);

/** Create time-filtered data for trainers */
const trainerData = createTimeFilteredData(trainerBase, TIME_FILTERS);

/** Create time-filtered data for activity */
const activityData = createTimeFilteredData(activityBase, TIME_FILTERS);

// ============================================
// Component
// ============================================

export default function LeaderboardPage() {
  // ============================================
  // State
  // ============================================
  
  const [activeView, setActiveView] = useState<LeaderboardViewTab>("Fighter Rank");
  const [activeTime, setActiveTime] = useState<TimeFilter>("Total");
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // ============================================
  // Effects
  // ============================================

  /** Simulate loading state on mount */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  // ============================================
  // Handlers
  // ============================================

  /** Handle view change with transition */
  const handleViewChange = (view: LeaderboardViewTab) => {
    if (view !== activeView) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveView(view);
        setIsTransitioning(false);
      }, TRANSITION_DELAY_MS);
    }
  };

  /** Handle time filter change with transition */
  const handleTimeChange = (time: TimeFilter) => {
    if (time !== activeTime) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTime(time);
        setIsTransitioning(false);
      }, TRANSITION_DELAY_MS);
    }
  };

  // ============================================
  // Computed Values
  // ============================================

  /** Get table configuration based on active view */
  const tableConfig = useMemo(() => {
    if (activeView === "Fighter Rank") {
      return {
        headers: FIGHTER_TABLE_HEADERS,
        rows: fighterData[activeTime],
      };
    }
    if (activeView === "Trainer Rank") {
      return {
        headers: TRAINER_TABLE_HEADERS,
        rows: trainerData[activeTime],
      };
    }
    if (activeView === "Activity") {
      return {
        headers: ACTIVITY_TABLE_HEADERS,
        rows: activityData[activeTime],
      };
    }
    return {
      headers: [],
      rows: [],
    };
  }, [activeView, activeTime]);

  return (
    <main 
      className="leaderboard-main-wrapper" 
      style={{ backgroundColor: MAIN_BACKGROUND_COLOR, color: MAIN_TEXT_COLOR }}
    >
      <div className="leaderboard-container">
        {isLoading ? (
          <div className="leaderboard-loading-container">
            <div className="leaderboard-loading-spinner"></div>
            <p className="leaderboard-loading-text">{LOADING_MESSAGE}</p>
          </div>
        ) : (
          <>
            <div className="leaderboard-tabs" style={TABS_CONTAINER_STYLE}>
              {LEADERBOARD_VIEW_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleViewChange(tab)}
                  className={`leaderboard-tab ${
                    activeView === tab ? "leaderboard-tab--active" : ""
                  }`}
                  aria-pressed={activeView === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="leaderboard-filter">
              <div className="leaderboard-duration-buttons">
                {TIME_FILTERS.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleTimeChange(filter)}
                    className={`leaderboard-duration-button ${
                      activeTime === filter ? "leaderboard-duration-button--active" : ""
                    }`}
                    aria-pressed={activeTime === filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            {/* Podium Section - Top 3 Fighters */}
            {activeView === "Fighter Rank" && (() => {
              const currentFighters = fighterData[activeTime];
              const top3 = currentFighters.slice(0, 3);
              const [first, second, third] = top3;
              
              return (
                <div className="leaderboard-podium">
                  <PodiumItem fighter={second} rank={2} className="leaderboard-podium-item--second" />
                  <PodiumItem fighter={first} rank={1} className="leaderboard-podium-item--first" />
                  <PodiumItem fighter={third} rank={3} className="leaderboard-podium-item--third" />
                </div>
              );
            })()}
      <div className={`leaderboard-content ${isTransitioning ? "leaderboard-fade-transition" : ""}`}>
        
        <table className="leaderboard-table">
          <thead>
            <tr>
              {tableConfig.headers.map((header) => (
                <th key={header}>
                  {header === "Total Distance" ? (
                    <>
                      Total Distance
                      <span className="leaderboard-tooltip">
                        <span className="leaderboard-tooltip-icon">?</span>
                        <span className="leaderboard-tooltip-text">
                          {TOTAL_DISTANCE_TOOLTIP}
                        </span>
                      </span>
                    </>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeView === "Fighter Rank" &&
              (tableConfig.rows as FighterRow[]).map((row) => {
                const openseaUrl = getOpenSeaUrl(NFT_CONTRACT_ADDRESS, row.tokenId);
                
                return (
                  <tr key={`${row.tokenId}-${activeTime}`}>
                    <td className="leaderboard-rank" data-label="Rank">{row.rank}</td>
                    <td data-label="">
                      <a
                        href={openseaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={LINK_CONTAINER_STYLE}
                      >
                        <ImageWithFallback
                          alt={`${row.name} ${row.tokenId}`}
                          className="leaderboard-fighter-image"
                          src={row.image || DEFAULT_NFT_IMAGE}
                        />
                      </a>
                    </td>
                    <td data-label="Token ID">{row.tokenId}</td>
                    <td data-label="Fighter Name">{row.name}</td>
                    <AttributeWithDelta value={row.endurance} delta={row.enduranceDelta} dataLabel="Endurance" />
                    <AttributeWithDelta value={row.agility} delta={row.agilityDelta} dataLabel="Agility" />
                    <AttributeWithDelta value={row.mental} delta={row.mentalDelta} dataLabel="Mental" />
                    <AttributeWithDelta value={row.leadership} delta={row.leadershipDelta} dataLabel="Leadership" />
                    <td data-label="Distance">{row.distance}</td>
                    <NFTLinks tokenId={row.tokenId} contractAddress={NFT_CONTRACT_ADDRESS} />
                  </tr>
                );
              })}
            {activeView === "Trainer Rank" &&
              (tableConfig.rows as TrainerRow[]).map((row) => {
                return (
                  <tr key={`${row.trainer}-${activeTime}`}>
                    <td data-label="Rank">{formatRankDisplay(row.rank)}</td>
                    <td className="leaderboard-trainer-address" data-label="Trainer">
                      <ProfileDisplay
                        walletAddress={row.trainer}
                      />
                    </td>
                    <td className="leaderboard-total-progress" data-label="Total Progress">{row.totalProgress}</td>
                    <td data-label="Endurance">{row.endurance}</td>
                    <td data-label="Agility">{row.agility}</td>
                    <td data-label="Mental">{row.mental}</td>
                    <td data-label="Leadership">{row.leadership}</td>
                    <td data-label="Distance">{row.distance}</td>
                    <td data-label="Fighters Trained">{row.fightersTrained}</td>
                  </tr>
                );
              })}
            {activeView === "Activity" &&
              (tableConfig.rows as ActivityRow[]).map((row) => {
                return (
                  <tr key={`${row.walletAddress}-${activeTime}`}>
                    <td data-label="Rank">{formatRankDisplay(row.rank)}</td>
                    <td className="leaderboard-trainer-address" data-label="Wallet Address">
                      <ProfileDisplay
                        walletAddress={row.walletAddress}
                      />
                    </td>
                    <td data-label="Total Distance">{row.totalDistance}</td>
                    <td 
                      data-label="Yoga Sessions" 
                      className={row.yogaSessions > 0 ? "leaderboard-positive-delta" : ""}
                    >
                      {row.yogaSessions}
                    </td>
                    <td 
                      data-label="Meditation Sessions" 
                      className={row.meditationSessions > 0 ? "leaderboard-positive-delta" : ""}
                    >
                      {row.meditationSessions}
                    </td>
                  </tr>
                );
              })}
          </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}


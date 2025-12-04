"use client";

import Image from "next/image";
import type { FighterCard, NumericAttribute, AttributeCard } from "@/types";
import { FighterCarousel } from "./FighterCarousel";
import { AttributeGrid } from "./AttributeGrid";
import { DEFAULT_ATTRIBUTE_VALUES } from "@/constants";
import { attributeOptions } from "@/data";

type FighterSelectionSectionProps = {
  isLoadingHellraiser: boolean;
  hellraiserBalance: number;
  ownedCount: number;
  hasHellraiserNFTs: boolean;
  availableCards: FighterCard[];
  activeCardIndex: number;
  onCarouselNavigate: (direction: "next" | "prev") => void;
  activeFighter: FighterCard;
  numericAttributes: NumericAttribute[];
  isShowingEmptyState: boolean;
  selectionMessage: string | null;
  confirmDisabled: boolean;
  onConfirm: () => void;
};

export function FighterSelectionSection({
  isLoadingHellraiser,
  hellraiserBalance,
  ownedCount,
  hasHellraiserNFTs,
  availableCards,
  activeCardIndex,
  onCarouselNavigate,
  activeFighter,
  numericAttributes,
  isShowingEmptyState,
  selectionMessage,
  confirmDisabled,
  onConfirm,
}: FighterSelectionSectionProps) {
  return (
    <section id="first-section" className="fighter-selection-section">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
        <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
          <Image 
            width={200} 
            height={200} 
            src="/assets/logo.png" 
            alt={hasHellraiserNFTs ? "Hellraiser NFT" : "Fighters Unbound logo"} 
          />
        </div>
        {isLoadingHellraiser ? (
          <div className="fighter-selection-count-text">Loading NFTs...</div>
        ) : (
          <>
            <div className="fighter-selection-count-text">
              {hellraiserBalance > 0 ? (
                `You own ${hellraiserBalance} Fighters `
              ) : (
                hasHellraiserNFTs ? (
                  <>
                    {ownedCount > 0 ? `You own ${ownedCount} Hellraiser${ownedCount === 1 ? "" : "s"}` : "Hellraiser NFT"}
                  </>
                ) : (
                  `You own ${ownedCount} Fighters `
                )
              )}
            </div>
            <div className="fighter-selection-progress-text">
              {hellraiserBalance > 0 ? (
                `Full Set Progress : ${hellraiserBalance} / 52 `
              ) : (
                hasHellraiserNFTs ? (
                  `Hellraiser Collection: ${ownedCount} owned`
                ) : (
                  `Full Set Progress : ${ownedCount} / 52 `
                )
              )}
            </div>
          </>
        )}
        {!isLoadingHellraiser && (
          <div className="fighter-selection-buy-button">
            <a href="https://mintify.xyz/launchpad/fightersunbound" target="_blank" rel="noopener noreferrer">
              <Image className="fighter-selection-mint-icon" src="/assets/mintify.jpeg" alt="Mintify" width={24} height={24} />
              Buy Fighters
            </a>
          </div>
        )}
        {availableCards.length > 0 && activeFighter && (
          <>
            <FighterCarousel
              cards={availableCards}
              activeIndex={activeCardIndex}
              onNavigate={onCarouselNavigate}
              isShowingEmptyState={isShowingEmptyState}
            />
            {!isShowingEmptyState && (
              numericAttributes.length > 0 ? (
                <AttributeGrid
                  attributes={numericAttributes}
                  attributeOptions={attributeOptions}
                  showProgressBars
                />
              ) : (
                <AttributeGrid
                  attributes={attributeOptions.map(attr => ({
                    name: attr.title,
                    value: DEFAULT_ATTRIBUTE_VALUES[attr.id] || 0,
                  }))}
                  attributeOptions={attributeOptions}
                  showProgressBars
                />
              )
            )}
            <div className="fighter-selection-instruction-text">
              Step 1: Set {isShowingEmptyState ? "" : (activeFighter?.name?.toUpperCase() || (hasHellraiserNFTs ? "HELLRAISER" : "FIGHTER"))} as active fighter, sign message below
            </div>
            {selectionMessage && (
              <div className="fighter-selection-message" style={{ marginBottom: "20px" }}>
                {selectionMessage}
              </div>
            )}
            <form>
              <div>
                <button
                  type="button"
                  onClick={onConfirm}
                  disabled={confirmDisabled}
                  className="fighter-selection-confirm-button"
                >
                  CONFIRM
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </section>
  );
}


"use client";

import type { FighterCard } from "@/types";

type FighterCarouselProps = {
  cards: FighterCard[];
  activeIndex: number;
  onNavigate: (direction: "next" | "prev") => void;
  isShowingEmptyState?: boolean;
};

export function FighterCarousel({ 
  cards, 
  activeIndex, 
  onNavigate, 
  isShowingEmptyState = false 
}: FighterCarouselProps) {
  const activeCard = cards[activeIndex];

  if (!activeCard) return null;

  const isNavigationDisabled = cards.length <= 1;
  const cardClasses = [
    "fighter-carousel-card",
    "fighter-carousel-card--active",
    isShowingEmptyState && "fighter-carousel-card--blurred"
  ].filter(Boolean).join(" ");
  
  const imageClasses = [
    "fighter-carousel-card__image",
    isShowingEmptyState && "fighter-carousel-card--blurred"
  ].filter(Boolean).join(" ");

  return (
    <div className="fighter-carousel-container">
      <div className="fighter-carousel-wrapper">
        <button
          type="button"
          className="fighter-carousel-nav-button"
          onClick={() => onNavigate("prev")}
          aria-label="Previous fighter"
          disabled={isNavigationDisabled}
        >
          ❮
        </button>
        <div className="fighter-carousel-cards">
          <div className={cardClasses}>
            <img
              className={imageClasses}
              alt="NFT"
              src={activeCard.image || "/assets/defaultnft.png"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("defaultnft.png")) {
                  target.src = "/assets/defaultnft.png";
                }
              }}
            />
            <div className="fighter-carousel-card__name">
              {activeCard.name || "Unknown"}
            </div>
            <div className="fighter-carousel-card__creator">
              {activeCard.creator || "Unknown"}
            </div>
            <div className="fighter-carousel-card__info">
              <span># {isShowingEmptyState ? "" : (activeCard.id?.replace("#", "") || "000")}</span>
              <span>Lv {isShowingEmptyState ? "" : (activeCard.level || "0")}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="fighter-carousel-nav-button"
          onClick={() => onNavigate("next")}
          aria-label="Next fighter"
          disabled={isNavigationDisabled}
        >
          ❯
        </button>
      </div>
    </div>
  );
}


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
  const activeCard = cards[activeIndex] || cards[0];

  if (!activeCard) return null;

  return (
    <div className="carousel_carouselContainer__kIQw9">
      <div className="carousel_carousel__PxPRp">
        <button
          type="button"
          className="carousel_arrow__HHMhv"
          onClick={() => onNavigate("prev")}
          aria-label="Previous fighter"
          disabled={cards.length <= 1}
        >
          ❮
        </button>
        <div className="carousel_cards__pPGpU">
          <div className={`carousel_card__AIxvR carousel_active__w_ftY ${isShowingEmptyState ? "carousel_blurred___7NQ3" : ""}`}>
            <img
              className={`carousel_nftimage__9S5Yc ${isShowingEmptyState ? "carousel_blurred___7NQ3" : ""}`}
              alt="NFT"
              src={activeCard.image || "/assets/defaultnft.png"}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.src.includes("defaultnft.png")) {
                  target.src = "/assets/defaultnft.png";
                }
              }}
            />
            <div className="carousel_nftname__Ayk6W">{activeCard.name || "Unknown"}</div>
            <div className="carousel_nftcreator__oJPL7">
              {activeCard.creator || "Unknown"}
            </div>
            <div className="carousel_info__PnV4W">
              <span># {isShowingEmptyState ? "" : (activeCard.id?.replace("#", "") || "000")}</span>
              <span>Lv {isShowingEmptyState ? "" : (activeCard.level || "0")}</span>
            </div>
          </div>
        </div>
        <button
          type="button"
          className="carousel_arrow__HHMhv"
          onClick={() => onNavigate("next")}
          aria-label="Next fighter"
          disabled={cards.length <= 1}
        >
          ❯
        </button>
      </div>
    </div>
  );
}


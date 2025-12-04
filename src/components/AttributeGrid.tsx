"use client";

import type { AttributeCard, NumericAttribute } from "@/types";

type AttributeGridProps = {
  attributes: NumericAttribute[];
  attributeOptions: AttributeCard[];
  showProgressBars?: boolean;
  className?: string;
};

export function AttributeGrid({ 
  attributes, 
  attributeOptions, 
  showProgressBars = false,
  className = ""
}: AttributeGridProps) {
  if (showProgressBars) {
    return (
      <div className={`carousel_attributesGrid__H19vs ${className}`}>
        {attributes.map((attr, index) => (
          <div key={index} className="carousel_attributeRow__XoXwZ">
            <span className="carousel_attributeName__OZ9_Y">
              {attr.name.toLowerCase()}: {attr.value} 
            </span>
            <div className="carousel_progressBar__WWysV">
              <div 
                className="carousel_progress__0SBp_" 
                style={{ width: `${attr.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`attributeselect_attributesGrid__lwVep ${className}`}>
      {attributeOptions.map((attribute) => (
        <div
          key={attribute.id}
          className="attributeselect_attributeCard__qYQrc"
        >
          <div className="attributeselect_attributeEmoji__UR7UH">
            {attribute.emoji}
          </div>
          <div className="attributeselect_attributeName__QitHW">
            {attribute.title}
          </div>
          <div className="attributeselect_attributeDescription__H8yAt">
            {attribute.description}
          </div>
          <div className="attributeselect_attributeStatus__1_Ygw">
            {attribute.status}
          </div>
        </div>
      ))}
    </div>
  );
}


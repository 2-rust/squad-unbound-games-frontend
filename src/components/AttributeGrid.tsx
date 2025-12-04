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
      <div className={`fighter-attribute-grid ${className}`}>
        {attributes.map((attr, index) => (
          <div key={index} className="fighter-attribute-row">
            <span className="fighter-attribute-name">
              {attr.name.toLowerCase()}: {attr.value} 
            </span>
            <div className="fighter-attribute-progress-bar">
              <div 
                className="fighter-attribute-progress" 
                style={{ width: `${attr.value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`training-attribute-grid ${className}`}>
      {attributeOptions.map((attribute) => (
        <div
          key={attribute.id}
          className="training-attribute-card"
        >
          <div className="training-attribute-emoji">
            {attribute.emoji}
          </div>
          <div className="training-attribute-name">
            {attribute.title}
          </div>
          <div className="training-attribute-description">
            {attribute.description}
          </div>
          <div className="training-attribute-status">
            {attribute.status}
          </div>
        </div>
      ))}
    </div>
  );
}


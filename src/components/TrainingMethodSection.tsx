"use client";

import Image from "next/image";
import type { TrainingMethod, AttributeCard } from "@/types";
import { trainingMethods, attributeOptions } from "@/data";

type TrainingMethodSectionProps = {
  selectedMethod: string;
  selectedAttribute: string;
  selectedAttributesForCurrentMethod: string[];
  selectionMessage: string | null;
  confirmDisabled: boolean;
  onMethodSelect: (methodId: string) => void;
  onConfirm: () => void;
};

export function TrainingMethodSection({
  selectedMethod,
  selectedAttribute,
  selectedAttributesForCurrentMethod,
  selectionMessage,
  confirmDisabled,
  onMethodSelect,
  onConfirm,
}: TrainingMethodSectionProps) {
  return (
    <section id="second-section" className="training-method-section">
      <div className="training-method-container">
        <Image width={200} height={200} src="/assets/logo.png" alt="Training logo" />
        <h1 className="training-method-title">Select Training Method</h1>
        <p className="training-method-subtitle">
          Please select from the three training options
        </p>
        <div className="training-method-options-container">
          <div className="training-method-options">
            {trainingMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => onMethodSelect(method.id)}
                className={`training-method-option ${
                  selectedMethod === method.id
                    ? "training-method-option--selected"
                    : ""
                }`}
              >
                <span className="training-method-option-icon">
                  {method.icon}
                </span>
                <span className="training-method-option-name">
                  {method.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="training-attribute-grid">
          {attributeOptions.map((attribute) => {
            const isHighlighted = (selectedMethod === "meditation" || selectedMethod === "yoga")
              ? selectedAttributesForCurrentMethod.includes(attribute.id)
              : selectedAttribute === attribute.id;
            
            return (
              <div
                key={attribute.id}
                className={`training-attribute-card ${
                  isHighlighted
                    ? "training-attribute-card--highlighted"
                    : ""
                }`}
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
            );
          })}
        </div>
        {selectionMessage && (
          <div className="training-method-message" style={{ marginBottom: "20px" }}>
            {selectionMessage}
          </div>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="training-method-confirm-button"
        >
          Confirm Selection
        </button>
      </div>
    </section>
  );
}


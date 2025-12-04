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
    <section id="second-section" className="index_wrapper2__a74H5">
      <div className="attributeselect_container__rmxCO">
        <Image width={200} height={200} src="/assets/logo.png" alt="Training logo" />
        <h1 className="attributeselect_title__HzU4F">Select Training Method</h1>
        <p className="attributeselect_subtitle__TGHPj">
          Please select from the three training options
        </p>
        <div className="attributeselect_trainingMethodsContainer__FGBUC">
          <div className="attributeselect_trainingMethods__x5qtS">
            {trainingMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => onMethodSelect(method.id)}
                className={`attributeselect_trainingMethod__yi7No ${
                  selectedMethod === method.id
                    ? "attributeselect_selected__8T4DU"
                    : ""
                }`}
              >
                <span className="attributeselect_methodIcon__BtABI">
                  {method.icon}
                </span>
                <span className="attributeselect_methodName__oKmC4">
                  {method.title}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="attributeselect_attributesGrid__lwVep">
          {attributeOptions.map((attribute) => {
            const isHighlighted = (selectedMethod === "meditation" || selectedMethod === "yoga")
              ? selectedAttributesForCurrentMethod.includes(attribute.id)
              : selectedAttribute === attribute.id;
            
            return (
              <div
                key={attribute.id}
                className={`attributeselect_attributeCard__qYQrc ${
                  isHighlighted
                    ? "attributeselect_highlighted__8f7K6"
                    : ""
                }`}
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
            );
          })}
        </div>
        {selectionMessage && (
          <div className="attributeselect_successMessage___Svfu" style={{ marginBottom: "20px" }}>
            {selectionMessage}
          </div>
        )}
        <button
          type="button"
          onClick={onConfirm}
          disabled={confirmDisabled}
          className="attributeselect_confirmButton__WmxNu"
        >
          Confirm Selection
        </button>
      </div>
    </section>
  );
}


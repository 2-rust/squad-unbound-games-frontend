/**
 * NFTLinks Component
 * Displays links to NFT marketplaces (Mintify and OpenSea)
 */

import { ImageWithFallback } from "./ImageWithFallback";
import { getMintifyUrl, getOpenSeaUrl } from "@/utils/nft-urls";
import { MINTIFY_ICON, OPENSEA_ICON, LINK_CONTAINER_STYLE, LINK_CONTAINER_WITH_MARGIN_STYLE } from "@/constants/leaderboard";

type NFTLinksProps = {
  tokenId: string;
  contractAddress: string;
};

export function NFTLinks({ tokenId, contractAddress }: NFTLinksProps) {
  const mintifyUrl = getMintifyUrl(contractAddress, tokenId);
  const openseaUrl = getOpenSeaUrl(contractAddress, tokenId);

  return (
    <td data-label="Buy">
      <a
        href={mintifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={LINK_CONTAINER_WITH_MARGIN_STYLE}
      >
        <ImageWithFallback
          alt="Mintify"
          className="leaderboard-icon-image"
          src={MINTIFY_ICON}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </a>
      <a
        href={openseaUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={LINK_CONTAINER_STYLE}
      >
        <ImageWithFallback
          alt="OpenSea"
          className="leaderboard-icon-image"
          src={OPENSEA_ICON}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
          }}
        />
      </a>
    </td>
  );
}


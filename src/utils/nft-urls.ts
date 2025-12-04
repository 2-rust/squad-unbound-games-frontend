/**
 * NFT URL Utilities
 * Helper functions for generating NFT marketplace URLs
 */

/**
 * Generates Mintify URL for an NFT
 * @param contractAddress - NFT contract address
 * @param tokenId - Token ID
 * @returns Mintify URL
 */
export function getMintifyUrl(contractAddress: string, tokenId: string): string {
  return `https://mintify.xyz/nft/shape/${contractAddress}/${tokenId}`;
}

/**
 * Generates OpenSea URL for an NFT
 * @param contractAddress - NFT contract address
 * @param tokenId - Token ID
 * @returns OpenSea URL
 */
export function getOpenSeaUrl(contractAddress: string, tokenId: string): string {
  return `https://opensea.io/item/shape/${contractAddress}/${tokenId}`;
}


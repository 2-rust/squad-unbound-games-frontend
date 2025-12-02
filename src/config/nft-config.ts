// NFT Contract Configuration
// 
// To enable Hellraiser NFT functionality:
// 1. Set the NEXT_PUBLIC_HELLRAISER_CONTRACT environment variable in your .env.local file
// 2. Example: NEXT_PUBLIC_HELLRAISER_CONTRACT=0x1234567890123456789012345678901234567890
// 3. Set NEXT_PUBLIC_HELLRAISER_CHAIN_ID to specify the chain (default: 1 for Ethereum mainnet)
// 4. The contract must be an ERC721-compatible NFT contract
//
// If the contract address is set and the user owns Hellraiser NFTs, they will be displayed
// with the same functionality as Fighters Unbound (carousel, training, Strava integration, etc.)
export const HELLRAISER_NFT_CONTRACT = process.env.NEXT_PUBLIC_HELLRAISER_CONTRACT || "0xA7FF5e756a61D1Ff01838247025943c6F7Ba2188";
export const HELLRAISER_CHAIN_ID = Number(process.env.NEXT_PUBLIC_HELLRAISER_CHAIN_ID) || 1; // Default to Ethereum mainnet

// ERC721 ABI for balanceOf, ownerOf, totalSupply, and tokenURI
export const ERC721_ABI = [
  {
    inputs: [{ name: "owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "ownerOf",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "index", type: "uint256" },
    ],
    name: "tokenOfOwnerByIndex",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "tokenId", type: "uint256" }],
    name: "tokenURI",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;


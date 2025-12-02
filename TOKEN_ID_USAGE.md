# How to Get Token IDs from Connected Wallet

## Using the `useHellraiserNFTs` Hook

The `useHellraiserNFTs` hook automatically detects and extracts token IDs from the connected wallet.

### Basic Usage

```typescript
import { useHellraiserNFTs } from "@/hooks/useHellraiserNFTs";

function MyComponent() {
  const { 
    tokenIds,        // Array of token ID strings: ["0", "1", "42"]
    rawTokenIds,     // Array of numeric token IDs: [0, 1, 42]
    hellraiserNFTs,  // Full NFT objects with metadata
    balanceCount,    // Number of NFTs in wallet
    hasHellraiserNFTs, // Boolean: true if wallet has NFTs
    isLoading        // Boolean: true while loading
  } = useHellraiserNFTs();

  // Access token IDs
  console.log("Token IDs (strings):", tokenIds);
  console.log("Token IDs (numbers):", rawTokenIds);

  return (
    <div>
      {hasHellraiserNFTs && (
        <div>
          <h3>Your NFTs ({balanceCount})</h3>
          <p>Token IDs: {tokenIds.join(", ")}</p>
          {hellraiserNFTs.map((nft) => (
            <div key={nft.tokenId}>
              <p>{nft.name} - Token ID: {nft.tokenId}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### Example: Get Token IDs in a Component

```typescript
"use client";

import { useHellraiserNFTs } from "@/hooks/useHellraiserNFTs";
import { useAccount } from "wagmi";

export default function NFTDisplay() {
  const { isConnected, address } = useAccount();
  const { tokenIds, rawTokenIds, hellraiserNFTs, balanceCount, isLoading } = useHellraiserNFTs();

  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (isLoading) {
    return <div>Loading NFTs...</div>;
  }

  if (tokenIds.length === 0) {
    return <div>No NFTs found in wallet</div>;
  }

  return (
    <div>
      <h2>Your NFTs</h2>
      <p>Wallet: {address}</p>
      <p>Total NFTs: {balanceCount}</p>
      <p>Token IDs: {tokenIds.join(", ")}</p>
      <p>Numeric Token IDs: {rawTokenIds.join(", ")}</p>
      
      <div>
        {hellraiserNFTs.map((nft) => (
          <div key={nft.tokenId}>
            <h3>{nft.name}</h3>
            <p>Token ID: {nft.tokenId}</p>
            <p>Level: {nft.level}</p>
            <p>Rarity: {nft.rarity}</p>
            <img src={nft.image} alt={nft.name} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| `tokenIds` | `string[]` | Array of token ID strings (e.g., `["0", "1", "42"]`) |
| `rawTokenIds` | `number[]` | Array of numeric token IDs (e.g., `[0, 1, 42]`) |
| `hellraiserNFTs` | `HellraiserNFT[]` | Full NFT objects with all metadata |
| `balanceCount` | `number` | Number of NFTs in the wallet |
| `hasHellraiserNFTs` | `boolean` | `true` if wallet has NFTs |
| `isLoading` | `boolean` | `true` while fetching data |

### How It Works

1. **Wallet Connects** → Hook detects connection
2. **Balance Check** → Checks `balanceOf` on Shape Network
3. **Ownership Check** → Automatically checks token IDs 0-497 to find owned tokens
4. **Token IDs Found** → Extracted and stored in `tokenIds` array
5. **Metadata Fetch** → Automatically fetches metadata for each token ID
6. **Ready to Use** → All data available in hook return values

### Console Logging

The hook automatically logs token IDs to the console:

```
🎫 ========== TOKEN IDs FROM WALLET ==========
✅ Found 1 token ID(s) in connected wallet:
   1. Token ID: 0 (numeric: 0)
📋 All Token IDs: [0]
📋 Numeric Token IDs: [0]
==========================================

💰 ========== WALLET NFT SUMMARY ==========
👛 Wallet Address: 0x...
📊 Total NFTs in Wallet: 1
🎫 Token IDs Found: 1
📋 Token ID List: ["0"]
📋 Numeric Token IDs: [0]
✅ NFTs Ready: 1
==========================================
```

### Accessing Token IDs in Current Implementation

In `web/src/app/page.tsx`, token IDs are already being accessed:

```typescript
const { 
  hellraiserNFTs, 
  balanceCount: hellraiserBalance, 
  hasHellraiserNFTs, 
  isLoading: isLoadingHellraiser, 
  tokenIds  // ← Token IDs are here!
} = useHellraiserNFTs();

// Use tokenIds anywhere in your component
console.log("Token IDs:", tokenIds);
```

### Notes

- Token IDs are automatically extracted when the wallet is connected
- The hook checks tokens 0-497 to find owned tokens
- Token IDs are available as both strings and numbers for convenience
- All token IDs are logged to the console for debugging


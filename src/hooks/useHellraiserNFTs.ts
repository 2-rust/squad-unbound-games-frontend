"use client";

import { useAccount, useReadContract, useReadContracts } from "wagmi";
import { useMemo, useEffect, useState } from "react";
import { HELLRAISER_NFT_CONTRACT, ERC721_ABI } from "@/config/nft-config";
import { shapeNetwork } from "@/config/shape-network";
import { fetchNFTMetadata, extractNFTDisplayData, NFTMetadata } from "@/utils/nft-metadata";
import { convertIPFSToHTTP } from "@/utils/nft-metadata";

// API Response Types - getFighterByOwner returns an array
type APIFighterResponse = {
  tokenId: number;
  name: string;
  image: string;
  creator: string;
  description: string;
  attributes: {
    level: number;
    punch: number;
    endurance: number;
    speed: number;
    defense: number;
    technique: number;
    mental_strength: number;
    intelligence: number;
    charisma: number;
    stealth: number;
    leadership: number;
    agility: number;
    luck: number;
    serial_number: number;
    mileage_km?: number;
  };
};

// Fetch fighters data from API using getFighterByOwner endpoint
async function fetchFightersFromAPI(walletAddress: string): Promise<APIFighterResponse[]> {
  try {
    const response = await fetch(
      `https://api.unboundgames.xyz/getFighterByOwner?owner=${walletAddress}`
    );
    
    if (!response.ok) {
      console.warn(`API request failed with status ${response.status}`);
      return [];
    }
    
    const data: APIFighterResponse[] = await response.json();
    console.log(`✅ API Response for wallet ${walletAddress}:`, data);
    console.log(`📊 Found ${data.length} fighter(s) from API`);
    return data;
  } catch (error) {
    console.error(`Error fetching fighters from API for wallet ${walletAddress}:`, error);
    return [];
  }
}

export type HellraiserNFT = {
  tokenId: string;
  name: string;
  image: string;
  level: string;
  rarity: string;
  boost: string;
  isOwned: boolean;
  creator?: string;
  description?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }>;
  rawMetadata?: NFTMetadata;
};

export function useHellraiserNFTs() {
  const { address, isConnected } = useAccount();

  const hasContractAddress = Boolean(HELLRAISER_NFT_CONTRACT && HELLRAISER_NFT_CONTRACT.startsWith("0x"));

  // Check balance of Hellraiser NFTs on Shape Network
  // Note: We query Shape Network regardless of user's current chain
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    address: hasContractAddress ? (HELLRAISER_NFT_CONTRACT as `0x${string}`) : undefined,
    abi: ERC721_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    chainId: shapeNetwork.id,
    query: {
      enabled: Boolean(isConnected && address && hasContractAddress),
    },
  });

  const balanceCount = balance ? Number(balance) : 0;

  // Try to get totalSupply to know the token range
  const { data: totalSupply, isLoading: isLoadingTotalSupply } = useReadContract({
    address: hasContractAddress ? (HELLRAISER_NFT_CONTRACT as `0x${string}`) : undefined,
    abi: ERC721_ABI,
    functionName: "totalSupply",
    chainId: shapeNetwork.id,
    query: {
      enabled: Boolean(isConnected && hasContractAddress && balanceCount > 0),
    },
  });

  const totalSupplyCount = totalSupply ? Number(totalSupply) : null;


  // Log balance and trigger NFT data fetching when balance is detected
  useEffect(() => {
    if (isConnected && address && hasContractAddress) {
      if (balanceCount > 0) {
        console.log(`✅ Wallet has ${balanceCount} Hellraiser NFT(s) on Shape Network`);
        console.log(`📍 Contract: ${HELLRAISER_NFT_CONTRACT}`);
        console.log(`🔗 Chain ID: ${shapeNetwork.id} (Shape Network)`);
        if (totalSupplyCount !== null) {
          console.log(`📊 Total Supply: ${totalSupplyCount}`);
        }
        console.log(`🔄 Starting NFT data fetch process...`);
      } else if (!isLoadingBalance) {
        console.log(`ℹ️ No Hellraiser NFTs found in wallet on Shape Network`);
      }
    }
  }, [balanceCount, isConnected, address, hasContractAddress, isLoadingBalance, totalSupplyCount]);

  // Strategy: Use tokenOfOwnerByIndex to get token IDs directly (much more efficient!)
  // This follows the same pattern as the reference code:
  // 1. Get balance of NFTs owned by the wallet
  // 2. Loop through indices (0 to balanceCount-1) using tokenOfOwnerByIndex
  // 3. Extract token IDs from the results
  // 4. Fetch metadata for each token ID
  // This is more efficient than checking ownerOf for each token ID in the collection
  // Reference: pages/index.js - Main Next.js Page (tokenOfOwnerByIndex approach)
  const tokenOfOwnerByIndexContracts = useMemo(() => {
    if (!address || balanceCount === 0 || !hasContractAddress) return [];
    
    // Create contracts for each index (0 to balanceCount-1)
    // This matches the reference code's approach:
    // for (let i = 0; i < balanceNumber; i++) {
    //   const tokenId = await contract.tokenOfOwnerByIndex(address, i);
    //   tokenIds.push(tokenId.toString());
    // }
    return Array.from({ length: balanceCount }, (_, index) => ({
      address: HELLRAISER_NFT_CONTRACT as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "tokenOfOwnerByIndex" as const,
      args: [address, BigInt(index)],
      chainId: shapeNetwork.id,
    }));
  }, [address, balanceCount, hasContractAddress]);

  const { data: tokenOfOwnerData, isLoading: isLoadingTokenOfOwner, error: tokenOfOwnerError } = useReadContracts({
    contracts: tokenOfOwnerByIndexContracts,
    query: {
      enabled: tokenOfOwnerByIndexContracts.length > 0 && balanceCount > 0,
    },
  });

  // Extract token IDs from tokenOfOwnerByIndex results
  const tokenIdsFromIndex = useMemo(() => {
    if (!tokenOfOwnerData || tokenOfOwnerData.length === 0) return [];
    
    const ids: string[] = [];
    
    tokenOfOwnerData.forEach((result, index) => {
      if (result.status === "success" && result.result) {
        const tokenId = result.result.toString();
        ids.push(tokenId);
        const numericId = parseInt(tokenId, 10);
        console.log(`✅ Token ID at index ${index}: ${tokenId} (numeric: ${numericId})`);
      } else if (result.status === "failure") {
        console.warn(`⚠️ Failed to get token ID at index ${index}:`, result.error);
      }
    });
    
    if (ids.length > 0) {
      console.log(`\n🎉 ========== TOKEN IDs FROM tokenOfOwnerByIndex ==========`);
      console.log(`✅ Successfully retrieved ${ids.length} token ID(s) from wallet:`);
      ids.forEach((tokenId, index) => {
        console.log(`   ${index + 1}. Token ID: ${tokenId} (numeric: ${parseInt(tokenId, 10)})`);
      });
      console.log(`📋 Complete Token ID List: [${ids.join(", ")}]`);
      console.log(`==========================================\n`);
    } else if (tokenOfOwnerError || (tokenOfOwnerData.length > 0 && tokenOfOwnerData.every(r => r.status === "failure"))) {
      console.warn(`⚠️ tokenOfOwnerByIndex failed - contract may not support ERC721Enumerable`);
      console.warn(`   Falling back to ownerOf batch checking method...`);
    }
    
    return ids;
  }, [tokenOfOwnerData, tokenOfOwnerError]);

  // Use token IDs from tokenOfOwnerByIndex (preferred) or fallback to empty array
  // If tokenOfOwnerByIndex fails, we could implement fallback to ownerOf method
  const tokenIds = useMemo(() => {
    // If we successfully got token IDs from tokenOfOwnerByIndex, use those
    if (tokenIdsFromIndex.length > 0) {
      return tokenIdsFromIndex;
    }
    
    // If tokenOfOwnerByIndex failed and we're still loading, return empty
    if (isLoadingTokenOfOwner) {
      return [];
    }
    
    // If tokenOfOwnerByIndex failed, log warning
    if (balanceCount > 0 && tokenIdsFromIndex.length === 0 && !isLoadingTokenOfOwner) {
      console.warn(`⚠️ [useHellraiserNFTs] tokenOfOwnerByIndex returned no results for ${balanceCount} NFT(s)`);
      console.warn(`   Contract may not support ERC721Enumerable extension`);
    }
    
    return tokenIdsFromIndex;
  }, [tokenIdsFromIndex, balanceCount, isLoadingTokenOfOwner]);

  // Fetch tokenURI for each token ID
  const tokenURIContracts = useMemo(() => {
    if (tokenIds.length === 0 || !hasContractAddress) return [];
    return tokenIds.map((tokenId) => ({
      address: HELLRAISER_NFT_CONTRACT as `0x${string}`,
      abi: ERC721_ABI,
      functionName: "tokenURI" as const,
      args: [BigInt(tokenId)],
      chainId: shapeNetwork.id,
    }));
  }, [tokenIds, hasContractAddress]);

  const { data: tokenURIsData, isLoading: isLoadingTokenURIs } = useReadContracts({
    contracts: tokenURIContracts,
    query: {
      enabled: tokenURIContracts.length > 0,
    },
  });

  const tokenURIs = useMemo(() => {
    if (!tokenURIsData) return [];
    const uris = tokenURIsData.map((result, index) => {
      if (result.status === "success" && result.result) {
        const uri = result.result as string;
        const numericTokenId = parseInt(tokenIds[index], 10);
        console.log(`[Hellraiser NFT] Token ID ${tokenIds[index]} (${numericTokenId}) tokenURI:`, uri);
        
        return uri;
      }
      const numericTokenId = parseInt(tokenIds[index] || "0", 10);
      console.warn(`[Hellraiser NFT] Failed to fetch tokenURI for token ID ${tokenIds[index]} (${numericTokenId}) at index ${index}`);
      return null;
    });
    return uris;
  }, [tokenURIsData, tokenIds]);

  // Fetch metadata for each token URI
  const [metadataMap, setMetadataMap] = useState<Record<string, NFTMetadata | null>>({});
  const [isLoadingMetadata, setIsLoadingMetadata] = useState(false);

  useEffect(() => {
    if (tokenIds.length === 0 || tokenURIs.length === 0) {
      setMetadataMap({});
      return;
    }

    const fetchAllMetadata = async () => {
      setIsLoadingMetadata(true);
      const newMetadataMap: Record<string, NFTMetadata | null> = {};

      // Fetch metadata for each token in parallel
      const metadataPromises = tokenIds.map(async (tokenId, index) => {
        const tokenURI = tokenURIs[index];
        const numericTokenId = parseInt(tokenId, 10);
        
        if (!tokenURI) {
          console.warn(`[Metadata] No tokenURI for token ID ${tokenId} (${numericTokenId})`);
          newMetadataMap[tokenId] = null;
          return;
        }

        try {
          const metadata = await fetchNFTMetadata(tokenURI);
          newMetadataMap[tokenId] = metadata;
        } catch (error) {
          console.error(`Error fetching metadata for token ${tokenId} (${numericTokenId}):`, error);
          newMetadataMap[tokenId] = null;
        }
      });

      await Promise.all(metadataPromises);
      setMetadataMap(newMetadataMap);
      setIsLoadingMetadata(false);
      
      // Log metadata fetch results
      const successCount = Object.values(newMetadataMap).filter(m => m !== null).length;
      console.log(`📦 Metadata fetched: ${successCount}/${tokenIds.length} successful`);
      
      // Log full metadata for each NFT
      if (successCount > 0) {
        console.log(`\n🖼️ ========== HELLRAISER NFT METADATA ==========`);
        Object.entries(newMetadataMap).forEach(([tokenId, metadata]) => {
          if (metadata) {
            const numericTokenId = parseInt(tokenId, 10);
            console.log(`\n📌 Token ID: #${numericTokenId}`);
            console.log(`   Name: ${metadata.name || "N/A"}`);
            console.log(`   Image: ${metadata.image || "N/A"}`);
            console.log(`   Description: ${metadata.description || "N/A"}`);
            console.log(`   Attributes (${metadata.attributes?.length || 0}):`, metadata.attributes);
            console.log(`   Full Metadata:`, JSON.stringify(metadata, null, 2));
            
          } else {
            const numericTokenId = parseInt(tokenId, 10);
            console.warn(`   ⚠️ Token ID #${numericTokenId}: Failed to fetch metadata`);
          }
        });
        console.log(`==========================================\n`);
      }
    };

    fetchAllMetadata();
  }, [tokenIds, tokenURIs]);

  // Build NFT objects with real metadata
  // IMPORTANT: Create NFTs as soon as tokenIds are available, even if metadata is still loading
  // Build NFT objects from token IDs found in wallet
  const hellraiserNFTs: HellraiserNFT[] = useMemo(() => {
    // Debug logging
    console.log(`[useHellraiserNFTs] Building NFTs - balanceCount: ${balanceCount}, tokenIds.length: ${tokenIds.length}, metadataMap keys:`, Object.keys(metadataMap));
    
    const nfts: HellraiserNFT[] = [];
    
    // First, add NFTs from wallet (if any)
    if (tokenIds.length > 0) {
      const walletNFTs = tokenIds.map((tokenId) => {
        const metadata = metadataMap[tokenId];
        const displayData = extractNFTDisplayData(metadata, tokenId);
        
        // Format token ID - use original token ID number (e.g., 0 becomes "#0")
        const numericTokenId = parseInt(tokenId, 10);
        const formattedTokenId = `#${numericTokenId}`;

        const nft: HellraiserNFT = {
          tokenId: formattedTokenId,
          name: displayData.name,
          image: displayData.image,
          level: displayData.level,
          rarity: displayData.rarity,
          boost: displayData.boost,
          description: displayData.description,
          attributes: displayData.attributes,
          rawMetadata: metadata || undefined,
          isOwned: true,
        };
        
        return nft;
      });
      nfts.push(...walletNFTs);
    }
    
    // Log final NFT objects for debugging - ALWAYS show when NFTs exist
    if (nfts.length > 0) {
      console.log(`\n✨ ========== FINAL HELLRAISER NFTs ==========`);
      console.log(`📊 Total NFTs: ${nfts.length}`);
      console.log(`📊 Balance Count: ${balanceCount}`);
      console.log(`📊 Token IDs: ${tokenIds.join(", ")}`);
      console.log(`\n`);
      
      nfts.forEach((nft, index) => {
        const numericTokenId = parseInt(nft.tokenId.replace("#", ""), 10);
        console.log(`🎴 NFT #${index + 1}:`);
        console.log(`   Token ID: ${nft.tokenId} (numeric: ${numericTokenId})`);
        console.log(`   Name: ${nft.name}`);
        console.log(`   Image URL: ${nft.image}`);
        console.log(`   Image Type: ${nft.image.startsWith("ipfs://") ? "IPFS" : nft.image.includes("ipfs") ? "IPFS Gateway" : "HTTP/Other"}`);
        console.log(`   Level: ${nft.level}`);
        console.log(`   Rarity: ${nft.rarity}`);
        console.log(`   Boost: ${nft.boost}`);
        console.log(`   Description: ${nft.description || "N/A"}`);
        console.log(`   Attributes (${nft.attributes?.length || 0}):`, nft.attributes || []);
        console.log(`   Has Raw Metadata: ${!!nft.rawMetadata}`);
        if (nft.rawMetadata) {
          console.log(`   📄 Full Raw Metadata:`, JSON.stringify(nft.rawMetadata, null, 2));
        }
        console.log(`   Complete NFT Object:`, nft);
        
        console.log(`\n`);
      });
      
      console.log(`✅ All ${nfts.length} Hellraiser NFT(s) are ready for display!`);
      console.log(`==========================================\n`);
    } else {
      console.warn(`⚠️ [useHellraiserNFTs] Balance is ${balanceCount} but nfts array is empty!`);
      console.warn(`   tokenIds:`, tokenIds);
      console.warn(`   metadataMap:`, metadataMap);
    }
    
    return nfts;
  }, [tokenIds, balanceCount, metadataMap]);

  const isLoading = isLoadingBalance || isLoadingTotalSupply || isLoadingTokenOfOwner || isLoadingTokenURIs || isLoadingMetadata;

  // Log comprehensive NFT data when wallet is connected and tokens are found
  useEffect(() => {
    if (isConnected && address && tokenIds.length > 0) {
      console.log(`\n💰 ========== WALLET NFT SUMMARY ==========`);
      console.log(`👛 Wallet Address: ${address}`);
      console.log(`📊 Total NFTs in Wallet: ${balanceCount}`);
      console.log(`🎫 Token IDs Found: ${tokenIds.length}`);
      console.log(`📋 Token ID List (strings):`, tokenIds);
      console.log(`📋 Token ID List (numbers):`, tokenIds.map(id => parseInt(id, 10)));
      console.log(`✅ NFTs Ready: ${hellraiserNFTs.length}`);
      console.log(`==========================================\n`);
      
      // Log detailed NFT data for each NFT
      if (hellraiserNFTs.length > 0) {
        console.log(`\n🎴 ========== DETAILED NFT DATA FROM WALLET ==========`);
        hellraiserNFTs.forEach((nft, index) => {
          console.log(`\n📦 NFT #${index + 1}:`);
          console.log(`   Token ID: ${nft.tokenId}`);
          console.log(`   Name: ${nft.name}`);
          console.log(`   Image: ${nft.image}`);
          console.log(`   Level: ${nft.level}`);
          console.log(`   Rarity: ${nft.rarity}`);
          console.log(`   Boost: ${nft.boost}`);
          console.log(`   Description: ${nft.description || "N/A"}`);
          console.log(`   Is Owned: ${nft.isOwned}`);
          
          // Log attributes
          if (nft.attributes && nft.attributes.length > 0) {
            console.log(`   Attributes (${nft.attributes.length}):`);
            nft.attributes.forEach((attr, attrIndex) => {
              console.log(`      ${attrIndex + 1}. ${attr.trait_type || "Unknown"}: ${attr.value}`);
            });
          } else {
            console.log(`   Attributes: None found`);
          }
          
          // Log raw metadata if available
          if (nft.rawMetadata) {
            console.log(`   Raw Metadata:`, JSON.stringify(nft.rawMetadata, null, 2));
          }
        });
        console.log(`\n==========================================\n`);
      }
    } else if (isConnected && address && balanceCount === 0) {
      console.log(`\n💰 ========== WALLET NFT SUMMARY ==========`);
      console.log(`👛 Wallet Address: ${address}`);
      console.log(`📊 Total NFTs in Wallet: 0`);
      console.log(`ℹ️ No NFTs found in this wallet`);
      console.log(`==========================================\n`);
    }
  }, [isConnected, address, tokenIds, balanceCount, hellraiserNFTs]);

  // API-based fetching (alternative method - preferred if available)
  const [apiFightersData, setApiFightersData] = useState<APIFighterResponse[]>([]);
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) {
      setApiFightersData([]);
      return;
    }

    const fetchFromAPI = async () => {
      setIsLoadingAPI(true);
      console.log(`🌐 Fetching fighters data from API for wallet: ${address}`);
      const apiData = await fetchFightersFromAPI(address);
      if (apiData && apiData.length > 0) {
        console.log(`✅ API returned ${apiData.length} fighter(s):`, apiData);
        setApiFightersData(apiData);
      } else {
        console.log(`ℹ️ API returned no data, will use blockchain method`);
        setApiFightersData([]);
      }
      setIsLoadingAPI(false);
    };

    fetchFromAPI();
  }, [isConnected, address]);

  // Convert API response array to HellraiserNFT format
  const apiNFTs: HellraiserNFT[] = useMemo(() => {
    if (!apiFightersData || apiFightersData.length === 0) return [];

    return apiFightersData.map((fighter) => {
      // Convert attributes to the format expected by the component
      const attributes = Object.entries(fighter.attributes)
        .filter(([key]) => key !== 'level' && key !== 'serial_number' && key !== 'mileage_km')
        .map(([trait_type, value]) => ({
          trait_type: trait_type.replace(/_/g, ' '),
          value: value as number,
        }));

      // Convert image URL if it's IPFS
      let imageUrl = fighter.image;
      if (imageUrl.startsWith('ipfs://')) {
        imageUrl = convertIPFSToHTTP(imageUrl);
      }

      // Determine rarity based on level or other factors
      const level = fighter.attributes.level;
      let rarity = "Common";
      if (level >= 20) rarity = "Mythic";
      else if (level >= 15) rarity = "Legendary";
      else if (level >= 10) rarity = "Epic";
      else if (level >= 5) rarity = "Rare";

      // Determine boost (highest attribute)
      const attributeValues = Object.entries(fighter.attributes)
        .filter(([key]) => key !== 'level' && key !== 'serial_number' && key !== 'mileage_km')
        .map(([key, value]) => ({ key, value: value as number }));
      const highestAttr = attributeValues.reduce((max, attr) => 
        attr.value > max.value ? attr : max
      );
      const boost = `${highestAttr.key.charAt(0).toUpperCase() + highestAttr.key.slice(1).replace(/_/g, ' ')} +${highestAttr.value}`;

      const nft: HellraiserNFT = {
        tokenId: `#${fighter.tokenId}`,
        name: fighter.name,
        image: imageUrl,
        level: level.toString(),
        rarity,
        boost,
        creator: fighter.creator,
        description: fighter.description,
        attributes,
        isOwned: true,
        rawMetadata: {
          name: fighter.name,
          description: fighter.description,
          image: fighter.image,
          attributes: attributes,
        } as NFTMetadata,
      };

      return nft;
    });
  }, [apiFightersData]);

  // Log API NFTs when converted
  useEffect(() => {
    if (apiNFTs.length > 0) {
      console.log(`📦 API NFTs converted (${apiNFTs.length}):`, apiNFTs);
    }
  }, [apiNFTs]);

  // Prefer API data if available, otherwise use blockchain data
  const finalNFTs = useMemo(() => {
    if (apiNFTs.length > 0) {
      console.log(`✅ Using API data for ${apiNFTs.length} NFT(s)`);
      return apiNFTs;
    }
    console.log(`📡 Using blockchain data, found ${hellraiserNFTs.length} NFT(s)`);
    return hellraiserNFTs;
  }, [apiNFTs, hellraiserNFTs]);

  // Get token IDs from API or blockchain
  const finalTokenIds = useMemo(() => {
    if (apiFightersData.length > 0) {
      return apiFightersData.map(fighter => fighter.tokenId.toString());
    }
    return tokenIds;
  }, [apiFightersData, tokenIds]);

  // Check if we have any NFTs to display from wallet
  const hasAnyNFTs = finalNFTs.length > 0;
  const finalBalanceCount = apiFightersData.length > 0 ? apiFightersData.length : balanceCount;
  const finalIsLoading = isLoading || isLoadingAPI;
  
  return {
    hellraiserNFTs: finalNFTs,
    balanceCount: finalBalanceCount,
    isLoading: finalIsLoading,
    hasHellraiserNFTs: hasAnyNFTs, // Show NFTs if we have any in wallet
    tokenIds: finalTokenIds, // Export token IDs for direct access (array of strings, e.g., ["1768"])
    rawTokenIds: finalTokenIds.map(id => parseInt(id, 10)), // Export numeric token IDs for convenience
  };
}


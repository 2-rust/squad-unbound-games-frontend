/**
 * Utility functions for fetching and parsing NFT metadata
 */

export interface NFTMetadata {
  name?: string;
  description?: string;
  image?: string;
  external_url?: string;
  animation_url?: string;
  attributes?: Array<{
    trait_type?: string;
    value?: string | number;
    display_type?: string;
  }>;
  properties?: Record<string, any>;
  [key: string]: any; // Allow additional fields
}

/**
 * Converts IPFS URI to HTTP gateway URL
 * Uses Pinata IPFS gateway (gateway.pinata.cloud)
 */
export function convertIPFSToHTTP(ipfsUri: string): string {
  if (ipfsUri.startsWith("ipfs://")) {
    // Remove ipfs:// prefix and handle paths
    // Format: ipfs://QmHash/path/to/file.jpg -> https://gateway.pinata.cloud/ipfs/QmHash/path/to/file.jpg
    const path = ipfsUri.replace("ipfs://", "").replace(/^\/+/, ""); // Remove leading slashes
    // Use Pinata IPFS gateway
    return `https://gateway.pinata.cloud/ipfs/${path}`;
  }
  return ipfsUri;
}

/**
 * Normalizes URI to HTTP URL
 */
function normalizeURI(uri: string): string {
  if (!uri) return "";
  
  // Handle data URIs (base64 encoded)
  if (uri.startsWith("data:")) {
    return uri;
  }
  
  // Handle IPFS
  if (uri.startsWith("ipfs://")) {
    return convertIPFSToHTTP(uri);
  }
  
  // Handle ar:// (Arweave)
  if (uri.startsWith("ar://")) {
    const hash = uri.replace("ar://", "");
    return `https://arweave.net/${hash}`;
  }
  
  // Already HTTP/HTTPS
  if (uri.startsWith("http://") || uri.startsWith("https://")) {
    return uri;
  }
  
  // If relative path, assume it's already correct
  return uri;
}

/**
 * Fetches metadata from a tokenURI
 */
export async function fetchNFTMetadata(tokenURI: string): Promise<NFTMetadata | null> {
  try {
    if (!tokenURI) return null;
    
    const normalizedURI = normalizeURI(tokenURI);
    
    // Handle data URIs
    if (normalizedURI.startsWith("data:application/json")) {
      const base64Data = normalizedURI.split(",")[1];
      const jsonString = atob(base64Data);
      return JSON.parse(jsonString) as NFTMetadata;
    }
    
    if (normalizedURI.startsWith("data:text/plain")) {
      // Some contracts return plain text JSON
      const jsonString = decodeURIComponent(normalizedURI.split(",")[1]);
      return JSON.parse(jsonString) as NFTMetadata;
    }
    
    // Fetch from HTTP/HTTPS with timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    try {
      const response = await fetch(normalizedURI, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`Failed to fetch metadata: ${response.status} ${response.statusText}`);
        return null;
      }
      
      const metadata = await response.json();
      return metadata as NFTMetadata;
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        console.error(`Timeout fetching metadata from ${normalizedURI}`);
      } else {
        throw fetchError; // Re-throw to be caught by outer catch
      }
      return null;
    }
  } catch (error) {
    console.error(`Error fetching NFT metadata from ${tokenURI}:`, error);
    return null;
  }
}

/**
 * Extracts specific fields from metadata for display
 */
export function extractNFTDisplayData(
  metadata: NFTMetadata | null,
  tokenId: string
): {
  name: string;
  image: string;
  level: string;
  rarity: string;
  boost: string;
  description?: string;
  attributes?: Array<{ trait_type?: string; value?: string | number }>;
} {
  if (!metadata) {
    return {
      name: `Hellraiser #${tokenId}`,
      image: "/assets/defaultnft.png",
      level: "0",
      rarity: "Unknown",
      boost: "—",
    };
  }
  
  // Extract name
  const name = metadata.name || `Hellraiser #${tokenId}`;
  
  // Extract image - normalize IPFS URLs and handle relative paths
  let image = metadata.image || "/assets/defaultnft.png";
  
  // Handle IPFS - convert to HTTP gateway URL
  if (image.startsWith("ipfs://")) {
    image = convertIPFSToHTTP(image);
    console.log(`[NFT Metadata] Converted IPFS image: ${metadata.image} -> ${image}`);
  }
  
  // Handle Arweave
  if (image.startsWith("ar://")) {
    const hash = image.replace("ar://", "");
    image = `https://arweave.net/${hash}`;
    console.log(`[NFT Metadata] Converted Arweave image: ${metadata.image} -> ${image}`);
  }
  
  // Handle IPFS hash without protocol (some metadata stores just the hash)
  if (image && !image.startsWith("http://") && !image.startsWith("https://") && !image.startsWith("ipfs://") && !image.startsWith("/") && !image.startsWith("data:") && image.length > 10) {
    // Might be an IPFS hash, try converting
    if (!image.includes(".") && !image.includes("/")) {
      image = `https://ipfs.io/ipfs/${image}`;
      console.log(`[NFT Metadata] Assumed IPFS hash, converted to: ${image}`);
    } else {
      // Relative path - add leading slash
      image = `/${image}`;
    }
  }
  
  // Ensure image is a valid URL
  if (!image.startsWith("http://") && !image.startsWith("https://") && !image.startsWith("/") && !image.startsWith("data:")) {
    image = "/assets/defaultnft.png";
  }
  
  // Extract level from attributes - check multiple possible names and formats
  let level = "0";
  
  // Check attributes first
  const levelAttr = metadata.attributes?.find(
    (attr) => {
      const traitType = (attr.trait_type || "").toLowerCase();
      const value = String(attr.value || "").toLowerCase();
      return (
        traitType === "level" ||
        traitType === "lv" ||
        traitType === "lvl" ||
        traitType.includes("level") ||
        value.includes("level")
      );
    }
  );
  if (levelAttr?.value !== undefined && levelAttr.value !== null) {
    level = String(levelAttr.value);
  }
  
  // Also check if level is in the name or other fields
  if (level === "0" && metadata.name) {
    const levelMatch = metadata.name.match(/level\s*[:\-]?\s*(\d+)/i) || 
                       metadata.name.match(/lv\s*[:\-]?\s*(\d+)/i) ||
                       metadata.name.match(/lvl\s*[:\-]?\s*(\d+)/i);
    if (levelMatch) {
      level = levelMatch[1];
    }
  }
  
  // Check properties if attributes didn't have level
  if (level === "0" && metadata.properties) {
    const levelProp = metadata.properties.level || metadata.properties.Level || metadata.properties.LVL;
    if (levelProp) {
      level = String(levelProp);
    }
  }
  
  // Extract rarity from attributes - check multiple possible names
  let rarity = "Common";
  const rarityAttr = metadata.attributes?.find(
    (attr) => {
      const traitType = (attr.trait_type || "").toLowerCase();
      return (
        traitType === "rarity" ||
        traitType === "tier" ||
        traitType === "rank" ||
        traitType.includes("rarity") ||
        traitType.includes("tier")
      );
    }
  );
  if (rarityAttr?.value !== undefined && rarityAttr.value !== null) {
    rarity = String(rarityAttr.value);
  }
  
  // Check properties if attributes didn't have rarity
  if (rarity === "Common" && metadata.properties) {
    const rarityProp = metadata.properties.rarity || metadata.properties.Rarity || metadata.properties.tier || metadata.properties.Tier;
    if (rarityProp) {
      rarity = String(rarityProp);
    }
  }
  
  // Extract boost from attributes - check multiple possible names and formats
  let boost = "—";
  const boostAttr = metadata.attributes?.find(
    (attr) => {
      const traitType = attr.trait_type?.toLowerCase() || "";
      return (
        traitType === "boost" ||
        traitType === "bonus" ||
        traitType === "power" ||
        traitType === "ability" ||
        traitType.includes("boost") ||
        traitType.includes("bonus")
      );
    }
  );
  if (boostAttr?.value !== undefined && boostAttr.value !== null) {
    boost = String(boostAttr.value);
  }
  
  // If boost is still default, try to find any attribute that looks like a boost
  if (boost === "—") {
    const anyBoostAttr = metadata.attributes?.find(
      (attr) => {
        const value = String(attr.value || "").toLowerCase();
        return value.includes("+") || value.includes("bonus") || value.includes("boost");
      }
    );
    if (anyBoostAttr?.value) {
      boost = String(anyBoostAttr.value);
    }
  }
  
  return {
    name,
    image,
    level,
    rarity,
    boost,
    description: metadata.description,
    attributes: metadata.attributes,
  };
}

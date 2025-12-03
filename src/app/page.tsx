"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, Suspense } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useHellraiserNFTs } from "@/hooks/useHellraiserNFTs";
import { useUserProfile } from "@/hooks/useUserProfile";

type AttributeCard = {
  id: string;
  emoji: string;
  title: string;
  description: string;
  status: string;
  trainable: boolean;
};

type TrainingMethod = {
  id: string;
  icon: string;
  title: string;
  description: string;
  badge: string;
};

const fighterCards = [
  {
    id: "#041",
    name: "Rex Vanguard",
    creator: "Fighters Unbound",
    level: "21",
    rarity: "Legendary",
    boost: "Leadership +9",
    image: "/assets/defaultnft.png",
    isOwned: true,
  },
];

const attributeOptions: AttributeCard[] = [
  {
    id: "endurance",
    emoji: "🔋",
    title: "Endurance",
    description: "Stamina and resilience over time.",
    status: "Trainable via running (Strava)",
    trainable: true,
  },
  {
    id: "mental",
    emoji: "🪷",
    title: "Mental Strength",
    description: "Focus, discipline and emotional control.",
    status: "Trainable via meditation or yoga",
    trainable: true,
  },
  {
    id: "leadership",
    emoji: "👑",
    title: "Leadership",
    description: "Strategic clarity, initiative and team influence.",
    status: "Trainable via consistent meditation",
    trainable: true,
  },
  {
    id: "agility",
    emoji: "🏹",
    title: "Agility",
    description: "Flexibility, control and body coordination.",
    status: "Trainable via yoga",
    trainable: true,
  },
  {
    id: "punch",
    emoji: "🥊",
    title: "Punch",
    description: "Raw striking power and knockout potential.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "speed",
    emoji: "⚡",
    title: "Speed",
    description: "Reaction time and explosive movement.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "defense",
    emoji: "🛡️",
    title: "Defense",
    description: "Ability to block, evade and absorb attacks.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "technique",
    emoji: "🎯",
    title: "Technique",
    description: "Precision, timing and tactical execution.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "intelligence",
    emoji: "🧠",
    title: "Intelligence",
    description: "Tactical insight and problem-solving under pressure.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "charisma",
    emoji: "😎",
    title: "Charisma",
    description: "Presence, confidence and influence in the arena.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "stealth",
    emoji: "🥷",
    title: "Stealth",
    description: "Mastery of subtlety, movement and misdirection.",
    status: "Not trainable yet",
    trainable: false,
  },
  {
    id: "luck",
    emoji: "🍀",
    title: "Luck",
    description: "Chance-based advantages in unpredictable moments.",
    status: "Not trainable yet",
    trainable: false,
  },
];

const trainingMethods: TrainingMethod[] = [
  {
    id: "strava",
    icon: "🏃‍♂️",
    title: "Strava",
    description: "Mileage-based XP, synced automatically.",
    badge: "Live",
  },
  {
    id: "meditation",
    icon: "🧘‍♀️",
    title: "Meditation",
    description: "Mindful reps to unlock focus.",
    badge: "Beta",
  },
  {
    id: "yoga",
    icon: "🧘‍♂️",
    title: "Yoga",
    description: "Mobility flows for agility buffs.",
    badge: "Coming Soon",
  },
];

const meditationCourses = [
  { id: 1, title: "Lesson One", subtitle: "Focus and Clarity", videoId: "pRjnf0ot0ss", timer: 339 }, // 5:39
  { id: 2, title: "Lesson Two", subtitle: "Grounding & Clarity", videoId: "J6W6AYsHnT0", timer: 749 }, // 12:29
  { id: 3, title: "Lesson Three", subtitle: "Calm & Presence", videoId: "hXf2e0XFMPc", timer: 321 }, // 5:21
  { id: 4, title: "Lesson Four", subtitle: "Breathe & Awareness", videoId: "ECbfqZzIzPA", timer: 736 }, // 12:16
];

const yogaCourses = [
  { id: 1, title: "Lesson One", subtitle: "Between Tension and Technique", videoId: "gb_MGpw7zIs", timer: 669 }, // 11:09
  { id: 2, title: "Lesson Two", subtitle: "Flow under Pressure", videoId: "XlBUeuWA7Q4", timer: 364 }, // 6:04
  { id: 3, title: "Lesson Three", subtitle: "Precision and Stillness", videoId: "gHjVLRoYH7s", timer: 796 }, // 13:16
  { id: 4, title: "Lesson Four", subtitle: "Watchful and Ready", videoId: "MKAjKetmM3M", timer: 504 }, // 8:24
  { id: 5, title: "Lesson Five", subtitle: "Control the Center", videoId: "_z1qv7W2og0", timer: 545 }, // 9:05
];

// Side menu will be dynamically generated based on NFT type and training method
const getSideMenu = (isHellraiser: boolean, trainingMethod?: string) => [
  { id: "first-section", label: `Select ${isHellraiser ? "Hellraiser" : "Fighter"}` },
  { id: "second-section", label: "Training Method" },
  { id: "third-section", label: "Connect Strava" },
  { id: "fourth-section", label: trainingMethod === "strava" ? "Sync Strava" : trainingMethod === "meditation" ? "Meditation Training" : "Yoga Training" },
] as const;

function HomeContent() {
  const [activeCard, setActiveCard] = useState(0);
  const [selectedAttribute] = useState(
    attributeOptions[0].id,
  );
  const [selectedMethod, setSelectedMethod] = useState("strava");
  
  // Get the app URL from environment variable or use current origin
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 
    (typeof window !== "undefined" ? window.location.origin : "https://squad-unbound-games.vercel.app");
  const stravaRedirectUri = `${appUrl}/authorize`;
  
  // Check for Hellraiser NFTs from connected wallet
  const { 
    hellraiserNFTs, 
    balanceCount: hellraiserBalance, 
    hasHellraiserNFTs, 
    isLoading: isLoadingHellraiser, 
    tokenIds
  } = useHellraiserNFTs();
  
  // Get user profile for welcome screen
  const { profile: userProfile, isLoading: isLoadingProfile } = useUserProfile();
  
  // Log comprehensive NFT data from wallet when found
  useEffect(() => {
    if (hasHellraiserNFTs && tokenIds && tokenIds.length > 0) {
      console.log(`\n🎯 ========== PAGE: NFT DATA FROM CONNECTED WALLET ==========`);
      console.log(`📊 Total NFTs: ${hellraiserNFTs.length}`);
      console.log(`📊 Balance Count: ${hellraiserBalance}`);
      console.log(`🎫 Token IDs:`, tokenIds);
      console.log(`🎫 Numeric Token IDs:`, tokenIds.map(id => parseInt(id, 10)));
      
      console.log(`\n📦 NFT Details:`);
      hellraiserNFTs.forEach((nft, index: number) => {
        console.log(`\n   NFT #${index + 1}:`);
        console.log(`      Token ID: ${nft.tokenId}`);
        console.log(`      Name: ${nft.name}`);
        console.log(`      Image URL: ${nft.image}`);
        console.log(`      Level: ${nft.level}`);
        console.log(`      Rarity: ${nft.rarity}`);
        console.log(`      Boost: ${nft.boost}`);
      console.log(`🎫 Numeric Token IDs:`, tokenIds.map(id => parseInt(id, 10)));
        console.log(`      Is Owned: ${nft.isOwned}`);
        
        // Log attributes
        if (nft.attributes && nft.attributes.length > 0) {
          console.log(`      Attributes (${nft.attributes.length}):`);
          nft.attributes.forEach((attr) => {
            console.log(`         - ${attr.trait_type || "Unknown"}: ${attr.value}`);
          });
        }
        
        // Log raw metadata summary
        if (nft.rawMetadata) {
          console.log(`      Raw Metadata Available: Yes`);
          console.log(`         Name: ${nft.rawMetadata.name || "N/A"}`);
          console.log(`         Image: ${nft.rawMetadata.image || "N/A"}`);
          console.log(`         Attributes Count: ${nft.rawMetadata.attributes?.length || 0}`);
        }
      });
      console.log(`\n==========================================\n`);
    } else if (isLoadingHellraiser) {
      console.log(`\n⏳ [Page] Loading NFT data from wallet...`);
    }
  }, [hasHellraiserNFTs, tokenIds, hellraiserNFTs, hellraiserBalance, isLoadingHellraiser]);

  const sideMenu = useMemo(() => getSideMenu(hasHellraiserNFTs, selectedMethod), [hasHellraiserNFTs, selectedMethod]);
  const [activeSection, setActiveSection] = useState("first-section");
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">(
    "idle",
  );
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(0); // km
  const [cycleTotalDistance, setCycleTotalDistance] = useState(0); // km
  const [syncsRemaining, setSyncsRemaining] = useState(19);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
  const [videoFadeOut, setVideoFadeOut] = useState(false);
  const [showSyncPopup, setShowSyncPopup] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    distance: number;
    enduranceDelta: number;
    levelDelta: number;
  } | null>(null);
  const [countdown, setCountdown] = useState({
    days: 29,
    hours: 4,
    minutes: 14,
    seconds: 2,
  });
  const [selectedCourse, setSelectedCourse] = useState<number | null>(null);
  const [videoTimer, setVideoTimer] = useState<number | null>(null);
  const [isVideoPaused, setIsVideoPaused] = useState(false);
  const { isConnected, address } = useAccount();
  const walletConnected = Boolean(isConnected);
  const searchParams = useSearchParams();

  // Timer countdown effect for meditation/yoga courses
  useEffect(() => {
    if (videoTimer !== null && videoTimer > 0 && !isVideoPaused) {
      const interval = setInterval(() => {
        setVideoTimer((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [videoTimer, isVideoPaused]);

  // Check for Strava OAuth callback and restore connection state from localStorage
  useEffect(() => {
    // Check URL params for OAuth callback
    const stravaConnectedParam = searchParams?.get("strava_connected");
    const stravaErrorParam = searchParams?.get("strava_error");
    
    if (stravaConnectedParam === "true") {
      // User returned from successful Strava OAuth
      const stored = localStorage.getItem("strava_connected");
      if (stored === "true") {
        setStravaConnected(true);
        setSelectionMessage("Strava connected successfully! Latest run imported.");
        // Clear URL param
        window.history.replaceState({}, "", window.location.pathname);
      }
    } else if (stravaErrorParam) {
      // OAuth error occurred
      setStravaConnected(false);
      setSelectionMessage(`Strava connection failed: ${stravaErrorParam}`);
      localStorage.removeItem("strava_connected");
      // Clear URL param
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      // Check localStorage for existing connection
      const stored = localStorage.getItem("strava_connected");
      if (stored === "true") {
        // Check if connection is still valid (not expired)
        const timestamp = localStorage.getItem("strava_connected_timestamp");
        if (timestamp) {
          const connectionTime = parseInt(timestamp, 10);
          const now = Date.now();
          // Consider connection valid for 30 days
          const thirtyDays = 30 * 24 * 60 * 60 * 1000;
          if (now - connectionTime < thirtyDays) {
            setStravaConnected(true);
          } else {
            // Connection expired
            localStorage.removeItem("strava_connected");
            localStorage.removeItem("strava_connected_timestamp");
            localStorage.removeItem("strava_auth_code");
          }
        } else {
          setStravaConnected(true);
        }
      }
    }
  }, [searchParams]);

  // Load training data from localStorage on mount and check for daily reset
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedDistance = localStorage.getItem("current_distance");
      const storedCycleDistance = localStorage.getItem("cycle_total_distance");
      const storedSyncsRemaining = localStorage.getItem("syncs_remaining");
      const lastSyncReset = localStorage.getItem("last_sync_reset");
      
      // Check if we need to reset daily syncs (reset at midnight)
      const now = new Date();
      const today = now.toDateString();
      const lastReset = lastSyncReset ? new Date(lastSyncReset).toDateString() : null;
      
      if (storedDistance) {
        setCurrentDistance(parseFloat(storedDistance));
      }
      if (storedCycleDistance) {
        setCycleTotalDistance(parseFloat(storedCycleDistance));
      }
      
      // Reset syncs if it's a new day
      if (lastReset !== today) {
        setSyncsRemaining(20);
        localStorage.setItem("syncs_remaining", "20");
        localStorage.setItem("last_sync_reset", now.toISOString());
      } else if (storedSyncsRemaining) {
        const syncs = parseInt(storedSyncsRemaining, 10);
        setSyncsRemaining(syncs);
      } else {
        setSyncsRemaining(20);
        localStorage.setItem("syncs_remaining", "20");
        localStorage.setItem("last_sync_reset", now.toISOString());
      }
    }
  }, []);

  // Persist training data to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("current_distance", currentDistance.toString());
      localStorage.setItem("cycle_total_distance", cycleTotalDistance.toString());
      localStorage.setItem("syncs_remaining", syncsRemaining.toString());
    }
  }, [currentDistance, cycleTotalDistance, syncsRemaining]);
  
  const renderConnectButtons = () => (
    <ConnectButton.Custom>
      {({
        account: accountFromButton,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && accountFromButton && chain;

        if (!connected) {
          return (
            <button
              type="button"
              className="connectbutton_redConnectButton__SrvWE mt-6"
              onClick={openConnectModal}
            >
              CONNECT WALLET
            </button>
          );
        }

        return (
          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              className="connectbutton_blackConnectButtonSmall__MDYTu"
              onClick={openChainModal}
            >
              <span className="mr-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[rgb(72,76,80)]">
                <span className="h-2 w-2 rounded-full bg-white" />
              </span>
              {chain?.name ?? "Network"}
            </button>
            <button
              type="button"
              className="connectbutton_redConnectButtonSmall__GSJ3j"
              onClick={openAccountModal}
            >
              {accountFromButton?.displayName}
            </button>
          </div>
        );
      }}
    </ConnectButton.Custom>
  );

  // Use Hellraiser NFTs if available, otherwise use default fighter cards
  // Reference: squad.unbound.games-noNFT.html - when wallet connected but no NFTs
  const availableCards = useMemo(() => {
    if (hasHellraiserNFTs && hellraiserNFTs.length > 0) {
      // Show all NFTs from wallet
      return hellraiserNFTs.map((nft) => ({
        id: nft.tokenId,
        name: nft.name,
        creator: nft.creator || "Hellraiser",
        level: nft.level,
        rarity: nft.rarity,
        boost: nft.boost,
        image: nft.image,
        isOwned: nft.isOwned,
      }));
    }
    // When wallet is connected but no NFTs found, show empty card
    // Reference: squad.unbound.games-noNFT.html shows empty card with "Empty" name
    if (walletConnected && !isLoadingHellraiser && hellraiserBalance === 0) {
      return [{
        id: "#000",
        name: "Empty",
        creator: "You do not hold any NFT",
        level: "--",
        rarity: "Inactive",
        boost: "—",
        image: "/assets/defaultnft.png",
        isOwned: false,
      }];
    }
    return fighterCards;
  }, [hasHellraiserNFTs, hellraiserNFTs, walletConnected, isLoadingHellraiser, hellraiserBalance]);

  // Reset active card when switching between NFT types or when NFTs load
  useEffect(() => {
    if (hasHellraiserNFTs && hellraiserNFTs.length > 0) {
      // Start with the first NFT (index 0)
      setActiveCard(0);
    } else {
      setActiveCard(0);
    }
  }, [hasHellraiserNFTs, hellraiserNFTs.length]);

  const ownedCount = useMemo(() => {
    if (hasHellraiserNFTs) {
      // Count only owned NFTs (isOwned: true)
      const ownedNFTs = hellraiserNFTs.filter(nft => nft.isOwned);
      const ownedCount = ownedNFTs.length;
      console.log(`hellraiserBalance:`, hellraiserBalance);
      console.log(`hellraiserNFTs (total):`, hellraiserNFTs.length);
      console.log(`hellraiserNFTs (owned):`, ownedCount);
      return ownedCount;
    }
    return 0;
  }, [hasHellraiserNFTs, hellraiserBalance, hellraiserNFTs]);
  

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.45 },
    );

    sideMenu.forEach((section) => {
      const node = document.getElementById(section.id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [sideMenu]);

  useEffect(() => {
    if (!selectionMessage) return;
    // Don't auto-clear messages during sync operations
    if (syncStatus === "syncing") return;
    const timer = setTimeout(() => setSelectionMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [selectionMessage, syncStatus]);

  // Countdown timer - updates every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        let { days, hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else if (days > 0) {
          days--;
          hours = 23;
          minutes = 59;
          seconds = 59;
        }
        
        return { days, hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const activeFighter = availableCards[activeCard] || availableCards[0] || {
    id: "#000",
    name: "Empty",
    creator: "You do not hold any NFT",
    level: "--",
    rarity: "Inactive",
    boost: "—",
    image: "/assets/defaultnft.png",
    isOwned: false,
  };
  
  // Check if we're showing the empty state (no NFTs in wallet)
  // Reference: squad.unbound.games-noNFT.html - shows empty card when wallet connected but no NFTs
  const isShowingEmptyState = walletConnected && !isLoadingHellraiser && hellraiserBalance === 0 && !hasHellraiserNFTs;
  
  // Extract numeric attributes for display - Always show all 12 attributes like the site
  // Reference: The site shows all 12 attributes (punch, endurance, speed, defense, technique, mental strength, intelligence, charisma, stealth, leadership, agility, luck)
  const numericAttributes = useMemo(() => {
    // Define all 12 attributes in the order they appear on the site
    const allAttributes = [
      { id: 'punch', name: 'punch' },
      { id: 'endurance', name: 'endurance' },
      { id: 'speed', name: 'speed' },
      { id: 'defense', name: 'defense' },
      { id: 'technique', name: 'technique' },
      { id: 'mental strength', name: 'mental strength' },
      { id: 'intelligence', name: 'intelligence' },
      { id: 'charisma', name: 'charisma' },
      { id: 'stealth', name: 'stealth' },
      { id: 'leadership', name: 'leadership' },
      { id: 'agility', name: 'agility' },
      { id: 'luck', name: 'luck' },
    ];

    // Default values matching the reference site
    const defaultValues: Record<string, number> = {
      'punch': 92,
      'endurance': 85,
      'speed': 83,
      'defense': 66,
      'technique': 73,
      'mental strength': 84,
      'intelligence': 88,
      'charisma': 91,
      'stealth': 84,
      'leadership': 90,
      'agility': 86,
      'luck': 89,
    };

    if (!activeFighter || !hasHellraiserNFTs) {
      // Return defaults if no NFT selected
      return allAttributes.map(attr => ({
        name: attr.name,
        value: defaultValues[attr.name] || 0,
      }));
    }
    
    const activeNFT = hellraiserNFTs.find(nft => nft.tokenId === activeFighter.id);
    const metadataAttributes = activeNFT?.attributes || activeNFT?.rawMetadata?.attributes || [];
    
    // Create a map of attribute values from metadata (case-insensitive matching)
    const attributeMap = new Map<string, number>();
    metadataAttributes.forEach(attr => {
      const traitType = (attr.trait_type || '').toLowerCase().trim();
      const value = attr.value;
      let numValue: number | null = null;
      
      if (typeof value === 'number') {
        numValue = value;
      } else if (typeof value === 'string') {
        const parsed = parseInt(value, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 100) {
          numValue = parsed;
        }
      }
      
      if (numValue !== null) {
        // Map various attribute name variations to standard names
        const normalizedName = traitType
          .replace(/\s+/g, ' ')
          .replace(/mental\s*strength/i, 'mental strength')
          .replace(/mental/i, 'mental strength')
          .toLowerCase();
        
        attributeMap.set(normalizedName, numValue);
      }
    });
    
    // Build the final attributes array - always all 12, using metadata values or defaults
    return allAttributes.map(attr => {
      const lowerName = attr.name.toLowerCase();
      // Try exact match first
      let value = attributeMap.get(lowerName);
      
      // Try variations if exact match not found
      if (value === undefined) {
        // For "mental strength", also check "mental"
        if (lowerName === 'mental strength') {
          value = attributeMap.get('mental') || attributeMap.get('mentalstrength');
        }
        // Try matching by partial name
        const attributeEntries = Array.from(attributeMap.entries());
        for (let i = 0; i < attributeEntries.length; i++) {
          const [key, val] = attributeEntries[i];
          if (key.includes(lowerName) || lowerName.includes(key)) {
            value = val;
            break;
          }
        }
      }
      
      return {
        name: attr.name,
        value: value !== undefined ? value : (defaultValues[attr.name] || 0),
      };
    });
  }, [activeFighter, hasHellraiserNFTs, hellraiserNFTs]);
  
  // Log active fighter data for debugging
  useEffect(() => {
    if (activeFighter && hasHellraiserNFTs) {
      console.log(`\n🎴 ========== ACTIVE FIGHTER DATA ==========`);
      console.log(`   Token ID: ${activeFighter.id}`);
      console.log(`   Name: ${activeFighter.name}`);
      console.log(`   Creator: ${activeFighter.creator}`);
      console.log(`   Level: ${activeFighter.level}`);
      console.log(`   Rarity: ${activeFighter.rarity || "N/A"}`);
      console.log(`   Boost: ${activeFighter.boost || "N/A"}`);
      console.log(`   Image: ${activeFighter.image}`);
      console.log(`   Is Owned: ${activeFighter.isOwned}`);
      console.log(`   Attributes: ${numericAttributes.length} numeric attributes found`);
      console.log(`==========================================\n`);
    }
  }, [activeFighter, hasHellraiserNFTs, numericAttributes.length]);

  const handleCarousel = (direction: "next" | "prev") => {
    setActiveCard((prev) => {
      if (direction === "next") {
        return (prev + 1) % availableCards.length;
      }
      return (prev - 1 + availableCards.length) % availableCards.length;
    });
  };

  const confirmDisabled = !activeFighter?.isOwned || !walletConnected;

  const handleConfirm = () => {
    // Reference: squad.unbound.games-strava.html - second section confirm selection
    if (confirmDisabled) return;
    const attribute = attributeOptions.find(
      (option) => option.id === selectedAttribute,
    );
    const method = trainingMethods.find(
      (option) => option.id === selectedMethod,
    );

    setSelectionMessage(
      `${activeFighter.name} is now focusing on ${attribute?.title} via ${method?.title}.`,
    );
    setSelectionConfirmed(true);
  };

  const handleStravaConnect = () => {
    if (!activeFighter?.isOwned) {
      setSelectionMessage(`Please set an active ${hasHellraiserNFTs ? "Hellraiser" : "fighter"} before connecting.`);
      return;
    }
    // The actual connection happens via OAuth redirect in the third section
    // This function is kept for backward compatibility but the real connection
    // is handled by the OAuth callback in the authorize route
    if (!stravaConnected) {
      // Check if already connected via localStorage
      const stored = localStorage.getItem("strava_connected");
      if (stored === "true") {
        setStravaConnected(true);
        setSelectionMessage("Strava is already connected. Latest run imported.");
      } else {
        setSelectionMessage("Please click the 'Connect with Strava' button in Step 2 to authorize.");
      }
    } else {
      setSelectionMessage("Strava is already connected. Latest run imported.");
    }
  };

  const handleMeditationSync = async () => {
    // Reference: squad.unbound.games-course.html - meditation sync logic
    if (syncStatus === "syncing") return;
    
    if (!selectedCourse) {
      setSelectionMessage("Please select a meditation course first.");
      return;
    }
    
    if (videoTimer !== null && videoTimer > 0) {
      setSelectionMessage("Please complete the course video before syncing.");
      return;
    }
    
    if (!activeFighter?.isOwned) {
      setSelectionMessage(`Please set an active ${hasHellraiserNFTs ? "Hellraiser" : "fighter"} before syncing.`);
      return;
    }
    
    if (!selectionConfirmed || selectedMethod !== "meditation") {
      setSelectionMessage("Please confirm your meditation selection in Step 2 first.");
      return;
    }
    
    setSyncStatus("syncing");
    setSelectionMessage("Syncing meditation training progress for all fighters...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate meditation sync - trains all fighters
      const course = meditationCourses.find(c => c.id === selectedCourse);
      const xpGained = Math.floor(Math.random() * 10 + 5); // 5-15 XP per fighter
      
      setSyncStatus("done");
      setSelectionMessage(`Successfully synced ${course?.title}! All fighters gained ${xpGained} XP.`);
      
      setTimeout(() => {
        setSyncStatus("idle");
        setSelectionMessage(null);
      }, 3000);
    } catch (error) {
      setSyncStatus("idle");
      setSelectionMessage("Failed to sync meditation training. Please try again.");
    }
  };

  const handleYogaSync = async () => {
    // Reference: squad.unbound.games-yoga.html - yoga sync logic
    if (syncStatus === "syncing") return;
    
    if (!selectedCourse) {
      setSelectionMessage("Please select a yoga course first.");
      return;
    }
    
    if (videoTimer !== null && videoTimer > 0) {
      setSelectionMessage("Please complete the course video before syncing.");
      return;
    }
    
    if (!activeFighter?.isOwned) {
      setSelectionMessage(`Please set an active ${hasHellraiserNFTs ? "Hellraiser" : "fighter"} before syncing.`);
      return;
    }
    
    if (!selectionConfirmed || selectedMethod !== "yoga") {
      setSelectionMessage("Please confirm your yoga selection in Step 2 first.");
      return;
    }
    
    setSyncStatus("syncing");
    setSelectionMessage("Syncing yoga training progress for all fighters...");
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate yoga sync - trains all fighters
      const course = yogaCourses.find(c => c.id === selectedCourse);
      const xpGained = Math.floor(Math.random() * 10 + 5); // 5-15 XP per fighter
      
      setSyncStatus("done");
      setSelectionMessage(`Successfully synced ${course?.title}! All fighters gained ${xpGained} XP.`);
      
      setTimeout(() => {
        setSyncStatus("idle");
        setSelectionMessage(null);
      }, 3000);
    } catch (error) {
      setSyncStatus("idle");
      setSelectionMessage("Failed to sync yoga training. Please try again.");
    }
  };

  const handleSync = async () => {
    // Route to appropriate sync handler based on selected method
    if (selectedMethod === "meditation") {
      return handleMeditationSync();
    } else if (selectedMethod === "yoga") {
      return handleYogaSync();
    }
    
    // Reference: squad.unbound.games-strava.html - fourth section sync button
    if (syncStatus === "syncing") return;
    
    if (!stravaConnected) {
      setSelectionMessage("Please connect Strava in Step 2 to enable syncing.");
      return;
    }
    
    if (syncsRemaining <= 0) {
      setSelectionMessage("You have reached your daily sync limit. Please try again tomorrow.");
      return;
    }
    
    if (!activeFighter?.isOwned) {
      setSelectionMessage(`Please set an active ${hasHellraiserNFTs ? "Hellraiser" : "fighter"} before syncing.`);
      return;
    }
    
    if (!selectionConfirmed || selectedMethod !== "strava") {
      setSelectionMessage("Please confirm your Strava selection in Step 2 first.");
      return;
    }
    
    setSyncStatus("syncing");
    setSelectionMessage("Syncing Strava training progress...");
    
    try {
      // In a real implementation, this would call your backend API
      // which would use the Strava access token to fetch activities
      // For now, we'll simulate the sync process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate distance sync (in real app, this would come from Strava API)
      // The distance would be calculated from recent Strava activities
      const syncedDistance = Math.random() * 5 + 1; // 1-6 km (simulated)
      
      // Update distances
      setCurrentDistance(prev => {
        const newDistance = Math.min(prev + syncedDistance, 20); // Max 20 km per fighter
        return newDistance;
      });
      
      setCycleTotalDistance(prev => prev + syncedDistance);
      const newSyncsRemaining = Math.max(0, syncsRemaining - 1);
      setSyncsRemaining(newSyncsRemaining);
      
      // Persist updated syncs remaining
      if (typeof window !== "undefined") {
        localStorage.setItem("syncs_remaining", newSyncsRemaining.toString());
      }
      
      // Calculate sync result (in real app, this would come from API)
      // For now, simulate: if no new activity, show 0 deltas
      const hasNewActivity = syncedDistance > 0.1; // Threshold for "new activity"
      const enduranceDelta = hasNewActivity ? Math.round(syncedDistance * 0.5) : 0;
      const levelDelta = hasNewActivity ? Math.floor(syncedDistance / 5) : 0;
      
      setSyncResult({
        distance: hasNewActivity ? syncedDistance : 0,
        enduranceDelta,
        levelDelta,
      });
      
      setSyncStatus("done");
      
      // Show popup after sync completes
      setShowSyncPopup(true);
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("idle");
      setSelectionMessage("Failed to sync with Strava. Please try again.");
      setTimeout(() => {
        setSelectionMessage(null);
      }, 3000);
    }
  };

  const getStepState = (index: number): "done" | "active" | "pending" => {
    if (!stravaConnected) return "pending";
    if (syncStatus === "done") return "done";
    if (syncStatus === "idle") {
      return index === 0 ? "done" : "pending";
    }
    // syncing
    if (index === 0) return "done";
    if (index === 1) return "active";
    return "pending";
  };

  if (!walletConnected) {
    return (
      <main style={{ backgroundColor: "#202020", color: "white", minHeight: "100vh" }}>
        <div className="index_wrapper__epjO8">
          <Image
            src="/assets/logo.png"
            alt="Fighters Unbound logo"
            width={200}
            height={200}
          />
          
          {/* Welcome Video - Center Section */}
          <div className="w-full max-w-4xl mx-auto my-8 rounded-lg overflow-hidden shadow-2xl relative">
            <video
              autoPlay
              loop
              muted
              playsInline
              className={`w-full h-auto transition-opacity duration-500 ${
                videoFadeOut ? "opacity-0" : "opacity-100"
              }`}
              controls
              controlsList="nodownload"
              onTimeUpdate={(e) => {
                const video = e.currentTarget;
                const fadeOutTime = 2; // Start fading 2 seconds before end
                if (video.duration && video.currentTime >= video.duration - fadeOutTime) {
                  setVideoFadeOut(true);
                } else if (videoFadeOut && video.currentTime < video.duration - fadeOutTime) {
                  setVideoFadeOut(false);
                }
              }}
              onLoadedMetadata={(e) => {
                // Reset fade state when video metadata loads
                setVideoFadeOut(false);
              }}
            >
              <source src="/assets/welcome.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          
          {renderConnectButtons()}
          <p className="index_connect_text__MfK9o">
            Connect your wallet to view your {isLoadingHellraiser ? "NFTs" : hasHellraiserNFTs ? "Hellraisers" : "Fighters"}
          </p>
        </div>
      </main>
    );
  }

  // Welcome Back Screen - Show when wallet is connected
  const displayName = userProfile?.username || (walletConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null) || "User";
  const displayAvatar = userProfile?.avatar;

  return (
    <main style={{ backgroundColor: "#202020", color: "white" }}>
      {/* Welcome Back Banner */}
      {walletConnected && !isLoadingProfile && (
        <div
          style={{
            backgroundColor: "#2a2a2a",
            borderBottom: "2px solid #333",
            padding: "1rem 2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            animation: "slideDown 0.3s ease-out",
            paddingTop: "30px",
          }}
          className="welcome-banner"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "2px solid #d34836",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#1a1a1a",
                flexShrink: 0,
              }}
            >
              {displayAvatar ? (
                <img
                  src={displayAvatar}
                  alt="Avatar"
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div style={{ fontSize: "1.5rem" }}>👤</div>
              )}
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: "600", marginBottom: "0.25rem" }}>
                Welcome Back{displayName !== "User" ? `, ${displayName}` : ""}!
              </div>
              <div style={{ fontSize: "0.85rem", color: "#999" }}>
                Ready to train your {hasHellraiserNFTs ? "Hellraisers" : "Fighters"}?
              </div>
            </div>
          </div>
          <Link
            href="/profile"
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#d34836",
              color: "white",
              borderRadius: "6px",
              textDecoration: "none",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "transform 0.2s, opacity 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Edit Profile
          </Link>
        </div>
      )}

      <div className="index_outer__GPFu3">
        <div
          className={`sidemenu_container__awJ5O ${
            isMenuCollapsed ? "sidemenu_collapsed__6CvqR" : ""
          }`}
        >
          <button
            className="sidemenu_toggleButton__y__f8"
            type="button"
            onClick={() => setIsMenuCollapsed((prev) => !prev)}
          >
            {isMenuCollapsed ? "→" : "←"}
          </button>
          {sideMenu.map((item, index) => (
            <a key={item.id} href={`#${item.id}`} className="sidemenu_link__ax8_1">
              <button
                type="button"
                onClick={() => setActiveSection(item.id)}
                className={`sidemenu_button__PBtjJ ${
                  activeSection === item.id ? "sidemenu_active__IIi8d" : ""
                }`}
              >
                <span className="sidemenu_circle__o5fCj">{index + 1}</span>
                <span className={`sidemenu_label__text ${isMenuCollapsed ? "sidemenu_label_hidden__xyz" : ""}`}>{item.label}</span>
              </button>
            </a>
          ))}
        </div>

        <section id="first-section" className="index_wrapper2__a74H5">
          <div>
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
              <Image width={200} height={200} src="/assets/logo.png" alt={hasHellraiserNFTs ? "Hellraiser NFT" : "Fighters Unbound logo"} />
            </div>
            {isLoadingHellraiser ? (
              <div className="carousel_counttext__HSuku">Loading NFTs...</div>
            ) : (
              <>
                <div className="carousel_counttext__HSuku">
                  {hellraiserBalance > 0 ? (
                    `You own ${hellraiserBalance} Fighters `
                  ) : (
                    hasHellraiserNFTs ? (
                      <>
                        {ownedCount > 0 ? `You own ${ownedCount} Hellraiser${ownedCount === 1 ? "" : "s"}` : "Hellraiser NFT"}
                      </>
                    ) : (
                      `You own ${ownedCount} Fighters `
                    )
                  )}
                </div>
                <div className="carousel_greytext__pUltm">
                  {hellraiserBalance > 0 ? (
                    `Full Set Progress : ${hellraiserBalance} / 52 `
                  ) : (
                    hasHellraiserNFTs ? (
                      `Hellraiser Collection: ${ownedCount} owned`
                    ) : (
                      `Full Set Progress : ${ownedCount} / 52 `
                    )
                  )}
                </div>
              </>
            )}
            {!isLoadingHellraiser && (
              <div className="carousel_secondary_button__vD1B9">
                <a href="https://mintify.xyz/launchpad/fightersunbound" target="_blank" rel="noopener noreferrer">
                  <Image className="carousel_mintIcon__NuCvr" src="/assets/mintify.jpeg" alt="Mintify" width={24} height={24} />
                  Buy Fighters
                </a>
              </div>
            )}
            {availableCards.length > 0 && activeFighter && (
              <div className="carousel_carouselContainer__kIQw9">
                <div className="carousel_carousel__PxPRp">
                  <button
                    type="button"
                    className="carousel_arrow__HHMhv"
                    onClick={() => handleCarousel("prev")}
                    aria-label="Previous fighter"
                    disabled={availableCards.length <= 1}
                  >
                    ❮
                  </button>
                  <div className="carousel_cards__pPGpU">
                    <div className={`carousel_card__AIxvR carousel_active__w_ftY ${isShowingEmptyState ? "carousel_blurred___7NQ3" : ""}`}>
                      <img
                        className={`carousel_nftimage__9S5Yc ${isShowingEmptyState ? "carousel_blurred___7NQ3" : ""}`}
                        alt="NFT"
                        src={activeFighter.image || "/assets/defaultnft.png"}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          if (!target.src.includes("defaultnft.png")) {
                            target.src = "/assets/defaultnft.png";
                          }
                        }}
                      />
                      <div className="carousel_nftname__Ayk6W">{activeFighter.name || "Unknown"}</div>
                      <div className="carousel_nftcreator__oJPL7">
                        {activeFighter.creator || "Unknown"}
                      </div>
                      <div className="carousel_info__PnV4W">
                        <span># {isShowingEmptyState ? "" : (activeFighter.id?.replace("#", "") || "000")}</span>
                        <span>Lv {isShowingEmptyState ? "" : (activeFighter.level || "0")}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="carousel_arrow__HHMhv"
                    onClick={() => handleCarousel("next")}
                    aria-label="Next fighter"
                    disabled={availableCards.length <= 1}
                  >
                    ❯
                  </button>
                </div>
                {/* Attributes Grid - Display NFT attributes with progress bars */}
                {/* Reference: squad.unbound.games-noNFT.html - attributes grid not shown when no NFTs */}
                {!isShowingEmptyState && (
                  numericAttributes.length > 0 ? (
                    <div className="carousel_attributesGrid__H19vs">
                      {numericAttributes.map((attr, index) => (
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
                  ) : (
                    // Fallback: show all 12 attributes with default values if no attributes found
                    <div className="carousel_attributesGrid__H19vs">
                      {attributeOptions.map((attr) => {
                        // Map attribute IDs to default values (matching reference HTML)
                        const defaultValues: Record<string, number> = {
                          punch: 92,
                          endurance: 85,
                          speed: 83,
                          defense: 66,
                          technique: 73,
                          mental: 84,
                          intelligence: 88,
                          charisma: 91,
                          stealth: 84,
                          leadership: 90,
                          agility: 86,
                          luck: 89,
                        };
                        const value = defaultValues[attr.id] || 0;
                        return (
                          <div key={attr.id} className="carousel_attributeRow__XoXwZ">
                            <span className="carousel_attributeName__OZ9_Y">
                              {attr.title.toLowerCase()}: {value} 
                            </span>
                            <div className="carousel_progressBar__WWysV">
                              <div 
                                className="carousel_progress__0SBp_" 
                                style={{ width: `${value}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )
                )}
                <div className="carousel_text__gIzW1">  Step 1: Set {isShowingEmptyState ? "" : (activeFighter?.name?.toUpperCase() || (hasHellraiserNFTs ? "HELLRAISER" : "FIGHTER"))} as active fighter, sign message below</div>
                {selectionMessage && (
                  <div className="sign_errormsg2__A7OL_" style={{ marginBottom: "20px" }}>{selectionMessage}</div>
                )}
                <form>
                  <div>
                    <button
                      type="button"
                      onClick={handleConfirm}
                      disabled={confirmDisabled}
                      className="sign_submit_button__AnUC1"
                    >
                      CONFIRM
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

        <section id="second-section" className="index_wrapper2__a74H5">
          <div className="attributeselect_container__rmxCO">
            <Image width={200} height={200} src="/assets/logo.png" alt="Training logo" />
            <h1 className="attributeselect_title__HzU4F">Select Training Method</h1>
            <p className="attributeselect_subtitle__TGHPj">
              Please select from the three training options
            </p>
            {/* Reference: squad.unbound.games-noNFT.html - second section shows all attributes and training methods even when no NFTs */}
            <div className="attributeselect_attributesGrid__lwVep">
              {attributeOptions.map((attribute) => (
                <div
                  key={attribute.id}
                  className={`attributeselect_attributeCard__qYQrc ${
                    selectedAttribute === attribute.id
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
              ))}
            </div>
            <div className="attributeselect_trainingMethodsContainer__FGBUC">
              <h2 className="attributeselect_trainingTitle__i9dX5">
                Training Methods
              </h2>
              <div className="attributeselect_trainingMethods__x5qtS">
                {trainingMethods.map((method) => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => {
                      setSelectedMethod(method.id);
                      // Reset confirmation and course selection when method changes
                      if (method.id !== selectedMethod) {
                        setSelectionConfirmed(false);
                        setSelectedCourse(null);
                        setVideoTimer(null);
                        setIsVideoPaused(false);
                        setSelectedCourse(null);
                        setVideoTimer(null);
                        setIsVideoPaused(false);
                      }
                    }}
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
            {selectionMessage && (
              <div className="attributeselect_successMessage___Svfu" style={{ marginBottom: "20px" }}>
                {selectionMessage}
              </div>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={confirmDisabled}
              className="attributeselect_confirmButton__WmxNu"
            >
              Confirm Selection
            </button>
          </div>
        </section>

        <section id="third-section" className="index_wrapper3__A9vvd" style={{ margin: 0, padding: 0 }}>
          {/* Reference: squad.unbound.games-noNFT.html - third section shows error when no fighter set or no NFTs */}
          {availableCards.length > 0 && activeFighter && !isShowingEmptyState && activeFighter.isOwned ? (
            <div className="fighterdisplay_wrapper__q5JIV" style={{ backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", minHeight: "100vh" }}>
              <div className="fighterdisplay_imageBarLeft__ECvHX"></div>
              <div className="fighterdisplay_background__tOjhW">
                <div className="fighterdisplay_container__rLuu4">
                  <div className="fighterdisplay_left__d1S_v">
                    <img
                      alt={activeFighter.name || "Fighter"}
                      className="fighterdisplay_image__bwaQS"
                      src={activeFighter.image || "/assets/defaultnft.png"}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (!target.src.includes("defaultnft.png")) {
                          target.src = "/assets/defaultnft.png";
                        }
                      }}
                    />
                    YOUR CHOSEN FIGHTER
                  </div>
                  <div className="fighterdisplay_infoContainer__QH0Nt">
                    <div className="fighterdisplay_header__J7q6o">
                      <div className="fighterdisplay_levelCircle__WymYf">{activeFighter.level || "0"}</div>
                      <div className="fighterdisplay_nameContainer__Eestk">
                        <div className="fighterdisplay_name__fmw1j">{activeFighter.name?.toUpperCase() || "UNKNOWN"}</div>
                        <div className="fighterdisplay_miniLevel__dSxVK">Level: {activeFighter.level || "0"}</div>
                      </div>
                    </div>
                    <div className="fighterdisplay_statsContainer__CTHxE">
                      {numericAttributes.length > 0 ? (
                        numericAttributes.map((attr, index) => (
                          <div key={index} className="fighterdisplay_stat__ntomZ">
                            <div className="fighterdisplay_statBar__oHh4v">
                              <div 
                                className="fighterdisplay_statFill__chn8I" 
                                style={{ width: `${attr.value}%` }}
                              />
                              <span className="fighterdisplay_statName__VE87k">{attr.name.toLowerCase()}</span>
                            </div>
                            <span className="fighterdisplay_statText__9cAK1">{attr.value}</span>
                          </div>
                        ))
                      ) : (
                        // Fallback: show all 12 attributes with default values if no attributes found
                        attributeOptions.map((attr) => {
                          // Map attribute IDs to default values (matching reference HTML)
                          const defaultValues: Record<string, number> = {
                            punch: 92,
                            endurance: 85,
                            speed: 83,
                            defense: 66,
                            technique: 73,
                            mental: 84,
                            intelligence: 88,
                            charisma: 91,
                            stealth: 84,
                            leadership: 90,
                            agility: 86,
                            luck: 89,
                          };
                          const value = defaultValues[attr.id] || 0;
                          return (
                            <div key={attr.id} className="fighterdisplay_stat__ntomZ">
                              <div className="fighterdisplay_statBar__oHh4v">
                                <div 
                                  className="fighterdisplay_statFill__chn8I" 
                                  style={{ width: `${value}%` }}
                                />
                                <span className="fighterdisplay_statName__VE87k">{attr.title.toLowerCase()}</span>
                              </div>
                              <span className="fighterdisplay_statText__9cAK1">{value}</span>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
                <div className="strava_container__qvP8U">
                  <div className="strava_info__4tOFg">Step 2.Connect with Strava to start training (Check Both Boxes ✅)</div>
                  <a
                    href={`https://www.strava.com/oauth/authorize?client_id=151081&response_type=code&redirect_uri=${encodeURIComponent(stravaRedirectUri)}&approval_prompt=force&scope=read,activity:read_all`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      className="strava_connectButton__LTkhf"
                      alt="Connect with Strava"
                      src="/assets/btn_strava_connect_with_orange_x2.png"
                    />
                  </a>
                </div>
                <div className="fighterdisplay_squaretext__xkfDf">Strava linked to @dillon_marszalek! You&apos;re ready for training</div>
              </div>
              <div className="fighterdisplay_imageBarRight__h36Ad"></div>
            </div>
          ) : (
            // Reference: squad.unbound.games-noNFT.html - third section shows error when no fighter set
            // CSS class fighterdisplay_wrapper__q5JIV already defines background from squad.css
            <div className="fighterdisplay_wrapper__q5JIV" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0 }}>
              <span className="fighterdisplay_error_text__3Oc7Y" style={{ color: "black" }}>
                Please set your {hasHellraiserNFTs ? "Hellraiser" : "fighter"} first
              </span>
            </div>
          )}
        </section>

        <section id="fourth-section" className="index_wrapper3__A9vvd" style={{ margin: 0, padding: 0, marginTop: 0 }}>
          {/* Reference: squad.unbound.games-strava.html - fourth section shows Strava sync interface when Strava is selected and confirmed */}
          {availableCards.length > 0 && activeFighter && !isShowingEmptyState && activeFighter.isOwned ? (
            // Show Strava sync interface if Strava is selected and confirmed (connection happens in third section)
            selectionConfirmed && selectedMethod === "strava" ? (
              <div className="training_wrapper__ue0tT" style={{ backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", minHeight: "100vh" }}>
                <div className="training_imageBarLeft__i1otq"></div>
                <div className="training_background__6Eue6">
                  <div className="training_container__10ZOQ">
                    <div className="training_title__rrq5E">Training Progress</div>
                    <div className="training_countdown__qtVUh">
                      Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </div>
                    
                    {/* Progress Ring - Reference: squad.unbound.games-strava.html
                        Reference HTML shows:
                        - Background circle: stroke-dashoffset="117.80972450961724" at 0km (shows 75% of circle = remaining 20km capacity)
                        - Filled circle: stroke-dashoffset="471.23889803846896" at 0km (fully offset, 0% visible)
                        - Circumference: 471.23889803846896 (2 * π * 75)
                        - Max distance: 20 km per fighter
                        - When distance increases, background offset increases (less visible), filled offset decreases (more visible)
                    */}
                    <div className="training_ringOuter__D8pMH">
                      <svg className="training_ringWrapper__jGkJZ" width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                        {/* Background circle (white) - shows remaining unfilled portion
                            At 0km: offset = 117.80972450961724 (75% of circle visible, showing 20km capacity)
                            At 20km: offset = 471.23889803846896 (0% visible, capacity exhausted)
                            Formula: offset = 117.80972450961724 + (471.23889803846896 - 117.80972450961724) * (distance / 20)
                        */}
                        <circle 
                          className="training_backgroundCircle__pg49G" 
                          cx="100" 
                          cy="100" 
                          r="75" 
                          stroke="white" 
                          strokeWidth="20" 
                          strokeDasharray="471.23889803846896" 
                          strokeDashoffset={117.80972450961724 + (471.23889803846896 - 117.80972450961724) * Math.min(currentDistance / 20, 1)} 
                          fill="transparent" 
                          transform="rotate(136, 100 100)"
                        />
                        {/* Additional circle (green) - always fully offset (not visible)
                            This appears to be a placeholder or future feature indicator
                        */}
                        <circle 
                          className="training_additionalCircle__2Bj5_" 
                          cx="100" 
                          cy="100" 
                          r="75" 
                          stroke="rgb(153, 210, 154)" 
                          strokeWidth="20" 
                          strokeDasharray="471.23889803846896" 
                          strokeDashoffset="471.23889803846896" 
                          fill="transparent" 
                          transform="rotate(136 100 100)"
                        />
                        {/* Filled circle (red) - shows progress
                            At 0km: offset = 471.23889803846896 (fully offset, 0% visible)
                            At 20km: offset = 0 (fully visible, 100% progress)
                            Formula: offset = 471.23889803846896 * (1 - distance / 20)
                        */}
                        <circle 
                          className="training_filledCircle__jlsYS" 
                          cx="100" 
                          cy="100" 
                          r="75" 
                          stroke="rgb(211,72,55)" 
                          strokeWidth="20" 
                          strokeDasharray="471.23889803846896" 
                          strokeDashoffset={471.23889803846896 * (1 - Math.min(currentDistance / 20, 1))} 
                          fill="transparent" 
                          transform="rotate(136 100 100)"
                        />
                      </svg>
                      <div className="training_textInside__YqmOQ">
                        <div>{currentDistance === 0 ? "0 km" : `${currentDistance.toFixed(1)} km`}</div>
                      </div>
                      <div className="training_label__YtIP4">
                        <div>Current Fighter <br /> Progress</div>
                        <div className="training_additionalText__kMCTO">Max 20 km / Fighter</div>
                      </div>
                    </div>

                    {/* Stats Container */}
                    <div className="training_stats_container__VUOF2">
                      <div className="training_stats_item__g5a7h">
                        <div className="training_stats_label__KynNX">Current Cycle Total Distance</div>
                        <div className="training_stats_value__rtvqF">{cycleTotalDistance === 0 ? "0 km" : `${cycleTotalDistance.toFixed(1)} km`}</div>
                      </div>
                    </div>

                    <div className="training_text__jtxs3"> Step 3. Sync your Strava Training Progress to train your fighter</div>
                    
                    {selectionMessage && (
                      <div 
                        className={selectionMessage.includes("error") || selectionMessage.includes("Please") || selectionMessage.includes("limit") 
                          ? "attributeselect_errorMessage__GU7Gb" 
                          : "attributeselect_successMessage___Svfu"} 
                        style={{ marginBottom: "15px", marginTop: "10px" }}
                      >
                        {selectionMessage}
                      </div>
                    )}
                    
                    <button 
                      type="button"
                      className="training_submit_button__ZUO_d" 
                      disabled={syncStatus === "syncing"}
                      onClick={handleSync}
                      style={{ 
                        cursor: syncStatus === "syncing" ? "not-allowed" : "pointer",
                        opacity: (!stravaConnected || syncStatus === "syncing" || syncsRemaining <= 0) ? 0.6 : 1
                      }}
                    >
                      {syncStatus === "syncing" ? "Syncing..." : "Sync"}
                    </button>
                    <div className="training_text2__A03Zs">You have [{syncsRemaining}/20] Syncs Left Today</div>
                    
                    <div className="training_button_container__Jrzt8">
                      <div className="training_mini_button__6BqJv">Training History</div>
                      <div className="training_mini_button__6BqJv">
                        <a href="https://www.strava.com/dashboard" target="_blank" rel="noopener noreferrer">View In Strava</a>
                      </div>
                    </div>
                    <div className="training_mini_button__6BqJv">
                      <a href="https://squad.unbound.games/leaderboard" target="_blank" rel="noopener noreferrer">Leaderboard</a>
                    </div>
                    <div className="training_minitext__IsBbW">Metadata will be updated at later stage of the cycle</div>
                    <img className="training_logo__ymGj_" src="/assets/api_logo_pwrdBy_strava_horiz_white.png" alt="Powered by Strava" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  </div>
                </div>
                <div className="training_imageBarRight__6Aemi"></div>
              </div>
            ) : selectedMethod === "meditation" && selectionConfirmed ? (
              // Show meditation training interface when meditation is selected and confirmed
              <div className="training_wrapper__ue0tT" style={{ backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", minHeight: "100vh" }}>
                <div className="training_imageBarLeft__i1otq"></div>
                <div className="training_background__6Eue6">
                  <div className="training_container__10ZOQ">
                    <div className="training_title__rrq5E">🧘‍♂️ Meditation Training Progress</div>
                    <div className="training_countdown__qtVUh">
                      Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </div>
                    <div className="training_section__B2pSK">
                      <h3 className="training_sectionTitle__uwUa1">📚 Select Your Meditation Course:</h3>
                      <div className="training_courseGrid__1HYAd">
                        {meditationCourses.map((course) => (
                          <div
                            key={course.id}
                            className={`training_courseCard__pvglP ${selectedCourse === course.id ? "training_selectedCourse__1Hb2s" : ""}`}
                            data-type="meditation"
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setVideoTimer(course.timer); // Use course-specific timer
                              setIsVideoPaused(false);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="training_courseIcon__uC5wT">
                              <img alt="Meditation" className="training_meditationIcon__qamYw" src="/assets/meditation.png" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <div className="training_courseTitle__YfHQq">{course.title}</div>
                            <div className="training_courseSubtitle__jkZQS">{course.subtitle}</div>
                            <div className="training_courseLogo__PdStf">
                              <img alt="Fighters Unbound" className="training_fightersLogo__5S34x" src="/assets/logo.png" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedCourse && (
                      <div className="training_section__B2pSK">
                        <h3 className="training_sectionTitle__uwUa1">Course Video</h3>
                        <div className="training_videoContainer__dH5X2">
                          <div id="meditation-video-player-container" key={`meditation-container-${selectedCourse}`}>
                            <iframe
                              key={`meditation-${selectedCourse}`}
                              id="meditation-video-player"
                              frameBorder="0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              title={`Meditation ${meditationCourses.find(c => c.id === selectedCourse)?.title}: ${meditationCourses.find(c => c.id === selectedCourse)?.subtitle}`}
                              width="100%"
                              height="300px"
                              src={`https://www.youtube.com/embed/${meditationCourses.find(c => c.id === selectedCourse)?.videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&loop=0&fs=0&cc_load_policy=0&cc_lang_pref=en&hl=en&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}&widgetid=${(selectedCourse || 1) + 8}&forigin=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}&aoriginsup=1&vf=6`}
                            />
                            {videoTimer !== null && (
                              <div className="training_videoTimer__a5fFn">
                                <div className="training_timerLabel__z6NdA">Questions in:</div>
                                <div className="training_timerDisplay__GlUeK">
                                  {Math.floor(videoTimer / 60)}:{(videoTimer % 60).toString().padStart(2, "0")}
                                  {isVideoPaused && <span className="training_timerPaused__JqqQJ"> ⏸️ Paused</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectionMessage && selectedMethod === "meditation" && (
                      <div className="training_section__B2pSK">
                        <div className={syncStatus === "done" ? "training_successMessage__E88J1" : "training_errorMessage__sBcKq"} style={{ marginBottom: "20px" }}>
                          {selectionMessage}
                        </div>
                      </div>
                    )}
                    <div className="training_section__B2pSK">
                      <div className="training_text__jtxs3">Step 3. Complete a meditation course and answer questions to train <b>all your fighters</b></div>
                      <button 
                        className="training_submit_button__ZUO_d" 
                        disabled={!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing"}
                        onClick={handleMeditationSync}
                        style={{ 
                          cursor: (!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing") ? "not-allowed" : "pointer",
                          opacity: (!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing") ? 0.6 : 1
                        }}
                      >
                        {syncStatus === "syncing" ? "Syncing..." : "Sync For All Fighters"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="training_imageBarRight__6Aemi"></div>
              </div>
            ) : selectedMethod === "yoga" && selectionConfirmed ? (
              // Show yoga training interface when yoga is selected and confirmed
              <div className="training_wrapper__ue0tT" style={{ backgroundImage: `url("https://storage.googleapis.com/fu-public-asset/background/18.jpg")`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", width: "100%", minHeight: "100vh" }}>
                <div className="training_imageBarLeft__i1otq"></div>
                <div className="training_background__6Eue6">
                  <div className="training_container__10ZOQ">
                    <div className="training_title__rrq5E">🧘‍♀️ Yoga Training Progress</div>
                    <div className="training_countdown__qtVUh">
                      Training Cycle #8 Ends In {countdown.days}d {countdown.hours}h {countdown.minutes}m {countdown.seconds}s
                    </div>
                    <div className="training_section__B2pSK">
                      <h3 className="training_sectionTitle__uwUa1">📚 Select Your Yoga Course:</h3>
                      <div className="training_courseGrid__1HYAd">
                        {yogaCourses.map((course) => (
                          <div
                            key={course.id}
                            className={`training_courseCard__pvglP ${selectedCourse === course.id ? "training_selectedCourse__1Hb2s" : ""}`}
                            data-type="yoga"
                            onClick={() => {
                              setSelectedCourse(course.id);
                              setVideoTimer(course.timer); // Use course-specific timer
                              setIsVideoPaused(false);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            <div className="training_courseIcon__uC5wT">
                              <img alt="Yoga" className="training_yogaIcon__LOKrU" src="/assets/yoga.png" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                            </div>
                            <div className="training_courseTitle__YfHQq">{course.title}</div>
                            <div className="training_courseSubtitle__jkZQS">{course.subtitle}</div>
                            <div className="training_courseLogo__PdStf">
                              <img alt="Fighters Unbound" className="training_fightersLogo__5S34x" src="/assets/logo.png" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    {selectedCourse && (
                      <div className="training_section__B2pSK">
                        <h3 className="training_sectionTitle__uwUa1">Course Video</h3>
                        <div className="training_videoContainer__dH5X2">
                          <div id="video-player-container" key={`yoga-container-${selectedCourse}`}>
                            <iframe
                              key={`yoga-${selectedCourse}`}
                              id="video-player"
                              frameBorder="0"
                              allowFullScreen
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              title={`Yoga with Vlada: ${yogaCourses.find(c => c.id === selectedCourse)?.title} – ${yogaCourses.find(c => c.id === selectedCourse)?.subtitle}`}
                              width="100%"
                              height="300px"
                              src={`https://www.youtube.com/embed/${yogaCourses.find(c => c.id === selectedCourse)?.videoId}?autoplay=0&controls=1&rel=0&showinfo=0&modestbranding=1&iv_load_policy=3&loop=0&fs=0&cc_load_policy=0&cc_lang_pref=en&hl=en&enablejsapi=1&origin=${typeof window !== "undefined" ? encodeURIComponent(window.location.origin) : ""}&widgetid=${(selectedCourse || 1) + 20}&forigin=${typeof window !== "undefined" ? encodeURIComponent(window.location.href) : ""}&aoriginsup=1&vf=4`}
                            />
                            {videoTimer !== null && (
                              <div className="training_videoTimer__a5fFn">
                                <div className="training_timerLabel__z6NdA">Questions in:</div>
                                <div className="training_timerDisplay__GlUeK">
                                  {Math.floor(videoTimer / 60)}:{(videoTimer % 60).toString().padStart(2, "0")}
                                  {isVideoPaused && <span className="training_timerPaused__JqqQJ"> ⏸️ Paused</span>}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {selectionMessage && selectedMethod === "yoga" && (
                      <div className="training_section__B2pSK">
                        <div className={syncStatus === "done" ? "training_successMessage__E88J1" : "training_errorMessage__sBcKq"} style={{ marginBottom: "20px" }}>
                          {selectionMessage}
                        </div>
                      </div>
                    )}
                    <div className="training_section__B2pSK">
                      <div className="training_text__jtxs3">Step 3. Complete a yoga course and answer questions to train <b>all your fighters</b></div>
                      <button 
                        className="training_submit_button__ZUO_d" 
                        disabled={!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing"}
                        onClick={handleYogaSync}
                        style={{ 
                          cursor: (!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing") ? "not-allowed" : "pointer",
                          opacity: (!selectedCourse || (videoTimer !== null && videoTimer > 0) || syncStatus === "syncing") ? 0.6 : 1
                        }}
                      >
                        {syncStatus === "syncing" ? "Syncing..." : "Sync For All Fighters"}
                      </button>
                    </div>
                  </div>
                </div>
                <div className="training_imageBarRight__6Aemi"></div>
              </div>
            ) : (
              // Default message when no training method is selected
              <div className="training_wrapper__ue0tT" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0, marginTop: 0 }}>
                <span className="training_error_text__2Mxa8" style={{ color: "black" }}>
                  Please select a training method in Step 2
                </span>
              </div>
            )
          ) : (
            // Reference: squad.unbound.games-noNFT.html - fourth section shows error when no fighter set
            <div className="training_wrapper__ue0tT" style={{ width: "100%", minHeight: "100vh", margin: 0, padding: 0, marginTop: 0 }}>
              <span className="training_error_text__2Mxa8" style={{ color: "black" }}>
                Please set your {hasHellraiserNFTs ? "Hellraiser" : "fighter"} first
              </span>
            </div>
          )}
        </section>

        {/* Sync Popup */}
        {showSyncPopup && syncResult !== null && (
          <div className="training_popup2_overlay__aTZaR">
            <div className="training_popup2_popup__ySQBi">
              <h2 className="training_popup2_title__sHkW2">
                Synced! No new activity detected
              </h2>
              
              <div className="training_popup2_fighter__VqV3O">
                <img 
                  alt={activeFighter.name || "Fighter"} 
                  className="training_popup2_image__f_4Oz" 
                  src={activeFighter.image || "/assets/defaultnft.png"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("defaultnft.png")) {
                      target.src = "/assets/defaultnft.png";
                    }
                  }}
                />
                <div className="training_popup2_nameContainer__ByiCj">
                  <div className="training_popup2_name__GZbQm">
                    {activeFighter.name?.toUpperCase() || "UNKNOWN"}
                  </div>
                </div>
              </div>
            
              <p className="training_popup2_subtitle__DMb9E">Trainable Skill</p>
              
              <div className="training_popup2_progressBarContainer__u21vO">
                <div className="training_popup2_progressBar__IiPqH">
                  {(() => {
                    const selectedAttr = attributeOptions.find(a => a.id === selectedAttribute);
                    const currentAttr = numericAttributes.find(a => a.name.toLowerCase() === selectedAttribute.toLowerCase());
                    const currentValue = currentAttr?.value || 85;
                    const emoji = selectedAttr?.emoji || "🔋";
                    const attrName = selectedAttr?.title || "Endurance";
                    
                    return (
                      <>
                        <div 
                          className="training_popup2_lastEndurance__5uSX_" 
                          style={{ width: `${currentValue}%` }}
                        >
                          {emoji} {attrName} : {currentValue} (+ {syncResult.enduranceDelta})
                        </div>
                        <div 
                          className="training_popup2_enduranceDelta__nzK8A" 
                          style={{ width: `${syncResult.enduranceDelta}%` }}
                        />
                        <div 
                          className="training_popup2_maxMarker__bEW3q" 
                          style={{ left: "100%" }}
                        />
                      </>
                    );
                  })()}
                </div>
              </div>
              
              <p className="training_popup2_subtitle__DMb9E">Last Session</p>
              
              <ul className="training_popup2_statsList__BIlFW">
                <li>
                  Endurance:
                  <span className="training_greentext__mRZOS">+ {syncResult.enduranceDelta}</span>
                </li>
                <li>
                  Distance:
                  <span className="training_greentext__mRZOS">+ {syncResult.distance.toFixed(1)} km</span>
                </li>
                <li>
                  Level:
                  <span className="training_greentext__mRZOS">+ {syncResult.levelDelta}</span>
                </li>
              </ul>
              
              <div className="training_shareButtonList__xScJ7">
                <button 
                  className="training_shareButton__7aUVX training_twitter_icon__adOYY"
                  onClick={() => {
                    const fighterName = activeFighter.name?.toUpperCase() || "FIGHTER";
                    const distance = syncResult.distance.toFixed(1);
                    const endurance = syncResult.enduranceDelta >= 0 ? `+${syncResult.enduranceDelta}` : `${syncResult.enduranceDelta}`;
                    const text = `I've just upgraded my fighter : ${fighterName}\nDistance: ${distance} km 🥇\nEndurance: ${endurance} 🔋\nGet your Unbound Fighters Here https://www.unbound.games/`;
                    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank");
                  }}
                />
                <button 
                  className="training_shareButton__7aUVX training_wrapcast_icon__FNYq_"
                  onClick={() => {
                    const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
                    // Warpcast (Farcaster) share URL
                    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank");
                  }}
                />
                <button 
                  className="training_shareButton__7aUVX training_telegram_icon__aO2RH"
                  onClick={() => {
                    const text = `Just synced ${syncResult.distance.toFixed(1)} km with ${activeFighter.name}!`;
                    const url = `https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(text)}`;
                    window.open(url, "_blank");
                  }}
                />
              </div>
              
              <button 
                className="training_closeButton__e_l3I" 
                onClick={() => {
                  setShowSyncPopup(false);
                  setSyncStatus("idle");
                  setSelectionMessage(null);
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={
      <main style={{ backgroundColor: "#202020", color: "white", minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
        <div>Loading...</div>
      </main>
    }>
      <HomeContent />
    </Suspense>
  );
}

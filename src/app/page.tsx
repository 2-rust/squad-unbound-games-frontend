"use client";

import { useEffect, useMemo, useState, Suspense, useCallback } from "react";
import { useAccount } from "wagmi";
import { useSearchParams } from "next/navigation";
import { useHellraiserNFTs } from "@/hooks/useHellraiserNFTs";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { FighterCard, NumericAttribute } from "@/types";
import { 
  STRAVA_CONNECTION_VALIDITY_DAYS, 
  DEFAULT_SYNCS_REMAINING, 
  DEFAULT_APP_URL,
  DEFAULT_ATTRIBUTE_VALUES,
  MAX_DISTANCE_PER_FIGHTER
} from "@/constants";
import { fighterCards, attributeOptions, trainingMethods, meditationCourses, yogaCourses } from "@/data";
import { getSideMenu } from "@/utils/side-menu";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import { WelcomeBanner } from "@/components/WelcomeBanner";
import { SideMenu } from "@/components/SideMenu";
import { FighterSelectionSection } from "@/components/FighterSelectionSection";
import { TrainingMethodSection } from "@/components/TrainingMethodSection";
import { StravaConnectionSection } from "@/components/StravaConnectionSection";
import { TrainingProgressSection } from "@/components/TrainingProgressSection";
import { SyncPopup } from "@/components/SyncPopup";

function HomeContent() {
  const [activeCard, setActiveCard] = useState(0);
  const [selectedAttribute] = useState(attributeOptions[0].id);
  const [selectedMethod, setSelectedMethod] = useState<"strava" | "meditation" | "yoga">("strava");
  
  // Get the app URL from environment variable or use current origin
  const appUrl = useMemo(
    () => process.env.NEXT_PUBLIC_APP_URL || 
      (typeof window !== "undefined" ? window.location.origin : DEFAULT_APP_URL),
    []
  );
  const stravaRedirectUri = useMemo(() => `${appUrl}/authorize`, [appUrl]);

  const getSelectedAttributesForMethod = useCallback((method: string): string[] => {
    if (method === "meditation") {
      return ["mental", "leadership"];
    }
    if (method === "yoga") {
      return ["mental", "agility"];
    }
    return [selectedAttribute];
  }, [selectedAttribute]);
  
  const selectedAttributesForCurrentMethod = useMemo(
    () => getSelectedAttributesForMethod(selectedMethod),
    [selectedMethod, getSelectedAttributesForMethod]
  );
  
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

  const sideMenu = useMemo(() => getSideMenu(hasHellraiserNFTs, selectedMethod), [hasHellraiserNFTs, selectedMethod]);
  const [activeSection, setActiveSection] = useState("first-section");
  const [selectionMessage, setSelectionMessage] = useState<string | null>(null);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "done">("idle");
  const [selectionConfirmed, setSelectionConfirmed] = useState(false);
  const [currentDistance, setCurrentDistance] = useState(0);
  const [cycleTotalDistance, setCycleTotalDistance] = useState(0);
  const [syncsRemaining, setSyncsRemaining] = useState(19);
  const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
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
  const [isFullscreen, setIsFullscreen] = useState(false);
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
    const stravaConnectedParam = searchParams?.get("strava_connected");
    const stravaErrorParam = searchParams?.get("strava_error");
    
    if (stravaConnectedParam === "true") {
      const stored = localStorage.getItem("strava_connected");
      if (stored === "true") {
        setStravaConnected(true);
        setSelectionMessage("Strava connected successfully! Latest run imported.");
        window.history.replaceState({}, "", window.location.pathname);
      }
    } else if (stravaErrorParam) {
      setStravaConnected(false);
      setSelectionMessage(`Strava connection failed: ${stravaErrorParam}`);
      localStorage.removeItem("strava_connected");
      window.history.replaceState({}, "", window.location.pathname);
    } else {
      const stored = localStorage.getItem("strava_connected");
      if (stored === "true") {
        const timestamp = localStorage.getItem("strava_connected_timestamp");
        if (timestamp) {
          const connectionTime = parseInt(timestamp, 10);
          const now = Date.now();
          const validityPeriod = STRAVA_CONNECTION_VALIDITY_DAYS * 24 * 60 * 60 * 1000;
          if (now - connectionTime < validityPeriod) {
            setStravaConnected(true);
          } else {
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
      
      const now = new Date();
      const today = now.toDateString();
      const lastReset = lastSyncReset ? new Date(lastSyncReset).toDateString() : null;
      
      if (storedDistance) {
        setCurrentDistance(parseFloat(storedDistance));
      }
      if (storedCycleDistance) {
        setCycleTotalDistance(parseFloat(storedCycleDistance));
      }
      
      if (lastReset !== today) {
        setSyncsRemaining(DEFAULT_SYNCS_REMAINING);
        localStorage.setItem("syncs_remaining", DEFAULT_SYNCS_REMAINING.toString());
        localStorage.setItem("last_sync_reset", now.toISOString());
      } else if (storedSyncsRemaining) {
        const syncs = parseInt(storedSyncsRemaining, 10);
        setSyncsRemaining(syncs);
      } else {
        setSyncsRemaining(DEFAULT_SYNCS_REMAINING);
        localStorage.setItem("syncs_remaining", DEFAULT_SYNCS_REMAINING.toString());
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

  // Use Hellraiser NFTs if available, otherwise use default fighter cards
  const availableCards = useMemo(() => {
    if (hasHellraiserNFTs && hellraiserNFTs.length > 0) {
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
      setActiveCard(0);
  }, [hasHellraiserNFTs, hellraiserNFTs.length]);

  const ownedCount = useMemo(() => {
    if (hasHellraiserNFTs) {
      return hellraiserNFTs.filter(nft => nft.isOwned).length;
    }
    return 0;
  }, [hasHellraiserNFTs, hellraiserNFTs]);

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

  const activeFighter: FighterCard = availableCards[activeCard] || availableCards[0] || {
    id: "#000",
    name: "Empty",
    creator: "You do not hold any NFT",
    level: "--",
    rarity: "Inactive",
    boost: "—",
    image: "/assets/defaultnft.png",
    isOwned: false,
  };
  
  const isShowingEmptyState = walletConnected && !isLoadingHellraiser && hellraiserBalance === 0 && !hasHellraiserNFTs;
  
  // Extract numeric attributes for display
  const numericAttributes = useMemo(() => {
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

    if (!activeFighter || !hasHellraiserNFTs) {
      return allAttributes.map(attr => ({
        name: attr.name,
        value: DEFAULT_ATTRIBUTE_VALUES[attr.id] || DEFAULT_ATTRIBUTE_VALUES[attr.name.toLowerCase()] || 0,
      }));
    }
    
    const activeNFT = hellraiserNFTs.find(nft => nft.tokenId === activeFighter.id);
    const metadataAttributes = activeNFT?.attributes || activeNFT?.rawMetadata?.attributes || [];
    
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
        const normalizedName = traitType
          .replace(/\s+/g, ' ')
          .replace(/mental\s*strength/i, 'mental strength')
          .replace(/mental/i, 'mental strength')
          .toLowerCase();
        
        attributeMap.set(normalizedName, numValue);
      }
    });
    
    return allAttributes.map(attr => {
      const lowerName = attr.name.toLowerCase();
      let value = attributeMap.get(lowerName);
      
      if (value === undefined) {
        if (lowerName === 'mental strength') {
          value = attributeMap.get('mental') || attributeMap.get('mentalstrength');
        }
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
        value: value !== undefined ? value : (DEFAULT_ATTRIBUTE_VALUES[attr.id] || DEFAULT_ATTRIBUTE_VALUES[attr.name.toLowerCase()] || 0),
      };
    });
  }, [activeFighter, hasHellraiserNFTs, hellraiserNFTs]);
  
  const handleCarousel = useCallback((direction: "next" | "prev") => {
    setActiveCard((prev) => {
      if (direction === "next") {
        return (prev + 1) % availableCards.length;
      }
      return (prev - 1 + availableCards.length) % availableCards.length;
    });
  }, [availableCards.length]);

  const confirmDisabled = useMemo(
    () => !activeFighter?.isOwned || !walletConnected,
    [activeFighter?.isOwned, walletConnected]
  );

  const handleConfirm = useCallback(() => {
    if (confirmDisabled) return;
    
    const method = trainingMethods.find((option) => option.id === selectedMethod);
    
    let message = "";
    
    if (selectedMethod === "meditation") {
      const mentalAttr = attributeOptions.find(opt => opt.id === "mental");
      const leadershipAttr = attributeOptions.find(opt => opt.id === "leadership");
      message = `${activeFighter.name} is now focusing on ${mentalAttr?.title} and ${leadershipAttr?.title} via ${method?.title}.`;
    } else if (selectedMethod === "yoga") {
      const mentalAttr = attributeOptions.find(opt => opt.id === "mental");
      const agilityAttr = attributeOptions.find(opt => opt.id === "agility");
      message = `${activeFighter.name} is now focusing on ${mentalAttr?.title} and ${agilityAttr?.title} via ${method?.title}.`;
    } else {
      const attribute = attributeOptions.find((option) => option.id === selectedAttribute);
      message = `${activeFighter.name} is now focusing on ${attribute?.title} via ${method?.title}.`;
    }

    setSelectionMessage(message);
    setSelectionConfirmed(true);
  }, [confirmDisabled, selectedMethod, activeFighter, selectedAttribute]);

  const handleMethodSelect = useCallback((methodId: string) => {
    setSelectedMethod(methodId as "strava" | "meditation" | "yoga");
    if (methodId !== selectedMethod) {
      setSelectionConfirmed(false);
      setSelectedCourse(null);
      setVideoTimer(null);
      setIsVideoPaused(false);
    }
  }, [selectedMethod]);

  const handleMeditationSync = useCallback(async () => {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      const course = meditationCourses.find(c => c.id === selectedCourse);
      const xpGained = Math.floor(Math.random() * 10 + 5);
      
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
  }, [syncStatus, selectedCourse, videoTimer, activeFighter, hasHellraiserNFTs, selectionConfirmed, selectedMethod]);

  const handleYogaSync = useCallback(async () => {
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      const course = yogaCourses.find(c => c.id === selectedCourse);
      const xpGained = Math.floor(Math.random() * 10 + 5);
      
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
  }, [syncStatus, selectedCourse, videoTimer, activeFighter, hasHellraiserNFTs, selectionConfirmed, selectedMethod]);

  const handleFullscreen = useCallback((videoContainerId: string) => {
    const container = document.getElementById(videoContainerId);
    if (!container) return;

    const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement
    );

    if (!isCurrentlyFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => {
          console.error('Error attempting to enable fullscreen:', err);
        });
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      } else if ((container as any).mozRequestFullScreen) {
        (container as any).mozRequestFullScreen();
      } else if ((container as any).msRequestFullscreen) {
        (container as any).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Error attempting to exit fullscreen:', err);
        });
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      } else if ((document as any).mozCancelFullScreen) {
        (document as any).mozCancelFullScreen();
      } else if ((document as any).msExitFullscreen) {
        (document as any).msExitFullscreen();
      }
    }
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      ));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  const handleSync = useCallback(async () => {
    if (selectedMethod === "meditation") {
      return handleMeditationSync();
    } else if (selectedMethod === "yoga") {
      return handleYogaSync();
    }
    
    if (syncStatus === "syncing") return;
    
    if (!stravaConnected) {
      setSelectionMessage("Please connect Strava in Step 2 to enable syncing.");
      return;
    }
    
    if (syncsRemaining <= 0) {
      setSelectionMessage(`You have reached your daily sync limit. Please try again tomorrow.`);
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
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const syncedDistance = Math.random() * 5 + 1;
      
      setCurrentDistance(prev => {
        const newDistance = Math.min(prev + syncedDistance, MAX_DISTANCE_PER_FIGHTER);
        return newDistance;
      });
      
      setCycleTotalDistance(prev => prev + syncedDistance);
      const newSyncsRemaining = Math.max(0, syncsRemaining - 1);
      setSyncsRemaining(newSyncsRemaining);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("syncs_remaining", newSyncsRemaining.toString());
      }
      
      const hasNewActivity = syncedDistance > 0.1;
      const enduranceDelta = hasNewActivity ? Math.round(syncedDistance * 0.5) : 0;
      const levelDelta = hasNewActivity ? Math.floor(syncedDistance / 5) : 0;
      
      setSyncResult({
        distance: hasNewActivity ? syncedDistance : 0,
        enduranceDelta,
        levelDelta,
      });
      
      setSyncStatus("done");
      setShowSyncPopup(true);
    } catch (error) {
      console.error("Sync error:", error);
      setSyncStatus("idle");
      setSelectionMessage("Failed to sync with Strava. Please try again.");
      setTimeout(() => {
        setSelectionMessage(null);
      }, 3000);
    }
  }, [selectedMethod, syncStatus, stravaConnected, syncsRemaining, activeFighter, hasHellraiserNFTs, selectionConfirmed, handleMeditationSync, handleYogaSync]);

  const handleCourseSelect = useCallback((courseId: number, timer: number) => {
    setSelectedCourse(courseId);
    setVideoTimer(timer);
    setIsVideoPaused(false);
  }, []);

  const handleCloseSyncPopup = useCallback(() => {
    setShowSyncPopup(false);
    setSyncStatus("idle");
    setSelectionMessage(null);
  }, []);

  if (!walletConnected) {
    return (
      <WelcomeScreen 
        isLoadingHellraiser={isLoadingHellraiser}
        hasHellraiserNFTs={hasHellraiserNFTs}
      />
    );
  }

  const displayName = userProfile?.username || (walletConnected && address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null) || "User";
  const displayAvatar = userProfile?.avatar;

  return (
    <main style={{ backgroundColor: "#202020", color: "white" }}>
      {walletConnected && !isLoadingProfile && (
        <WelcomeBanner
          displayName={displayName}
          displayAvatar={displayAvatar}
          hasHellraiserNFTs={hasHellraiserNFTs}
        />
      )}

      <div className="index_outer__GPFu3">
        <SideMenu
          items={sideMenu}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isCollapsed={isMenuCollapsed}
          onToggleCollapse={() => setIsMenuCollapsed((prev) => !prev)}
        />

        <FighterSelectionSection
          isLoadingHellraiser={isLoadingHellraiser}
          hellraiserBalance={hellraiserBalance}
          ownedCount={ownedCount}
          hasHellraiserNFTs={hasHellraiserNFTs}
          availableCards={availableCards}
          activeCardIndex={activeCard}
          onCarouselNavigate={handleCarousel}
          activeFighter={activeFighter}
          numericAttributes={numericAttributes}
          isShowingEmptyState={isShowingEmptyState}
          selectionMessage={selectionMessage}
          confirmDisabled={confirmDisabled}
          onConfirm={handleConfirm}
        />

        <TrainingMethodSection
          selectedMethod={selectedMethod}
          selectedAttribute={selectedAttribute}
          selectedAttributesForCurrentMethod={selectedAttributesForCurrentMethod}
          selectionMessage={selectionMessage}
          confirmDisabled={confirmDisabled}
          onMethodSelect={handleMethodSelect}
          onConfirm={handleConfirm}
        />

        <StravaConnectionSection
          activeFighter={activeFighter}
          numericAttributes={numericAttributes}
          isShowingEmptyState={isShowingEmptyState}
          hasHellraiserNFTs={hasHellraiserNFTs}
          stravaRedirectUri={stravaRedirectUri}
        />

        <TrainingProgressSection
          selectedMethod={selectedMethod}
          selectionConfirmed={selectionConfirmed}
          activeFighter={activeFighter}
          isShowingEmptyState={isShowingEmptyState}
          hasHellraiserNFTs={hasHellraiserNFTs}
          countdown={countdown}
          currentDistance={currentDistance}
          cycleTotalDistance={cycleTotalDistance}
          syncsRemaining={syncsRemaining}
          stravaConnected={stravaConnected}
          syncStatus={syncStatus}
          selectionMessage={selectionMessage}
          onSync={handleSync}
          selectedCourse={selectedCourse}
          videoTimer={videoTimer}
          isVideoPaused={isVideoPaused}
          isFullscreen={isFullscreen}
          onCourseSelect={handleCourseSelect}
          onFullscreen={handleFullscreen}
          onSyncTraining={selectedMethod === "meditation" ? handleMeditationSync : handleYogaSync}
        />

        <SyncPopup
          show={showSyncPopup}
          syncResult={syncResult}
          activeFighter={activeFighter}
          numericAttributes={numericAttributes}
          selectedAttribute={selectedAttribute}
          onClose={handleCloseSyncPopup}
        />
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

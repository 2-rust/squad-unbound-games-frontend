"use client";

import { useMemo, useState, useEffect } from "react";
import { HELLRAISER_NFT_CONTRACT } from "@/config/nft-config";
import { useUserProfile } from "@/hooks/useUserProfile";

const viewTabs = ["Fighter Rank", "Trainer Rank", "Activity"] as const;
const timeFilters = ["Total", "Cycle", "Week", "Day"] as const;

type FighterRow = {
  rank: number;
  tokenId: string;
  name: string;
  image?: string;
  endurance: number;
  enduranceDelta?: string;
  agility: number;
  agilityDelta?: string;
  mental: number;
  mentalDelta?: string;
  leadership: number;
  leadershipDelta?: string;
  distance: string;
};

type TrainerRow = {
  rank: number;
  trainer: string;
  totalProgress: string;
  endurance: string;
  agility: string;
  mental: string;
  leadership: string;
  distance: string;
  fightersTrained: number;
};

type ActivityRow = {
  rank: number;
  walletAddress: string;
  totalDistance: string;
  yogaSessions: number;
  meditationSessions: number;
};

const rotate = <T,>(rows: T[], shift: number): T[] => {
  const clone = [...rows];
  return [...clone.slice(shift), ...clone.slice(0, shift)];
};

// Contract address for NFT links
const NFT_CONTRACT_ADDRESS = HELLRAISER_NFT_CONTRACT;

// Map fighter names (without #number) to image numbers from assets/leaderboard/
const getFighterImage = (name: string): string => {
  // Extract fighter name without the #number part
  const fighterName = name.split(" #")[0].trim();
  
  // Mapping based on reference site HTML
  const imageMap: Record<string, string> = {
    "ERNEST": "48",
    "SILVAA": "34",
    "ATHENA": "49",
    "DASHA": "39",
    "YOON": "41",
    "MARGOT": "10",
    "DEATH PUNCH": "05",
    "VIKTOR R.": "42",
    "HER ERA": "51",
    "FISTFUL THUNDER": "26",
    "KAT": "02",
    "BLAZIN": "08",
    "PRISCILLA": "40",
    "XIA": "12",
    "MAGPIE": "36",
    "HADES": "28",
    "IRON": "52",
    "SOIR": "30",
    "ACHILLIA": "11",
    "ZARA STEELE": "22",
    "RED THE MAD": "17",
    "RAGE": "50",
    "SERAPHYM": "25",
    "9LIVES": "20",
    "ROBIN": "24",
    "TOBIASSA": "27",
    "ADA": "38",
    "LYNX": "29",
    "BARAKA": "31",
    "CHAEWON": "23",
    "POLLO SALVAJE": "09",
    "KILLER KIM": "06",
    "ROGUE": "14",
    "XENA": "46",
    "BILLY": "21",
    "SU": "35",
    "THE THRONEKEEPER": "45",
    "BOB": "03",
    "FLIGHTRESS": "43",
    "DEVIL PUNCH": "15",
    "HELLRAISER": "18",
    "KIND KID": "47",
    "LORD NEUTRON": "07",
    "VIOLET": "16",
    "MIYATA": "44",
    "SKILUX": "04",
    "STAR BREAKER": "01",
    "STARLA": "19",
    "TYRANTUS": "32",
    "ASENA KAYA": "37",
    "FAE": "13",
  };
  
  const imageNum = imageMap[fighterName] || "01"; // Default to 01.jpg if not found
  return `/assets/leaderboard/${imageNum.padStart(2, "0")}.jpg`;
};

// Fighter data matching the reference site exactly (from leaderboard - Fighter Rank.htm)
const fighterBase: FighterRow[] = [
  { rank: 1, tokenId: "53", name: "FAE #33", image: getFighterImage("FAE #33"), endurance: 75, enduranceDelta: "+21.5", agility: 87, agilityDelta: "+3.1", mental: 77, mentalDelta: "+6.1", leadership: 86, leadershipDelta: "+2", distance: "140 km" },
  { rank: 2, tokenId: "503", name: "SERAPHYM #29", image: getFighterImage("SERAPHYM #29"), endurance: 63, enduranceDelta: "+27.5", agility: 88, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "140 km" },
  { rank: 3, tokenId: "426", name: "MARGOT #10", image: getFighterImage("MARGOT #10"), endurance: 69, enduranceDelta: "+24.5", agility: 85, agilityDelta: "+0", mental: 88, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "140 km" },
  { rank: 4, tokenId: "504", name: "MIYATA #45", image: getFighterImage("MIYATA #45"), endurance: 72, enduranceDelta: "+23", agility: 87, agilityDelta: "+0", mental: 83, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "140 km" },
  { rank: 5, tokenId: "486", name: "FAE #49", image: getFighterImage("FAE #49"), endurance: 75, enduranceDelta: "+21.5", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0.6", leadership: 86, leadershipDelta: "+0", distance: "140 km" },
  { rank: 6, tokenId: "518", name: "VIOLET #34", image: getFighterImage("VIOLET #34"), endurance: 75, enduranceDelta: "+21.5", agility: 89, agilityDelta: "+0", mental: 70, mentalDelta: "+0", leadership: 87, leadershipDelta: "+0", distance: "140 km" },
  { rank: 7, tokenId: "667", name: "YOON #72", image: getFighterImage("YOON #72"), endurance: 72, enduranceDelta: "+22.45", agility: 89, agilityDelta: "+0", mental: 87, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "134.48 km" },
  { rank: 8, tokenId: "42", name: "ADA #41", image: getFighterImage("ADA #41"), endurance: 85, enduranceDelta: "+15", agility: 91, agilityDelta: "+3.1", mental: 86, mentalDelta: "+6.1", leadership: 90, leadershipDelta: "+2", distance: "125 km" },
  { rank: 9, tokenId: "702", name: "YOON #21", image: getFighterImage("YOON #21"), endurance: 72, enduranceDelta: "+21", agility: 89, agilityDelta: "+0", mental: 87, mentalDelta: "+0.6", leadership: 90, leadershipDelta: "+0", distance: "120 km" },
  { rank: 10, tokenId: "705", name: "FLIGHTRESS #73", image: getFighterImage("FLIGHTRESS #73"), endurance: 73, enduranceDelta: "+20.5", agility: 87, agilityDelta: "+0", mental: 85, mentalDelta: "+0.6", leadership: 89, leadershipDelta: "+0", distance: "120 km" },
  { rank: 11, tokenId: "1317", name: "PRISCILLA #6", image: getFighterImage("PRISCILLA #6"), endurance: 75, enduranceDelta: "+19.5", agility: 88, agilityDelta: "+0", mental: 92, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "120 km" },
  { rank: 12, tokenId: "704", name: "ZARA STEELE #9", image: getFighterImage("ZARA STEELE #9"), endurance: 82, enduranceDelta: "+16", agility: 87, agilityDelta: "+0", mental: 83, mentalDelta: "+0.6", leadership: 89, leadershipDelta: "+0", distance: "120 km" },
  { rank: 13, tokenId: "703", name: "HADES #63", image: getFighterImage("HADES #63"), endurance: 83, enduranceDelta: "+15.5", agility: 84, agilityDelta: "+0", mental: 84, mentalDelta: "+0.6", leadership: 87, leadershipDelta: "+0", distance: "120 km" },
  { rank: 14, tokenId: "706", name: "DEVIL PUNCH #44", image: getFighterImage("DEVIL PUNCH #44"), endurance: 83, enduranceDelta: "+15.5", agility: 89, agilityDelta: "+0", mental: 85, mentalDelta: "+0.6", leadership: 90, leadershipDelta: "+0", distance: "120 km" },
  { rank: 15, tokenId: "1250", name: "LORD NEUTRON #29", image: getFighterImage("LORD NEUTRON #29"), endurance: 83, enduranceDelta: "+15.5", agility: 84, agilityDelta: "+0", mental: 73, mentalDelta: "+0.6", leadership: 87, leadershipDelta: "+0", distance: "120 km" },
  { rank: 16, tokenId: "707", name: "POLLO SALVAJE #13", image: getFighterImage("POLLO SALVAJE #13"), endurance: 84, enduranceDelta: "+15", agility: 82, agilityDelta: "+0", mental: 90, mentalDelta: "+0.6", leadership: 91, leadershipDelta: "+0", distance: "120 km" },
  { rank: 17, tokenId: "808", name: "KAT #97", image: getFighterImage("KAT #97"), endurance: 84, enduranceDelta: "+15", agility: 72, agilityDelta: "+0", mental: 75, mentalDelta: "+0.6", leadership: 93, leadershipDelta: "+0", distance: "120 km" },
  { rank: 19, tokenId: "1253", name: "SKILUX #64", image: getFighterImage("SKILUX #64"), endurance: 80, enduranceDelta: "+15", agility: 90, agilityDelta: "+0", mental: 89, mentalDelta: "+0.6", leadership: 84, leadershipDelta: "+0", distance: "100 km" },
  { rank: 20, tokenId: "455", name: "SOIR #87", image: getFighterImage("SOIR #87"), endurance: 81, enduranceDelta: "+14.5", agility: 92, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "100 km" },
  { rank: 21, tokenId: "1252", name: "XENA #77", image: getFighterImage("XENA #77"), endurance: 83, enduranceDelta: "+13.5", agility: 88, agilityDelta: "+0", mental: 82, mentalDelta: "+0.6", leadership: 90, leadershipDelta: "+0", distance: "100 km" },
  { rank: 22, tokenId: "1254", name: "VIKTOR R. #30", image: getFighterImage("VIKTOR R. #30"), endurance: 84, enduranceDelta: "+13", agility: 89, agilityDelta: "+0", mental: 84, mentalDelta: "+0.6", leadership: 90, leadershipDelta: "+0", distance: "100 km" },
  { rank: 23, tokenId: "688", name: "ATHENA #36", image: getFighterImage("ATHENA #36"), endurance: 83, enduranceDelta: "+13.5", agility: 80, agilityDelta: "+0", mental: 81, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "100 km" },
  { rank: 24, tokenId: "108", name: "HELLRAISER #59", image: getFighterImage("HELLRAISER #59"), endurance: 85, enduranceDelta: "+12.5", agility: 86, agilityDelta: "+0", mental: 84, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "100 km" },
  { rank: 25, tokenId: "1251", name: "THE THRONEKEEPER #14", image: getFighterImage("THE THRONEKEEPER #14"), endurance: 87, enduranceDelta: "+11.5", agility: 90, agilityDelta: "+0", mental: 70, mentalDelta: "+0.6", leadership: 95, leadershipDelta: "+0", distance: "100 km" },
  { rank: 26, tokenId: "522", name: "YEKTA #13", image: getFighterImage("YEKTA #13"), endurance: 90, enduranceDelta: "+10", agility: 88, agilityDelta: "+0", mental: 86, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "100 km" },
  { rank: 27, tokenId: "691", name: "BARAKA #82", image: getFighterImage("BARAKA #82"), endurance: 70, enduranceDelta: "+19.86", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "99.3 km" },
  { rank: 28, tokenId: "680", name: "MIYATA #91", image: getFighterImage("MIYATA #91"), endurance: 72, enduranceDelta: "+18.83", agility: 87, agilityDelta: "+0", mental: 83, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "98.33 km" },
  { rank: 29, tokenId: "189", name: "SOIR #50", image: getFighterImage("SOIR #50"), endurance: 81, enduranceDelta: "+14.32", agility: 92, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "98.2 km" },
  { rank: 30, tokenId: "696", name: "XIA #91", image: getFighterImage("XIA #91"), endurance: 91, enduranceDelta: "+9", agility: 83, agilityDelta: "+3.1", mental: 90, mentalDelta: "+6.1", leadership: 90, leadershipDelta: "+2", distance: "90 km" },
  { rank: 31, tokenId: "1255", name: "ROGUE #16", image: getFighterImage("ROGUE #16"), endurance: 71, enduranceDelta: "+17.19", agility: 86, agilityDelta: "+0", mental: 81, mentalDelta: "+0.6", leadership: 89, leadershipDelta: "+0", distance: "85.97 km" },
  { rank: 32, tokenId: "1256", name: "ASENA KAYA #74", image: getFighterImage("ASENA KAYA #74"), endurance: 72, enduranceDelta: "+16.13", agility: 90, agilityDelta: "+0", mental: 85, mentalDelta: "+0.6", leadership: 91, leadershipDelta: "+0", distance: "80.64 km" },
  { rank: 33, tokenId: "481", name: "DEATH PUNCH #54", image: getFighterImage("DEATH PUNCH #54"), endurance: 81, enduranceDelta: "+12.5", agility: 83, agilityDelta: "+0", mental: 92, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "80 km" },
  { rank: 34, tokenId: "476", name: "DEATH PUNCH #91", image: getFighterImage("DEATH PUNCH #91"), endurance: 81, enduranceDelta: "+12.5", agility: 83, agilityDelta: "+0", mental: 92, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "80 km" },
  { rank: 35, tokenId: "450", name: "STAR BREAKER #21", image: getFighterImage("STAR BREAKER #21"), endurance: 85, enduranceDelta: "+10.5", agility: 91, agilityDelta: "+0", mental: 88, mentalDelta: "+0", leadership: 83, leadershipDelta: "+0", distance: "80 km" },
  { rank: 36, tokenId: "453", name: "HELLRAISER #4", image: getFighterImage("HELLRAISER #4"), endurance: 85, enduranceDelta: "+10.5", agility: 86, agilityDelta: "+0", mental: 84, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "80 km" },
  { rank: 37, tokenId: "201", name: "STARLA #8", image: getFighterImage("STARLA #8"), endurance: 87, enduranceDelta: "+9.5", agility: 85, agilityDelta: "+0", mental: 74, mentalDelta: "+0", leadership: 92, leadershipDelta: "+0", distance: "80 km" },
  { rank: 38, tokenId: "521", name: "ACHILLIA #22", image: getFighterImage("ACHILLIA #22"), endurance: 89, enduranceDelta: "+8.49", agility: 91, agilityDelta: "+0", mental: 87, mentalDelta: "+0", leadership: 88, leadershipDelta: "+0", distance: "79.91 km" },
  { rank: 39, tokenId: "394", name: "ERNEST #46", image: getFighterImage("ERNEST #46"), endurance: 78, enduranceDelta: "+13.75", agility: 84, agilityDelta: "+0", mental: 78, mentalDelta: "+0", leadership: 82, leadershipDelta: "+0", distance: "77.54 km" },
  { rank: 40, tokenId: "109", name: "YEKTA #97", image: getFighterImage("YEKTA #97"), endurance: 90, enduranceDelta: "+7.51", agility: 88, agilityDelta: "+0", mental: 86, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "75.06 km" },
  { rank: 41, tokenId: "694", name: "PRISCILLA #38", image: getFighterImage("PRISCILLA #38"), endurance: 75, enduranceDelta: "+14.63", agility: 88, agilityDelta: "+0", mental: 92, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "73.13 km" },
  { rank: 42, tokenId: "721", name: "SILVAA #7", image: getFighterImage("SILVAA #7"), endurance: 87, enduranceDelta: "+8.81", agility: 89, agilityDelta: "+0", mental: 83, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "73.05 km" },
  { rank: 43, tokenId: "1", name: "MARGOT #30", image: getFighterImage("MARGOT #30"), endurance: 69, enduranceDelta: "+14.51", agility: 85, agilityDelta: "+0.1", mental: 88, mentalDelta: "+0.7", leadership: 89, leadershipDelta: "+0", distance: "72.57 km" },
  { rank: 44, tokenId: "403", name: "BARAKA #55", image: getFighterImage("BARAKA #55"), endurance: 70, enduranceDelta: "+13.95", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "69.73 km" },
  { rank: 45, tokenId: "7", name: "KAT #92", image: getFighterImage("KAT #92"), endurance: 84, enduranceDelta: "+9.57", agility: 72, agilityDelta: "+0.1", mental: 75, mentalDelta: "+0.7", leadership: 93, leadershipDelta: "+0", distance: "65.66 km" },
  { rank: 46, tokenId: "722", name: "ADA #68", image: getFighterImage("ADA #68"), endurance: 85, enduranceDelta: "+9.05", agility: 91, agilityDelta: "+0", mental: 86, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "65.51 km" },
  { rank: 47, tokenId: "723", name: "VIKTOR R. #29", image: getFighterImage("VIKTOR R. #29"), endurance: 84, enduranceDelta: "+9.5", agility: 89, agilityDelta: "+0", mental: 84, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "64.96 km" },
  { rank: 48, tokenId: "62", name: "FAE #43", image: getFighterImage("FAE #43"), endurance: 75, enduranceDelta: "+12", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 86, leadershipDelta: "+0", distance: "60 km" },
  { rank: 49, tokenId: "184", name: "SU #27", image: getFighterImage("SU #27"), endurance: 62, enduranceDelta: "+12", agility: 90, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "60 km" },
  { rank: 50, tokenId: "526", name: "FAE #3", image: getFighterImage("FAE #3"), endurance: 75, enduranceDelta: "+12", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 86, leadershipDelta: "+0", distance: "60 km" },
  { rank: 51, tokenId: "1271", name: "LYNX #10", image: getFighterImage("LYNX #10"), endurance: 74, enduranceDelta: "+12", agility: 90, agilityDelta: "+0", mental: 83, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "60 km" },
  { rank: 52, tokenId: "507", name: "KAT #68", image: getFighterImage("KAT #68"), endurance: 84, enduranceDelta: "+9", agility: 72, agilityDelta: "+0", mental: 75, mentalDelta: "+0", leadership: 93, leadershipDelta: "+0", distance: "60 km" },
  { rank: 53, tokenId: "492", name: "ASENA KAYA #73", image: getFighterImage("ASENA KAYA #73"), endurance: 72, enduranceDelta: "+11.99", agility: 90, agilityDelta: "+0", mental: 85, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "59.93 km" },
  { rank: 54, tokenId: "2", name: "DEATH PUNCH #26", image: getFighterImage("DEATH PUNCH #26"), endurance: 81, enduranceDelta: "+10.38", agility: 83, agilityDelta: "+0.1", mental: 92, mentalDelta: "+0.7", leadership: 89, leadershipDelta: "+0", distance: "58.83 km" },
  { rank: 55, tokenId: "1269", name: "BLAZIN #87", image: getFighterImage("BLAZIN #87"), endurance: 71, enduranceDelta: "+11.2", agility: 88, agilityDelta: "+0", mental: 93, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "56 km" },
  { rank: 56, tokenId: "459", name: "MAGPIE #99", image: getFighterImage("MAGPIE #99"), endurance: 70, enduranceDelta: "+10.88", agility: 88, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "54.41 km" },
  { rank: 57, tokenId: "493", name: "TOBIASSA #20", image: getFighterImage("TOBIASSA #20"), endurance: 72, enduranceDelta: "+10.59", agility: 82, agilityDelta: "+0", mental: 93, mentalDelta: "+0", leadership: 85, leadershipDelta: "+0", distance: "52.95 km" },
  { rank: 58, tokenId: "1270", name: "IRON #22", image: getFighterImage("IRON #22"), endurance: 76, enduranceDelta: "+10.49", agility: 87, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 85, leadershipDelta: "+0", distance: "52.47 km" },
  { rank: 59, tokenId: "10", name: "KILLER KIM #79", image: getFighterImage("KILLER KIM #79"), endurance: 93, enduranceDelta: "+5", agility: 90, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 88, leadershipDelta: "+0", distance: "50 km" },
  { rank: 60, tokenId: "230", name: "HER ERA #23", image: getFighterImage("HER ERA #23"), endurance: 95, enduranceDelta: "+5", agility: 85, agilityDelta: "+3.1", mental: 91, mentalDelta: "+6.1", leadership: 87, leadershipDelta: "+2", distance: "50 km" },
  { rank: 61, tokenId: "239", name: "VIKTOR R. #27", image: getFighterImage("VIKTOR R. #27"), endurance: 84, enduranceDelta: "+7.6", agility: 89, agilityDelta: "+0", mental: 84, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "46.02 km" },
  { rank: 62, tokenId: "465", name: "SERAPHYM #48", image: getFighterImage("SERAPHYM #48"), endurance: 63, enduranceDelta: "+8.8", agility: 88, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "43.98 km" },
  { rank: 63, tokenId: "9", name: "PRISCILLA #13", image: getFighterImage("PRISCILLA #13"), endurance: 75, enduranceDelta: "+8.62", agility: 88, agilityDelta: "+0.1", mental: 92, mentalDelta: "+0.7", leadership: 90, leadershipDelta: "+0", distance: "43.09 km" },
  { rank: 64, tokenId: "8", name: "BLAZIN #16", image: getFighterImage("BLAZIN #16"), endurance: 71, enduranceDelta: "+8.46", agility: 88, agilityDelta: "+0.1", mental: 93, mentalDelta: "+0.7", leadership: 90, leadershipDelta: "+0", distance: "42.28 km" },
  { rank: 65, tokenId: "12", name: "BILLY #35", image: getFighterImage("BILLY #35"), endurance: 93, enduranceDelta: "+4.15", agility: 85, agilityDelta: "+0", mental: 93, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "41.46 km" },
  { rank: 66, tokenId: "485", name: "BARAKA #24", image: getFighterImage("BARAKA #24"), endurance: 70, enduranceDelta: "+8.07", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "40.33 km" },
  { rank: 67, tokenId: "1734", name: "BLAZIN #8", image: getFighterImage("BLAZIN #8"), endurance: 71, enduranceDelta: "+8", agility: 88, agilityDelta: "+3.1", mental: 93, mentalDelta: "+6.1", leadership: 90, leadershipDelta: "+2", distance: "40 km" },
  { rank: 68, tokenId: "1733", name: "HELLRAISER #78", image: getFighterImage("HELLRAISER #78"), endurance: 85, enduranceDelta: "+6.5", agility: 86, agilityDelta: "+3.1", mental: 84, mentalDelta: "+6.1", leadership: 90, leadershipDelta: "+2", distance: "40 km" },
  { rank: 69, tokenId: "1208", name: "HADES #36", image: getFighterImage("HADES #36"), endurance: 83, enduranceDelta: "+7.5", agility: 84, agilityDelta: "+0.1", mental: 84, mentalDelta: "+0.7", leadership: 87, leadershipDelta: "+0", distance: "40 km" },
  { rank: 70, tokenId: "58", name: "TYRANTUS #28", image: getFighterImage("TYRANTUS #28"), endurance: 72, enduranceDelta: "+8", agility: 88, agilityDelta: "+0", mental: 90, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "40 km" },
  { rank: 71, tokenId: "59", name: "KIND KID #30", image: getFighterImage("KIND KID #30"), endurance: 23, enduranceDelta: "+8", agility: 94, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 88, leadershipDelta: "+0", distance: "40 km" },
  { rank: 72, tokenId: "63", name: "ROBIN #58", image: getFighterImage("ROBIN #58"), endurance: 72, enduranceDelta: "+8", agility: 89, agilityDelta: "+0", mental: 86, mentalDelta: "+0", leadership: 88, leadershipDelta: "+0", distance: "40 km" },
  { rank: 73, tokenId: "106", name: "SU #7", image: getFighterImage("SU #7"), endurance: 62, enduranceDelta: "+8", agility: 90, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "40 km" },
  { rank: 74, tokenId: "396", name: "ERNEST #18", image: getFighterImage("ERNEST #18"), endurance: 78, enduranceDelta: "+8", agility: 84, agilityDelta: "+0", mental: 78, mentalDelta: "+0", leadership: 82, leadershipDelta: "+0", distance: "40 km" },
  { rank: 75, tokenId: "491", name: "VIOLET #50", image: getFighterImage("VIOLET #50"), endurance: 75, enduranceDelta: "+8", agility: 89, agilityDelta: "+0", mental: 70, mentalDelta: "+0", leadership: 87, leadershipDelta: "+0", distance: "40 km" },
  { rank: 76, tokenId: "498", name: "YOON #23", image: getFighterImage("YOON #23"), endurance: 72, enduranceDelta: "+8", agility: 89, agilityDelta: "+0", mental: 87, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "40 km" },
  { rank: 77, tokenId: "631", name: "BARAKA #11", image: getFighterImage("BARAKA #11"), endurance: 70, enduranceDelta: "+8", agility: 87, agilityDelta: "+0", mental: 77, mentalDelta: "+0", leadership: 89, leadershipDelta: "+0", distance: "40 km" },
  { rank: 78, tokenId: "639", name: "SKILUX #3", image: getFighterImage("SKILUX #3"), endurance: 80, enduranceDelta: "+8", agility: 90, agilityDelta: "+0", mental: 89, mentalDelta: "+0", leadership: 84, leadershipDelta: "+0", distance: "40 km" },
  { rank: 79, tokenId: "1536", name: "ERNEST #96", image: getFighterImage("ERNEST #96"), endurance: 78, enduranceDelta: "+8", agility: 84, agilityDelta: "+0", mental: 78, mentalDelta: "+0", leadership: 82, leadershipDelta: "+0", distance: "40 km" },
  { rank: 81, tokenId: "1634", name: "SU #76", image: getFighterImage("SU #76"), endurance: 62, enduranceDelta: "+8", agility: 90, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "40 km" },
  { rank: 82, tokenId: "325", name: "XENA #1", image: getFighterImage("XENA #1"), endurance: 83, enduranceDelta: "+7.5", agility: 88, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "40 km" },
  { rank: 83, tokenId: "1211", name: "XENA #87", image: getFighterImage("XENA #87"), endurance: 83, enduranceDelta: "+7.5", agility: 88, agilityDelta: "+0", mental: 82, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "40 km" },
  { rank: 84, tokenId: "1652", name: "ATHENA #62", image: getFighterImage("ATHENA #62"), endurance: 83, enduranceDelta: "+7.5", agility: 80, agilityDelta: "+0", mental: 81, mentalDelta: "+0", leadership: 91, leadershipDelta: "+0", distance: "40 km" },
  { rank: 85, tokenId: "1348", name: "DEVIL PUNCH #47", image: getFighterImage("DEVIL PUNCH #47"), endurance: 83, enduranceDelta: "+7.5", agility: 89, agilityDelta: "+0", mental: 85, mentalDelta: "+0", leadership: 90, leadershipDelta: "+0", distance: "40 km" },
  { rank: 86, tokenId: "153", name: "THE THRONEKEEPER #77", image: getFighterImage("THE THRONEKEEPER #77"), endurance: 87, enduranceDelta: "+5.5", agility: 90, agilityDelta: "+0", mental: 70, mentalDelta: "+0", leadership: 95, leadershipDelta: "+0", distance: "40 km" },
  { rank: 87, tokenId: "61", name: "CHAEWON #77", image: getFighterImage("CHAEWON #77"), endurance: 88, enduranceDelta: "+5", agility: 86, agilityDelta: "+0", mental: 85, mentalDelta: "+0", leadership: 87, leadershipDelta: "+0", distance: "40 km" },
  { rank: 88, tokenId: "435", name: "ACHILLIA #7", image: getFighterImage("ACHILLIA #7"), endurance: 89, enduranceDelta: "+4.5", agility: 91, agilityDelta: "+0", mental: 87, mentalDelta: "+0.1", leadership: 88, leadershipDelta: "+0", distance: "40 km" },
  { rank: 89, tokenId: "719", name: "ACHILLIA #46", image: getFighterImage("ACHILLIA #46"), endurance: 89, enduranceDelta: "+4.5", agility: 91, agilityDelta: "+0", mental: 87, mentalDelta: "+0", leadership: 88, leadershipDelta: "+0", distance: "40 km" },
];

const trainerBase: TrainerRow[] = [
  { rank: 1, trainer: "0x9c54a9c609212d2fd034b55cf3b42ba99af52880", totalProgress: "+253.84", endurance: "+253.84", agility: "+0", mental: "+0", leadership: "+0", distance: "1403.32 km", fightersTrained: 42 },
  { rank: 2, trainer: "0xfea60461324cfa6d07cfe1551599f2bb139c3543", totalProgress: "+250.82", endurance: "+241.82", agility: "+0", mental: "+9", leadership: "+0", distance: "1666.61 km", fightersTrained: 15 },
  { rank: 3, trainer: "0x81cc15402a47f18e210aa57fb9370a1b5525047e", totalProgress: "+195.35", endurance: "+135.65", agility: "+7.5", mental: "+52.2", leadership: "+0", distance: "768.98 km", fightersTrained: 88 },
  { rank: 4, trainer: "0x9967a3a28a6549df43d07790e927cca0ea4534ba", totalProgress: "+179.72", endurance: "+90.92", agility: "+24.4", mental: "+47.9", leadership: "+16.5", distance: "642.09 km", fightersTrained: 9 },
  { rank: 5, trainer: "0x72fe3c398c9a030b9b2be1fe1ff07701167571d4", totalProgress: "+159.99", endurance: "+159.99", agility: "+0", mental: "+0", leadership: "+0", distance: "966.48 km", fightersTrained: 19 },
  { rank: 6, trainer: "0x878ec6839c1bbf85f61b34433e84fa225948e8f1", totalProgress: "+154.69", endurance: "+154.69", agility: "+0", mental: "+0", leadership: "+0", distance: "917.63 km", fightersTrained: 11 },
  { rank: 7, trainer: "0xa4ac3321fd639a7e2b53da62897955d920c97012", totalProgress: "+144.2", endurance: "+144.2", agility: "+0", mental: "+0", leadership: "+0", distance: "774.14 km", fightersTrained: 45 },
  { rank: 8, trainer: "0x8f052c26f086a90059b53d269ea44b79c6be255b", totalProgress: "+74.43", endurance: "+74.43", agility: "+0", mental: "+0", leadership: "+0", distance: "392.17 km", fightersTrained: 20 },
  { rank: 9, trainer: "0x6eb6e110b902c101f9ebef428fad9a29c89664d8", totalProgress: "+71.7", endurance: "+71.7", agility: "+0", mental: "+0", leadership: "+0", distance: "547.61 km", fightersTrained: 7 },
  { rank: 10, trainer: "0xf8d0c9f300d0649861963ebae0bb568533619448", totalProgress: "+66.5", endurance: "+66.5", agility: "+0", mental: "+0", leadership: "+0", distance: "350 km", fightersTrained: 18 },
  { rank: 11, trainer: "0x714ed29b273dda8feeec2ec1f75509b34b2d5953", totalProgress: "+61.5", endurance: "+61.5", agility: "+0", mental: "+0", leadership: "+0", distance: "320 km", fightersTrained: 16 },
  { rank: 12, trainer: "0x19038313876815e89d30422def403282bbe33293", totalProgress: "+55.17", endurance: "+55.17", agility: "+0", mental: "+0", leadership: "+0", distance: "312.82 km", fightersTrained: 13 },
  { rank: 13, trainer: "0x1a6f0dddb884854355023a2dfe26e9174f8e0290", totalProgress: "+51.38", endurance: "+51.38", agility: "+0", mental: "+0", leadership: "+0", distance: "270.68 km", fightersTrained: 7 },
  { rank: 14, trainer: "0x7b5af6790381f932abae790e8b0d0ff50e287f8e", totalProgress: "+48.22", endurance: "+48.22", agility: "+0", mental: "+0", leadership: "+0", distance: "312.32 km", fightersTrained: 8 },
  { rank: 15, trainer: "0x9fca5cb296333aa780d3367951f766ab3d7d4098", totalProgress: "+44.88", endurance: "+44.88", agility: "+0", mental: "+0", leadership: "+0", distance: "227.86 km", fightersTrained: 12 },
  { rank: 16, trainer: "0xb38bd68a6f0ba599808d65c7a9cf2a428105b680", totalProgress: "+32.95", endurance: "+32.95", agility: "+0", mental: "+0", leadership: "+0", distance: "164.76 km", fightersTrained: 9 },
  { rank: 17, trainer: "0x58b249a73452f624d473459fa084792704e9ae36", totalProgress: "+32.76", endurance: "+32.76", agility: "+0", mental: "+0", leadership: "+0", distance: "166.3 km", fightersTrained: 9 },
  { rank: 18, trainer: "0xb3623d62ff30fadb5b2e127c07cab0d1b0808276", totalProgress: "+27.19", endurance: "+27.19", agility: "+0", mental: "+0", leadership: "+0", distance: "145.94 km", fightersTrained: 5 },
  { rank: 19, trainer: "0xa9b21f07bd651f1905bf581287743a4bbe4974db", totalProgress: "+26.81", endurance: "+26.81", agility: "+0", mental: "+0", leadership: "+0", distance: "134.03 km", fightersTrained: 7 },
  { rank: 20, trainer: "0x71aca10a08dee56abeef5324ade5801350ac4c98", totalProgress: "+24", endurance: "+24", agility: "+0", mental: "+0", leadership: "+0", distance: "140 km", fightersTrained: 3 },
  { rank: 21, trainer: "0x9e680f3d7566464b3b3e63c9ad37dc2b9e5452e2", totalProgress: "+17.8", endurance: "+1.3", agility: "+5.5", mental: "+11", leadership: "+0", distance: "6.48 km", fightersTrained: 55 },
  { rank: 22, trainer: "0x4164ae191d2b7166823412f69505b4cb5a5a29f5", totalProgress: "+14.5", endurance: "+14.5", agility: "+0", mental: "+0", leadership: "+0", distance: "100 km", fightersTrained: 1 },
  { rank: 23, trainer: "0x620051b8553a724b742ae6ae9cc3585d29f49848", totalProgress: "+13.69", endurance: "+13.69", agility: "+0", mental: "+0", leadership: "+0", distance: "68.43 km", fightersTrained: 2 },
  { rank: 24, trainer: "0x92c70f31efa47bd08b65f36079fba5668f3050c4", totalProgress: "+12.77", endurance: "+12.77", agility: "+0", mental: "+0", leadership: "+0", distance: "67.66 km", fightersTrained: 3 },
  { rank: 25, trainer: "0xb3c3cac4ddaabb4a4b2affbdf0034ff6bd4535b8", totalProgress: "+12.45", endurance: "+8.95", agility: "+1.3", mental: "+2.2", leadership: "+0", distance: "44.76 km", fightersTrained: 2 },
  { rank: 26, trainer: "0x6b347a82fcac4e6a38d1fc40e3631bd8f9495e9f", totalProgress: "+12.35", endurance: "+12.35", agility: "+0", mental: "+0", leadership: "+0", distance: "64.25 km", fightersTrained: 4 },
  { rank: 27, trainer: "0x98175fcafcbd021769431b29bcc8fa7d7408e5fa", totalProgress: "+12.23", endurance: "+11.43", agility: "+0", mental: "+0.8", leadership: "+0", distance: "85.66 km", fightersTrained: 8 },
  { rank: 28, trainer: "0x1f2a9082a7692ad4f1049b573313c52e49400137", totalProgress: "+12", endurance: "+12", agility: "+0", mental: "+0", leadership: "+0", distance: "60 km", fightersTrained: 3 },
  { rank: 29, trainer: "0xca5ef762efd4708739b42334de7535bedee7c9b8", totalProgress: "+12", endurance: "+12", agility: "+0", mental: "+0", leadership: "+0", distance: "60 km", fightersTrained: 3 },
  { rank: 30, trainer: "0xbea2773ce1ee42dbd6677b3c246b2a40676474cf", totalProgress: "+11.33", endurance: "+11.33", agility: "+0", mental: "+0", leadership: "+0", distance: "72.18 km", fightersTrained: 3 },
  { rank: 31, trainer: "0x3fff64bfa2e9d90e6dbcde033b0933e20da70b52", totalProgress: "+10.89", endurance: "+10.89", agility: "+0", mental: "+0", leadership: "+0", distance: "54.43 km", fightersTrained: 3 },
  { rank: 32, trainer: "0x2f77ca1ae1c1910731e57731595dc1a51cadf50b", totalProgress: "+9.7", endurance: "+9.7", agility: "+0", mental: "+0", leadership: "+0", distance: "48.49 km", fightersTrained: 3 },
  { rank: 33, trainer: "0x159df20083f0c238b70f572c133b45ce3c1f6c0c", totalProgress: "+8", endurance: "+8", agility: "+0", mental: "+0", leadership: "+0", distance: "40 km", fightersTrained: 2 },
  { rank: 34, trainer: "0x6e63a4caeccb4f341ee9c9175c9cc554bdb6d10b", totalProgress: "+7.5", endurance: "+7.5", agility: "+0", mental: "+0", leadership: "+0", distance: "40 km", fightersTrained: 2 },
  { rank: 35, trainer: "0xa86cd6bfe453ad3bd3bfbb263d223a1a39eebeab", totalProgress: "+7.38", endurance: "+7.38", agility: "+0", mental: "+0", leadership: "+0", distance: "36.89 km", fightersTrained: 1 },
  { rank: 36, trainer: "0xce0f34368843b64507647d2d0f95c4ee62089725", totalProgress: "+6.41", endurance: "+6.41", agility: "+0", mental: "+0", leadership: "+0", distance: "32.07 km", fightersTrained: 1 },
  { rank: 37, trainer: "0x87a8edd66faa4a8d2c6591f05207b6254c3fff31", totalProgress: "+6.4", endurance: "+6.4", agility: "+0", mental: "+0", leadership: "+0", distance: "32 km", fightersTrained: 1 },
  { rank: 38, trainer: "0xd62e21d5acc7178bd6d9a3f71512e249cbed2cf4", totalProgress: "+6.27", endurance: "+6.27", agility: "+0", mental: "+0", leadership: "+0", distance: "37.68 km", fightersTrained: 1 },
  { rank: 39, trainer: "0x4ae89d420ebacaad0afcbd924857b084db0c3970", totalProgress: "+5.68", endurance: "+5.68", agility: "+0", mental: "+0", leadership: "+0", distance: "31.83 km", fightersTrained: 1 },
  { rank: 40, trainer: "0x6ad312bd13d4f7a199c86e1a4bacf76c630009a9", totalProgress: "+5.62", endurance: "+5.12", agility: "+0", mental: "+0.5", leadership: "+0", distance: "25.61 km", fightersTrained: 1 },
  { rank: 41, trainer: "0x0eff6f5a6afbf8a69559d25e107f206ba4119b57", totalProgress: "+5.51", endurance: "+5.51", agility: "+0", mental: "+0", leadership: "+0", distance: "27.53 km", fightersTrained: 2 },
  { rank: 42, trainer: "0x13d735a4d5e966b8f7b19fc2f476bfc25c0fc7dc", totalProgress: "+5.36", endurance: "+5.36", agility: "+0", mental: "+0", leadership: "+0", distance: "26.81 km", fightersTrained: 1 },
  { rank: 43, trainer: "0x5108d9ad6dd9491be41c771042479871593b70b4", totalProgress: "+4.76", endurance: "+4.76", agility: "+0", mental: "+0", leadership: "+0", distance: "23.81 km", fightersTrained: 1 },
  { rank: 44, trainer: "0x352221a878ae7d7caed0bf216580f76487ce65db", totalProgress: "+4.68", endurance: "+3.28", agility: "+0.7", mental: "+0.7", leadership: "+0", distance: "16.4 km", fightersTrained: 1 },
  { rank: 45, trainer: "0x7a76b0d5b2c52b7769caab48bf5a91527c5ccdb0", totalProgress: "+4", endurance: "+4", agility: "+0", mental: "+0", leadership: "+0", distance: "20 km", fightersTrained: 1 },
  { rank: 46, trainer: "0xf2b412ee5c9c5c188cabcdb35a91dee56c6672bc", totalProgress: "+4", endurance: "+4", agility: "+0", mental: "+0", leadership: "+0", distance: "20 km", fightersTrained: 1 },
  { rank: 47, trainer: "0xd878df00c38a587c33774620d31a3f93a5979420", totalProgress: "+3.5", endurance: "+3.5", agility: "+0", mental: "+0", leadership: "+0", distance: "20 km", fightersTrained: 1 },
  { rank: 48, trainer: "0xadee5ee18e77ccee0717b707d28d589292b65c9c", totalProgress: "+3.38", endurance: "+3.38", agility: "+0", mental: "+0", leadership: "+0", distance: "16.92 km", fightersTrained: 1 },
  { rank: 49, trainer: "0xccde2255349cdd25c935128b90d682f3d592acaf", totalProgress: "+3.1", endurance: "+3.1", agility: "+0", mental: "+0", leadership: "+0", distance: "15.5 km", fightersTrained: 1 },
  { rank: 50, trainer: "0xb5eb18472a18d765824243234cb012da71df836f", totalProgress: "+2.93", endurance: "+2.13", agility: "+0.3", mental: "+0.5", leadership: "+0", distance: "21.35 km", fightersTrained: 1 },
  { rank: 51, trainer: "0xf285e90a645e76dc4f77aa53d0cb15319ebfb87c", totalProgress: "+2.81", endurance: "+2.81", agility: "+0", mental: "+0", leadership: "+0", distance: "16.15 km", fightersTrained: 4 },
  { rank: 52, trainer: "0xb1478f4447f9d96b628a542f342e4b50aa2b5458", totalProgress: "+2.81", endurance: "+2.81", agility: "+0", mental: "+0", leadership: "+0", distance: "14.03 km", fightersTrained: 1 },
  { rank: 53, trainer: "0x1035d18b286e9d2f2dc1b7169dc5ad80938b339a", totalProgress: "+2.57", endurance: "+2.57", agility: "+0", mental: "+0", leadership: "+0", distance: "22.84 km", fightersTrained: 2 },
  { rank: 54, trainer: "0xf8ff5350c55d2e40f3123fc51d21ff6f2ac8c7bb", totalProgress: "+2.33", endurance: "+2.13", agility: "+0.1", mental: "+0.1", leadership: "+0", distance: "10.66 km", fightersTrained: 1 },
  { rank: 55, trainer: "0x45742d640011084bccd9cbc55dfe15671f694aca", totalProgress: "+2.32", endurance: "+2.32", agility: "+0", mental: "+0", leadership: "+0", distance: "11.61 km", fightersTrained: 1 },
  { rank: 56, trainer: "0xa52ed71d0776bc110da5d62372d83178b3c48314", totalProgress: "+2", endurance: "+0", agility: "+1", mental: "+1", leadership: "+0", distance: "0 km", fightersTrained: 2 },
  { rank: 57, trainer: "0x2d11655e158a6713c407c3bd8219685970aa012a", totalProgress: "+1.2", endurance: "+0", agility: "+0.4", mental: "+0.8", leadership: "+0", distance: "0 km", fightersTrained: 1 },
  { rank: 58, trainer: "0xda8d95cdf11792975190f8b1d6e5431746c71926", totalProgress: "+0.97", endurance: "+0.97", agility: "+0", mental: "+0", leadership: "+0", distance: "4.84 km", fightersTrained: 1 },
  { rank: 59, trainer: "0xf8dfebf498f5c995b97b0b0b21bfcf54440e8bc9", totalProgress: "+0.76", endurance: "+0.76", agility: "+0", mental: "+0", leadership: "+0", distance: "3.81 km", fightersTrained: 1 },
  { rank: 60, trainer: "0xee49f82e58a1c2b306720d0c68047cbf70c11fb5", totalProgress: "+0.7", endurance: "+0.7", agility: "+0", mental: "+0", leadership: "+0", distance: "3.52 km", fightersTrained: 2 },
  { rank: 61, trainer: "0x52ece072cf4950ea3f32833f54299cfea3fd94af", totalProgress: "+0.7", endurance: "+0.7", agility: "+0", mental: "+0", leadership: "+0", distance: "3.51 km", fightersTrained: 1 },
  { rank: 62, trainer: "0x6ff3efc06aaee79776207c95bde5763e4af55a8b", totalProgress: "+0.4", endurance: "+0", agility: "+0.2", mental: "+0.2", leadership: "+0", distance: "0 km", fightersTrained: 1 },
  { rank: 63, trainer: "0xdd8b4c19ebbfaca1752d592582a6b086e7016d61", totalProgress: "+0.4", endurance: "+0", agility: "+0.2", mental: "+0.2", leadership: "+0", distance: "0 km", fightersTrained: 1 },
  { rank: 64, trainer: "0x104214922b8a3cabeae615379a50de1581bed607", totalProgress: "+0.25", endurance: "+0.25", agility: "+0", mental: "+0", leadership: "+0", distance: "2.48 km", fightersTrained: 1 },
  { rank: 65, trainer: "0xa96d4549729c2a826237d91b3a3700cad7dfec4a", totalProgress: "+0.2", endurance: "+0.2", agility: "+0", mental: "+0", leadership: "+0", distance: "1 km", fightersTrained: 1 },
  { rank: 66, trainer: "0x87f29c9fab2eb13cf5706d8b6f3fef021d5e48a2", totalProgress: "+0.1", endurance: "+0", agility: "+0", mental: "+0.1", leadership: "+0", distance: "0 km", fightersTrained: 1 },
  { rank: 67, trainer: "0xebe48fd96196f51471f177276c92bc1d40049be1", totalProgress: "+0.1", endurance: "+0", agility: "+0", mental: "+0.1", leadership: "+0", distance: "0 km", fightersTrained: 1 },
  { rank: 68, trainer: "0xfd6bda31d30b53c08d442e5bfa061d121b86c886", totalProgress: "+0.1", endurance: "+0", agility: "+0", mental: "+0.1", leadership: "+0", distance: "0 km", fightersTrained: 1 },
];

const activityBase: ActivityRow[] = [
  { rank: 1, walletAddress: "0xfea60461324cfa6d07cfe1551599f2bb139c3543", totalDistance: "2088.16 km", yogaSessions: 0, meditationSessions: 6 },
  { rank: 2, walletAddress: "0x9c54a9c609212d2fd034b55cf3b42ba99af52880", totalDistance: "1403.32 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 3, walletAddress: "0x878ec6839c1bbf85f61b34433e84fa225948e8f1", totalDistance: "1033.56 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 4, walletAddress: "0x72fe3c398c9a030b9b2be1fe1ff07701167571d4", totalDistance: "983.61 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 5, walletAddress: "0x9967a3a28a6549df43d07790e927cca0ea4534ba", totalDistance: "817.65 km", yogaSessions: 31, meditationSessions: 30 },
  { rank: 6, walletAddress: "0xa4ac3321fd639a7e2b53da62897955d920c97012", totalDistance: "774.25 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 7, walletAddress: "0x81cc15402a47f18e210aa57fb9370a1b5525047e", totalDistance: "768.98 km", yogaSessions: 1, meditationSessions: 6 },
  { rank: 8, walletAddress: "0x7a76b0d5b2c52b7769caab48bf5a91527c5ccdb0", totalDistance: "673 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 9, walletAddress: "0x6eb6e110b902c101f9ebef428fad9a29c89664d8", totalDistance: "649.81 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 10, walletAddress: "0x71aca10a08dee56abeef5324ade5801350ac4c98", totalDistance: "601.34 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 11, walletAddress: "0x714ed29b273dda8feeec2ec1f75509b34b2d5953", totalDistance: "458.44 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 12, walletAddress: "0x8f052c26f086a90059b53d269ea44b79c6be255b", totalDistance: "395.21 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 13, walletAddress: "0xf8d0c9f300d0649861963ebae0bb568533619448", totalDistance: "382.39 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 14, walletAddress: "0x19038313876815e89d30422def403282bbe33293", totalDistance: "312.82 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 15, walletAddress: "0x7b5af6790381f932abae790e8b0d0ff50e287f8e", totalDistance: "312.32 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 16, walletAddress: "0x1a6f0dddb884854355023a2dfe26e9174f8e0290", totalDistance: "273.21 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 17, walletAddress: "0x9fca5cb296333aa780d3367951f766ab3d7d4098", totalDistance: "227.86 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 18, walletAddress: "0x58b249a73452f624d473459fa084792704e9ae36", totalDistance: "166.3 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 19, walletAddress: "0xb38bd68a6f0ba599808d65c7a9cf2a428105b680", totalDistance: "164.76 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 20, walletAddress: "0xb3623d62ff30fadb5b2e127c07cab0d1b0808276", totalDistance: "155.28 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 21, walletAddress: "0x6e63a4caeccb4f341ee9c9175c9cc554bdb6d10b", totalDistance: "139.6 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 22, walletAddress: "0xa9b21f07bd651f1905bf581287743a4bbe4974db", totalDistance: "135.3 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 23, walletAddress: "0x4164ae191d2b7166823412f69505b4cb5a5a29f5", totalDistance: "118.32 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 24, walletAddress: "0x620051b8553a724b742ae6ae9cc3585d29f49848", totalDistance: "78.32 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 25, walletAddress: "0xbea2773ce1ee42dbd6677b3c246b2a40676474cf", totalDistance: "72.18 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 26, walletAddress: "0x92c70f31efa47bd08b65f36079fba5668f3050c4", totalDistance: "70.5 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 27, walletAddress: "0x1f2a9082a7692ad4f1049b573313c52e49400137", totalDistance: "67.47 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 28, walletAddress: "0x6b347a82fcac4e6a38d1fc40e3631bd8f9495e9f", totalDistance: "64.25 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 29, walletAddress: "0xca5ef762efd4708739b42334de7535bedee7c9b8", totalDistance: "63.7 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 30, walletAddress: "0x3fff64bfa2e9d90e6dbcde033b0933e20da70b52", totalDistance: "54.43 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 31, walletAddress: "0xd62e21d5acc7178bd6d9a3f71512e249cbed2cf4", totalDistance: "48.8 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 32, walletAddress: "0x2f77ca1ae1c1910731e57731595dc1a51cadf50b", totalDistance: "48.49 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 33, walletAddress: "0x159df20083f0c238b70f572c133b45ce3c1f6c0c", totalDistance: "48.47 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 34, walletAddress: "0xb3c3cac4ddaabb4a4b2affbdf0034ff6bd4535b8", totalDistance: "45.4 km", yogaSessions: 9, meditationSessions: 6 },
  { rank: 35, walletAddress: "0xce0f34368843b64507647d2d0f95c4ee62089725", totalDistance: "37.74 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 36, walletAddress: "0xa86cd6bfe453ad3bd3bfbb263d223a1a39eebeab", totalDistance: "37.14 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 37, walletAddress: "0xd878df00c38a587c33774620d31a3f93a5979420", totalDistance: "36.66 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 38, walletAddress: "0x87a8edd66faa4a8d2c6591f05207b6254c3fff31", totalDistance: "32.49 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 39, walletAddress: "0x4ae89d420ebacaad0afcbd924857b084db0c3970", totalDistance: "31.83 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 40, walletAddress: "0x6ad312bd13d4f7a199c86e1a4bacf76c630009a9", totalDistance: "31.28 km", yogaSessions: 0, meditationSessions: 5 },
  { rank: 41, walletAddress: "0x0eff6f5a6afbf8a69559d25e107f206ba4119b57", totalDistance: "27.53 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 42, walletAddress: "0x13d735a4d5e966b8f7b19fc2f476bfc25c0fc7dc", totalDistance: "26.81 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 43, walletAddress: "0x5108d9ad6dd9491be41c771042479871593b70b4", totalDistance: "25.15 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 44, walletAddress: "0x1035d18b286e9d2f2dc1b7169dc5ad80938b339a", totalDistance: "22.84 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 45, walletAddress: "0xb5eb18472a18d765824243234cb012da71df836f", totalDistance: "21.35 km", yogaSessions: 3, meditationSessions: 2 },
  { rank: 46, walletAddress: "0xf2b412ee5c9c5c188cabcdb35a91dee56c6672bc", totalDistance: "21.25 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 47, walletAddress: "0xadee5ee18e77ccee0717b707d28d589292b65c9c", totalDistance: "16.92 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 48, walletAddress: "0x352221a878ae7d7caed0bf216580f76487ce65db", totalDistance: "16.4 km", yogaSessions: 7, meditationSessions: 0 },
  { rank: 49, walletAddress: "0xf285e90a645e76dc4f77aa53d0cb15319ebfb87c", totalDistance: "16.15 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 50, walletAddress: "0xccde2255349cdd25c935128b90d682f3d592acaf", totalDistance: "15.5 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 51, walletAddress: "0xb1478f4447f9d96b628a542f342e4b50aa2b5458", totalDistance: "14.03 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 52, walletAddress: "0x45742d640011084bccd9cbc55dfe15671f694aca", totalDistance: "11.61 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 53, walletAddress: "0xf8ff5350c55d2e40f3123fc51d21ff6f2ac8c7bb", totalDistance: "10.66 km", yogaSessions: 1, meditationSessions: 0 },
  { rank: 54, walletAddress: "0x9e680f3d7566464b3b3e63c9ad37dc2b9e5452e2", totalDistance: "6.48 km", yogaSessions: 1, meditationSessions: 1 },
  { rank: 55, walletAddress: "0xda8d95cdf11792975190f8b1d6e5431746c71926", totalDistance: "4.84 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 56, walletAddress: "0x98175fcafcbd021769431b29bcc8fa7d7408e5fa", totalDistance: "4.77 km", yogaSessions: 0, meditationSessions: 1 },
  { rank: 57, walletAddress: "0xf8dfebf498f5c995b97b0b0b21bfcf54440e8bc9", totalDistance: "3.81 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 58, walletAddress: "0xee49f82e58a1c2b306720d0c68047cbf70c11fb5", totalDistance: "3.52 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 59, walletAddress: "0x52ece072cf4950ea3f32833f54299cfea3fd94af", totalDistance: "3.51 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 60, walletAddress: "0x104214922b8a3cabeae615379a50de1581bed607", totalDistance: "2.48 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 61, walletAddress: "0xa96d4549729c2a826237d91b3a3700cad7dfec4a", totalDistance: "1 km", yogaSessions: 0, meditationSessions: 0 },
  { rank: 62, walletAddress: "0x2d11655e158a6713c407c3bd8219685970aa012a", totalDistance: "0 km", yogaSessions: 4, meditationSessions: 4 },
  { rank: 63, walletAddress: "0x6ff3efc06aaee79776207c95bde5763e4af55a8b", totalDistance: "0 km", yogaSessions: 2, meditationSessions: 0 },
  { rank: 64, walletAddress: "0x87f29c9fab2eb13cf5706d8b6f3fef021d5e48a2", totalDistance: "0 km", yogaSessions: 0, meditationSessions: 1 },
  { rank: 65, walletAddress: "0xa52ed71d0776bc110da5d62372d83178b3c48314", totalDistance: "0 km", yogaSessions: 5, meditationSessions: 0 },
  { rank: 66, walletAddress: "0xdd8b4c19ebbfaca1752d592582a6b086e7016d61", totalDistance: "0 km", yogaSessions: 2, meditationSessions: 0 },
  { rank: 67, walletAddress: "0xebe48fd96196f51471f177276c92bc1d40049be1", totalDistance: "0 km", yogaSessions: 0, meditationSessions: 1 },
  { rank: 68, walletAddress: "0xfd6bda31d30b53c08d442e5bfa061d121b86c886", totalDistance: "0 km", yogaSessions: 0, meditationSessions: 1 },
];

const fighterData: Record<(typeof timeFilters)[number], FighterRow[]> = {
  Total: fighterBase,
  Cycle: rotate(fighterBase, 1).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Week: rotate(fighterBase, 2).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Day: rotate(fighterBase, 3).map((row, idx) => ({ ...row, rank: idx + 1 })),
};

const trainerData: Record<(typeof timeFilters)[number], TrainerRow[]> = {
  Total: trainerBase,
  Cycle: rotate(trainerBase, 1).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Week: rotate(trainerBase, 2).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Day: rotate(trainerBase, 3).map((row, idx) => ({ ...row, rank: idx + 1 })),
};

const activityData: Record<(typeof timeFilters)[number], ActivityRow[]> = {
  Total: activityBase,
  Cycle: rotate(activityBase, 1).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Week: rotate(activityBase, 2).map((row, idx) => ({ ...row, rank: idx + 1 })),
  Day: rotate(activityBase, 3).map((row, idx) => ({ ...row, rank: idx + 1 })),
};

export default function LeaderboardPage() {
  const [activeView, setActiveView] = useState<(typeof viewTabs)[number]>(
    "Fighter Rank",
  );
  const [activeTime, setActiveTime] = useState<(typeof timeFilters)[number]>(
    "Total",
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { getProfileForWallet } = useUserProfile();

  // Simulate loading state on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Handle view change with transition
  const handleViewChange = (view: (typeof viewTabs)[number]) => {
    if (view !== activeView) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveView(view);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Handle time filter change with transition
  const handleTimeChange = (time: (typeof timeFilters)[number]) => {
    if (time !== activeTime) {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTime(time);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const tableConfig = useMemo(() => {
    if (activeView === "Fighter Rank") {
      return {
        headers: [
          "Rank",
          "", // Empty header for avatar column
          "Fighter TokenId",
          "Fighter Name",
          "Endurance",
          "Agility",
          "Mental Strength",
          "Leadership",
          "Distance Applied",
          "Buy",
        ],
        rows: fighterData[activeTime],
      };
    }
    if (activeView === "Trainer Rank") {
      return {
        headers: ["Rank", "Trainer", "Total Progress", "Endurance", "Agility", "Mental Strength", "Leadership", "Distance Applied", "Fighters Trained"],
        rows: trainerData[activeTime],
      };
    }
    if (activeView === "Activity") {
    return {
        headers: ["Rank", "Wallet Address", "Total Distance", "Yoga Sessions", "Meditation Sessions"],
      rows: activityData[activeTime],
      };
    }
    return {
      headers: [],
      rows: [],
    };
  }, [activeView, activeTime]);

  return (
    <main className="leaderboard_main__wrapper" style={{ backgroundColor: "#000", color: "white" }}>
      <div className="leaderboard_container__yi1Tg">
        {isLoading ? (
          <div className="leaderboard_loading__container">
            <div className="leaderboard_loading__spinner"></div>
            <p className="leaderboard_loading__text">Loading leaderboard...</p>
          </div>
        ) : (
          <>
            <div className="leaderboard_tabs__HF7BZ" style={{ display: "flex", gap: "10px" }}>
              {viewTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleViewChange(tab)}
                  className={`leaderboard_mytab__Y2Oml ${
                    activeView === tab ? "leaderboard_activeTab__or1Dd" : ""
                  }`}
                  aria-pressed={activeView === tab}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="leaderboard_filter__o7v8T">
              <div className="leaderboard_durationButtons__v__oa">
                {timeFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => handleTimeChange(filter)}
                    className={`leaderboard_durationButton__CpZ0D ${
                      activeTime === filter ? "leaderboard_active__nuLns" : ""
                    }`}
                    aria-pressed={activeTime === filter}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
            {/* Podium Section - Top 3 Fighters */}
        {activeView === "Fighter Rank" && (() => {
          const currentFighters = fighterData[activeTime];
          const top3 = currentFighters.slice(0, 3);
          const first = top3[0];
          const second = top3[1];
          const third = top3[2];
          
          // Extract fighter name without #number
          const getFighterName = (fullName: string) => fullName.split(" #")[0].trim();
          
          return (
            <div className="leaderboard_podium__0p1Cr">
              <div className="leaderboard_podiumSecond__OWJ96">
                <div className="leaderboard_podiumRank__vKXZQ">🥈</div>
                <img
                  alt={second?.name || "Second Place"}
                  className="leaderboard_podiumImage__YhKr0"
                  src={second?.image || "/assets/defaultnft.png"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("defaultnft.png")) {
                      target.src = "/assets/defaultnft.png";
                    }
                  }}
                />
                <div className="leaderboard_podiumName__m0h1L">{getFighterName(second?.name || "")}</div>
              </div>
              <div className="leaderboard_podiumFirst__jtsoy">
                <div className="leaderboard_podiumRank__vKXZQ">🥇</div>
                <img
                  alt={first?.name || "First Place"}
                  className="leaderboard_podiumImage__YhKr0"
                  src={first?.image || "/assets/defaultnft.png"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("defaultnft.png")) {
                      target.src = "/assets/defaultnft.png";
                    }
                  }}
                />
                <div className="leaderboard_podiumName__m0h1L">{getFighterName(first?.name || "")}</div>
              </div>
              <div className="leaderboard_podiumThird__6Cmo8">
                <div className="leaderboard_podiumRank__vKXZQ">🥉</div>
                <img
                  alt={third?.name || "Third Place"}
                  className="leaderboard_podiumImage__YhKr0"
                  src={third?.image || "/assets/defaultnft.png"}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes("defaultnft.png")) {
                      target.src = "/assets/defaultnft.png";
                    }
                  }}
                />
                <div className="leaderboard_podiumName__m0h1L">{getFighterName(third?.name || "")}</div>
              </div>
            </div>
          );
        })()}
      <div className={`leaderboard_content__hAO2Y ${isTransitioning ? "leaderboard_fade__transition" : ""}`}>
        
        <table className="leaderboard_table__E12wC">
          <thead>
            <tr>
              {tableConfig.headers.map((header) => (
                <th key={header}>
                  {header === "Total Distance" ? (
                    <>
                      Total Distance
                      <span className="leaderboard_tooltip__7a4Ml">
                        <span className="leaderboard_tooltipIcon__Bxvxg">?</span>
                        <span className="leaderboard_tooltipText__d__B5">
                          Includes all distance during the cycles regardless if it&apos;s been applied to fighters
                        </span>
                      </span>
                    </>
                  ) : (
                    header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {activeView === "Fighter Rank" &&
              (tableConfig.rows as FighterRow[]).map((row) => {
                // Token ID is already numeric (no # prefix in the data)
                const numericTokenId = row.tokenId;
                const mintifyUrl = `https://mintify.xyz/nft/shape/${NFT_CONTRACT_ADDRESS}/${numericTokenId}`;
                const openseaUrl = `https://opensea.io/item/shape/${NFT_CONTRACT_ADDRESS}/${numericTokenId}`;
                
                return (
                <tr key={`${row.tokenId}-${activeTime}`}>
                    <td className="leaderboard_myrank__oPeYH" data-label="Rank">{row.rank}</td>
                    <td data-label="">
                      <a
                        href={openseaUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt={`${row.name} ${row.tokenId}`}
                          className="leaderboard_fighterImage__RnmbX"
                          src={row.image || "/assets/defaultnft.png"}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            if (!target.src.includes("defaultnft.png")) {
                              target.src = "/assets/defaultnft.png";
                            }
                          }}
                        />
                      </a>
                    </td>
                    <td data-label="Token ID">{numericTokenId}</td>
                  <td data-label="Fighter Name">{row.name}</td>
                  <td data-label="Endurance">
                    {row.endurance}
                    {row.enduranceDelta && (
                      <span className={row.enduranceDelta !== "+0" && parseFloat(row.enduranceDelta) > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>
                        {" "}({row.enduranceDelta})
                      </span>
                    )}
                  </td>
                  <td data-label="Agility">
                    {row.agility}
                    {row.agilityDelta && (
                      <span className={row.agilityDelta !== "+0" && parseFloat(row.agilityDelta) > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>
                        {" "}({row.agilityDelta})
                      </span>
                    )}
                  </td>
                  <td data-label="Mental">
                    {row.mental}
                    {row.mentalDelta && (
                      <span className={row.mentalDelta !== "+0" && parseFloat(row.mentalDelta) > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>
                        {" "}({row.mentalDelta})
                      </span>
                    )}
                  </td>
                  <td data-label="Leadership">
                    {row.leadership}
                    {row.leadershipDelta && (
                      <span className={row.leadershipDelta !== "+0" && parseFloat(row.leadershipDelta) > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>
                        {" "}({row.leadershipDelta})
                      </span>
                    )}
                  </td>
                  <td data-label="Distance">{row.distance}</td>
                    <td data-label="Buy">
                      <a
                        href={mintifyUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: "inline-block", marginRight: "8px" }}
                      >
                        <img
                          alt="Mintify"
                          className="leaderboard_iconImage__ZoXDI"
                          src="/assets/mintify.jpeg"
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
                        style={{ display: "inline-block" }}
                      >
                        <img
                          alt="OpenSea"
                          className="leaderboard_iconImage__ZoXDI"
                          src="/assets/opensea.png"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                      </a>
                  </td>
                </tr>
                );
              })}
            {activeView === "Trainer Rank" &&
              (tableConfig.rows as TrainerRow[]).map((row) => {
                // Format rank with emoji for top 3, matching reference site spacing
                const rankDisplay = row.rank === 1 ? " 🥇   1" : row.rank === 2 ? "  🥈  2" : row.rank === 3 ? "   🥉 3" : `    ${row.rank}`;
                
                // Get profile for this trainer's wallet
                const trainerProfile = getProfileForWallet(row.trainer);
                const displayName = trainerProfile?.username || row.trainer;
                const displayAvatar = trainerProfile?.avatar;
                
                return (
                <tr key={`${row.trainer}-${activeTime}`}>
                    <td data-label="Rank">{rankDisplay}</td>
                    <td className="leaderboard_trainer_address__KF5EY" data-label="Trainer">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {displayAvatar && (
                          <img
                            src={displayAvatar}
                            alt={displayName}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "2px solid #d34836",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <span>{displayName}</span>
                      </div>
                    </td>
                    <td className="leaderboard_totalProgress__f_jyN" data-label="Total Progress">{row.totalProgress}</td>
                  <td data-label="Endurance">{row.endurance}</td>
                  <td data-label="Agility">{row.agility}</td>
                  <td data-label="Mental">{row.mental}</td>
                  <td data-label="Leadership">{row.leadership}</td>
                  <td data-label="Distance">{row.distance}</td>
                    <td data-label="Fighters Trained">{row.fightersTrained}</td>
                </tr>
                );
              })}
            {activeView === "Activity" &&
              (tableConfig.rows as ActivityRow[]).map((row) => {
                // Format rank with emoji for top 3, matching reference site spacing
                const rankDisplay = row.rank === 1 ? " 🥇   1" : row.rank === 2 ? "  🥈  2" : row.rank === 3 ? "   🥉 3" : `    ${row.rank}`;
                
                // Get profile for this wallet
                const walletProfile = getProfileForWallet(row.walletAddress);
                const displayName = walletProfile?.username || row.walletAddress;
                const displayAvatar = walletProfile?.avatar;
                
                return (
                  <tr key={`${row.walletAddress}-${activeTime}`}>
                    <td data-label="Rank">{rankDisplay}</td>
                    <td className="leaderboard_trainer_address__KF5EY" data-label="Wallet Address">
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {displayAvatar && (
                          <img
                            src={displayAvatar}
                            alt={displayName}
                            style={{
                              width: "32px",
                              height: "32px",
                              borderRadius: "50%",
                              border: "2px solid #d34836",
                              objectFit: "cover",
                            }}
                          />
                        )}
                        <span>{displayName}</span>
                      </div>
                    </td>
                    <td data-label="Total Distance">{row.totalDistance}</td>
                    <td data-label="Yoga Sessions" className={row.yogaSessions > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>{row.yogaSessions}</td>
                    <td data-label="Meditation Sessions" className={row.meditationSessions > 0 ? "leaderboard_greenDelta__TDX6Z" : ""}>{row.meditationSessions}</td>
                </tr>
                );
              })}
          </tbody>
            </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}


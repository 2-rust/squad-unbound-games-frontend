"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    href: "/leaderboard",
    label: "Leaderboard",
  },
  {
    href: "/profile",
    label: "Profile",
  },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="nav_navbar__dHFWK px-2 py-8 sm:px-6">
      <div className="nav_logo__RNJOQ">
        <Link href="/" className="nav_logoimg__0IosO">
          <Image
            src="/assets/sitelogo.png"
            alt="Fighters Unbound"
            width={60}
            height={60}
            priority
            className="nav_logoimg__0IosO"
          />
        </Link>
      </div>
      <div className="nav_navright__R_2jL">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`nav_leaderboardLink__Vf6MI ${
              pathname === link.href ? "text-ember" : ""
            }`}
          >
            {link.href === "/leaderboard" ? (
              <>
                <div className="nav_trophyIcon__c74LO">
                  <div
                    className="nav_trophyEmoji__shiny"
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    🏆
                  </div>
                </div>
                {/* <span className="hidden sm:inline">Leaderboard</span> */}
              </>
            ) : (
              <>
                <div className="nav_trophyIcon__c74LO">
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "20px",
                    }}
                  >
                    👤
                  </div>
                </div>
                {/* <span className="hidden sm:inline">{link.label}</span> */}
              </>
            )}
          </Link>
        ))}
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            mounted,
          }) => {
            const ready = mounted;
            const connected = ready && account && chain;

            if (!connected) {
              return (
                <button
                  type="button"
                  className="connectbutton_redConnectButton__SrvWE rounded-full px-6 py-3 text-base"
                  onClick={openConnectModal}
                >
                  CONNECT WALLET
                </button>
              );
            }

            return (
              <>
                <button
                  type="button"
                  className="connectbutton_blackConnectButtonSmall__MDYTu rounded-full px-4 py-2 text-sm"
                  onClick={openChainModal}
                >
                  <span className="mr-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[rgb(72,76,80)]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  {chain?.name ? chain.name.replace(/\s*Network\s*/gi, "").trim() || "Network" : "Network"}
                </button>
                <button
                  type="button"
                  className="connectbutton_blackConnectButtonSmall__MDYTu rounded-full px-4 py-2 text-sm"
                  onClick={openAccountModal}
                >
                  {account?.displayName}
                </button>
              </>
            );
          }}
        </ConnectButton.Custom>
        <button className="nav_menuButton__RMGek" type="button">
          ☰
        </button>
      </div>
    </nav>
  );
}


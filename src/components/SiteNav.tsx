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
    <nav className="navigation-bar px-2 py-8 sm:px-6">
      <div className="navigation-logo">
        <Link href="/" className="navigation-logo-link">
          <Image
            src="/assets/sitelogo.png"
            alt="Fighters Unbound"
            width={60}
            height={60}
            priority
            className="navigation-logo-image"
          />
        </Link>
      </div>
      <div className="navigation-right">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`navigation-leaderboard-link ${
              pathname === link.href ? "text-ember" : ""
            }`}
          >
            {link.href === "/leaderboard" ? (
              <>
                <div className="navigation-trophy-icon">
                  <div
                    className="navigation-trophy-emoji"
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
                <div className="navigation-trophy-icon">
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
                  className="connect-button connect-button--red rounded-full px-6 py-3 text-base"
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
                  className="connect-button connect-button--black connect-button--small rounded-full px-4 py-2 text-sm"
                  onClick={openChainModal}
                >
                  <span className="mr-1 inline-flex h-3 w-3 items-center justify-center rounded-full bg-[rgb(72,76,80)]">
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </span>
                  {chain?.name ? chain.name.replace(/\s*Network\s*/gi, "").trim() || "Network" : "Network"}
                </button>
                <button
                  type="button"
                  className="connect-button connect-button--black connect-button--small rounded-full px-4 py-2 text-sm"
                  onClick={openAccountModal}
                >
                  {account?.displayName}
                </button>
              </>
            );
          }}
        </ConnectButton.Custom>
        <button className="navigation-menu-button" type="button">
          ☰
        </button>
      </div>
    </nav>
  );
}


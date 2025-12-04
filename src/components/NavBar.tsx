import Image from "next/image";
import Link from "next/link";

type NavBarProps = {
  activeLink?: "home" | "leaderboard";
};

export function NavBar({ activeLink = "home" }: NavBarProps) {
  return (
    <nav className="navigation-bar">
      <div className="navigation-logo">
        <Link href="/" className="navigation-logo-link" aria-label="Squad Unbound">
          <Image
            src="/assets/sitelogo.png"
            alt="Squad Unbound logo"
            width={150}
            height={52}
            priority
            className="navigation-logo-image"
          />
        </Link>
      </div>
      <div className="navigation-right">
        <Link
          href="/leaderboard"
          className="navigation-leaderboard-link"
          aria-current={activeLink === "leaderboard" ? "page" : undefined}
        >
          <div
            className="navigation-trophy-icon"
            style={
              activeLink === "leaderboard"
                ? { border: "2px solid #DD4837", padding: "2px" }
                : undefined
            }
          >
            <Image
              src="/assets/leaderboard.png"
              alt="Leaderboard"
              width={24}
              height={24}
              className="navigation-trophy-image"
            />
          </div>
        </Link>
        <button
          className="connect-button connect-button--black connect-button--small"
          type="button"
        >
          Ethereum
        </button>
        <button
          className="connect-button connect-button--black connect-button--small"
          type="button"
        >
          0x6D…6C61
        </button>
        <button
          className="connect-button connect-button--red connect-button--small"
          type="button"
        >
          CONNECT WALLET
        </button>
        <button className="navigation-menu-button" type="button" aria-label="Open menu">
          ☰
        </button>
      </div>
    </nav>
  );
}


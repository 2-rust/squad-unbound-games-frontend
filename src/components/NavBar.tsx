import Image from "next/image";
import Link from "next/link";

type NavBarProps = {
  activeLink?: "home" | "leaderboard";
};

export function NavBar({ activeLink = "home" }: NavBarProps) {
  return (
    <nav className="nav_navbar__dHFWK">
      <div className="nav_logo__RNJOQ">
        <Link href="/" className="nav_logoimg__0IosO" aria-label="Squad Unbound">
          <Image
            src="/assets/sitelogo.png"
            alt="Squad Unbound logo"
            width={150}
            height={52}
            priority
            className="nav_logoimg__0IosO"
          />
        </Link>
      </div>
      <div className="nav_navright__R_2jL">
        <Link
          href="/leaderboard"
          className="nav_leaderboardLink__Vf6MI"
          aria-current={activeLink === "leaderboard" ? "page" : undefined}
        >
          <div
            className="nav_trophyIcon__c74LO"
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
              className="nav_trophyImage__JHT1V"
            />
          </div>
        </Link>
        <button
          className="connectbutton_blackConnectButtonSmall__MDYTu"
          type="button"
        >
          Ethereum
        </button>
        <button
          className="connectbutton_blackConnectButtonSmall__MDYTu"
          type="button"
        >
          0x6D…6C61
        </button>
        <button
          className="connectbutton_redConnectButtonSmall__GSJ3j"
          type="button"
        >
          CONNECT WALLET
        </button>
        <button className="nav_menuButton__RMGek" type="button" aria-label="Open menu">
          ☰
        </button>
      </div>
    </nav>
  );
}


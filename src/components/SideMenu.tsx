"use client";

type MenuItem = {
  readonly id: string;
  readonly label: string;
};

type SideMenuProps = {
  items: readonly MenuItem[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
};

export function SideMenu({ items, activeSection, onSectionChange, isCollapsed, onToggleCollapse }: SideMenuProps) {
  return (
    <div
      className={`side-menu-container ${
        isCollapsed ? "side-menu-container--collapsed" : ""
      }`}
    >
      <button
        className="side-menu-toggle-button"
        type="button"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? "→" : "←"}
      </button>
      {items.map((item, index) => (
        <a key={item.id} href={`#${item.id}`} className="side-menu-link">
          <button
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`side-menu-button ${
              activeSection === item.id ? "side-menu-button--active" : ""
            }`}
          >
            <span className="side-menu-circle">{index + 1}</span>
            <span className={`side-menu-label ${isCollapsed ? "side-menu-label--hidden" : ""}`}>
              {item.label}
            </span>
          </button>
        </a>
      ))}
    </div>
  );
}


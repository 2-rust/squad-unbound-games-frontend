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
      className={`sidemenu_container__awJ5O ${
        isCollapsed ? "sidemenu_collapsed__6CvqR" : ""
      }`}
    >
      <button
        className="sidemenu_toggleButton__y__f8"
        type="button"
        onClick={onToggleCollapse}
      >
        {isCollapsed ? "→" : "←"}
      </button>
      {items.map((item, index) => (
        <a key={item.id} href={`#${item.id}`} className="sidemenu_link__ax8_1">
          <button
            type="button"
            onClick={() => onSectionChange(item.id)}
            className={`sidemenu_button__PBtjJ ${
              activeSection === item.id ? "sidemenu_active__IIi8d" : ""
            }`}
          >
            <span className="sidemenu_circle__o5fCj">{index + 1}</span>
            <span className={`sidemenu_label__text ${isCollapsed ? "sidemenu_label_hidden__xyz" : ""}`}>
              {item.label}
            </span>
          </button>
        </a>
      ))}
    </div>
  );
}


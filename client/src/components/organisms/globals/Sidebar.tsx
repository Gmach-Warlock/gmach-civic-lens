import { useEffect } from "react";

export interface SidebarLink {
  label: string;
  href: string;
  icon?: string; // If you want to pass custom icon names later
}

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  // Prevent background scrolling when the sidebar/drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop overlay to close the menu when clicking outside */}
      <div
        className={`c-sidebar-overlay ${isOpen ? "c-sidebar-overlay--active" : ""}`}
        onClick={onClose}
      />

      {/* Main Navigation Drawer */}
      <aside className={`c-sidebar ${isOpen ? "c-sidebar--open" : ""}`}>
        <div className="c-sidebar__header">
          <span className="c-sidebar__brand">Civic Lens</span>
          <button
            type="button"
            className="c-sidebar__close-btn"
            onClick={onClose}
            aria-label="Close menu"
          >
            &times;
          </button>
        </div>

        <nav className="c-sidebar__nav">
          <ul className="c-sidebar__list">
            <li className="c-sidebar__item">
              <a href="/dashboard" className="c-sidebar__link">
                Dashboard
              </a>
            </li>
            <li className="c-sidebar__item">
              <a href="/reports" className="c-sidebar__link">
                Infrastructure Reports
              </a>
            </li>
            <li className="c-sidebar__item">
              <a
                href="/settings"
                className="c-sidebar__link c-sidebar__link--active"
              >
                Settings
              </a>
            </li>
          </ul>
        </nav>

        <div className="c-sidebar__footer">
          <p className="c-sidebar__version">v1.0.0</p>
        </div>
      </aside>
    </>
  );
}

import { useEffect } from "react";
import { NavLink } from "react-router";
import Button from "../../atoms/controls/Button";
import Icon from "../../atoms/controls/Icon";
import { useAppDispatch } from "../../../app/hooks/generalHooks";
import { addToast } from "../../../features/global/globalSlice";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filter: "all" | "mine";
  setFilter: (filter: "all" | "mine") => void;
  setSearchQuery?: (query: string) => void;
  onNotReady: (feature: string) => void;
  isAuthenticated: boolean;
}

export function Sidebar({
  isOpen,
  onClose,

  setSearchQuery,
  onNotReady,
  isAuthenticated,
}: SidebarProps) {
  const dispatch = useAppDispatch();

  // Helper for "Coming Soon" features
  const triggerNotReady = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    onNotReady(feature);
  };

  // Helper for Protected features
  const handleProtectedClick = (e: React.MouseEvent, path: string) => {
    if (!isAuthenticated) {
      e.preventDefault();
      console.log(path);
      onClose();
      dispatch(
        addToast({
          message: "You must be logged in to access this area. Redirecting...",
          type: "error",
        }),
      );
      // Explicitly navigate them to the login page
      // Note: You might need to import useNavigate in Sidebar.tsx
      // Or just use window.location.href = '/login' for a simple force-redirect
      window.location.href = "/login";
    } else {
      // If authorized, just handle mobile close behavior
      if (window.innerWidth < 768) onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      <div
        className={`c-sidebar-overlay ${isOpen ? "c-sidebar-overlay--active" : ""}`}
        onClick={onClose}
      />

      <aside className={`c-sidebar ${isOpen ? "c-sidebar--open" : ""}`}>
        <div className="c-sidebar__header">
          <span className="c-sidebar__brand">Civic Lens</span>
          <button
            type="button"
            className="c-sidebar__close-btn"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        <nav className="c-sidebar__nav">
          <ul className="c-sidebar__list">
            {/* PROTECTED: Dashboard */}
            <li className="c-sidebar__item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `c-sidebar__link ${isActive ? "c-sidebar--active" : ""}`
                }
                onClick={(e) => handleProtectedClick(e, "/dashboard")}
              >
                Dashboard
              </NavLink>
            </li>

            {/* PROTECTED: Settings */}
            <li className="c-sidebar__item">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `c-sidebar__link ${isActive ? "c-sidebar--active" : ""}`
                }
                onClick={(e) => handleProtectedClick(e, "/settings")}
              >
                Settings
              </NavLink>
            </li>

            <li aria-hidden="true">
              <hr className="c-sidebar__divider" />
            </li>

            {/* PROTECTED: Report Issue */}
            <li className="c-sidebar__item c-sidebar__item--cta">
              <NavLink
                to="/reports/new"
                className="c-sidebar__btn-link"
                onClick={(e) => handleProtectedClick(e, "/reports/new")}
              >
                Report an Issue <Icon name="megaphone" />
              </NavLink>
            </li>

            <li aria-hidden="true">
              <hr className="c-sidebar__divider" />
            </li>

            {/* NOT READY: Feed Controls */}
            <li className="c-sidebar__section">
              <span className="c-sidebar__label">FEED FILTER</span>
              <div className="c-sidebar__search-container">
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="c-sidebar__search-input"
                  onChange={(e) => setSearchQuery?.(e.target.value)}
                />
                <Button
                  name="search-sidebar"
                  onClick={(e) => triggerNotReady(e, "Search")}
                >
                  <Icon name="magnifying-glass" />
                </Button>
              </div>

              <div className="c-sidebar__filter-group">
                <Button
                  name="all"
                  onClick={(e) => triggerNotReady(e, "Filter")}
                >
                  All
                </Button>
                <Button
                  name="mine"
                  onClick={(e) => triggerNotReady(e, "Filter")}
                >
                  Mine
                </Button>
              </div>
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

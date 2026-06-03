import {
  useEffect,
  type Dispatch,
  type SetStateAction,
  type MouseEvent,
} from "react";
import { NavLink, useNavigate } from "react-router";
import { useAppDispatch } from "../../../app/hooks/generalHooks";
import { addToast } from "../../../features/global/globalSlice";
import Button from "../../atoms/controls/Button";
import Icon from "../../atoms/controls/Icon";

export interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  filter: "all" | "mine";
  setFilter: Dispatch<SetStateAction<"all" | "mine">>;
  setSearchQuery?: (query: string) => void;
  isLoggedIn: boolean;
}

export function Sidebar({
  isOpen,
  onClose,
  filter,
  setFilter,
  setSearchQuery,
  isLoggedIn,
}: SidebarProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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

  /**
   * The "Retail Manager" Guard
   * Intercepts unauthorized clicks and redirects to Login.
   */
  const handleProtectedAction = (
    e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    isPunitive = false,
  ) => {
    if (!isLoggedIn) {
      e.preventDefault();

      dispatch(
        addToast({
          message: isPunitive
            ? "Access Denied: You must be logged in to report issues."
            : "Authorization required to access this feature.",
          type: "error",
        }),
      );

      onClose();
      navigate("/login");
    } else {
      // Close sidebar on mobile after a successful action
      if (window.innerWidth < 768) onClose();
    }
  };

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
            <li className="c-sidebar__item">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  `c-sidebar__link ${isActive ? "c-sidebar__link--active" : ""}`
                }
                onClick={(e) => handleProtectedAction(e)}
              >
                Dashboard
              </NavLink>
            </li>

            <li className="c-sidebar__item">
              <NavLink
                to="/settings"
                className={({ isActive }) =>
                  `c-sidebar__link ${isActive ? "c-sidebar__link--active" : ""}`
                }
                onClick={(e) => handleProtectedAction(e)}
              >
                Settings
              </NavLink>
            </li>

            <li aria-hidden="true">
              <hr className="c-sidebar__divider" />
            </li>

            <li className="c-sidebar__item c-sidebar__item--cta">
              <NavLink
                to="/reports/new"
                className="c-sidebar__btn-link"
                onClick={(e) => handleProtectedAction(e, true)}
              >
                Report an Issue <Icon name="megaphone" />
              </NavLink>
            </li>

            <li aria-hidden="true">
              <hr className="c-sidebar__divider" />
            </li>

            <li className="c-sidebar__section">
              <span className="c-sidebar__label">FEED FILTER</span>

              <div className="c-sidebar__search-container">
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="c-sidebar__search-input"
                  onFocus={() => {
                    if (!isLoggedIn) {
                      dispatch(
                        addToast({
                          message: "Login to search current issues.",
                          type: "info",
                        }),
                      );
                    }
                  }}
                  onChange={(e) => {
                    if (isLoggedIn) setSearchQuery?.(e.target.value);
                  }}
                />
                <Button
                  name="search-sidebar"
                  onClick={(e) => handleProtectedAction(e)}
                >
                  <Icon name="magnifying-glass" />
                </Button>
              </div>

              <div className="c-sidebar__filter-group">
                <Button
                  name="all"
                  className={filter === "all" ? "is-active" : ""}
                  onClick={(e) =>
                    isLoggedIn ? setFilter("all") : handleProtectedAction(e)
                  }
                >
                  All
                </Button>
                <Button
                  name="mine"
                  className={filter === "mine" ? "is-active" : ""}
                  onClick={(e) =>
                    isLoggedIn ? setFilter("mine") : handleProtectedAction(e)
                  }
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

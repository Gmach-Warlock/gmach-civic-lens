import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { toggleTheme, addToast } from "../../../features/global/globalSlice";
import { selectTheme } from "../../../features/global/globalSelectors";
import { selectUser } from "../../../features/auth/selectors/authSelectors";

import Header from "../globals/Header";
import { Sidebar } from "../globals/Sidebar";
import SearchBar from "../../molecules/actions/SearchBar";
import AuthNav from "../../molecules/actions/AuthNav";
import Switch from "../../atoms/controls/Switch";
import Icon from "../../atoms/controls/Icon";

export default function DoubleBarHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "mine">("all");
  const [searchQuery, setSearchQuery] = useState("");
  // 1. New state for the merchandising highlight
  const [shouldHighlightAuth, setShouldHighlightAuth] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentTheme = useAppSelector(selectTheme);
  const user = useAppSelector(selectUser);

  const toggleSidebar = () => {
    // If user is not logged in and we are about to OPEN the menu
    if (!isLoggedIn && !isSidebarOpen) {
      dispatch(
        addToast({
          message:
            "Guest Mode: Dashboard and Reporting features are restricted.",
          type: "info",
        }),
      );
    }
    setIsSidebarOpen(!isSidebarOpen);
  };
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleThemeToggle = () => dispatch(toggleTheme());

  const isLoggedIn = !!user?.general?.email || !!user?.meta.id;

  const handleCog = () => {
    if (!isLoggedIn) {
      dispatch(
        addToast({
          message: "Authorization required. Please login to access settings.",
          type: "error",
        }),
      );
      // Trigger highlight even on cog click for consistency
      setShouldHighlightAuth(true);
      setTimeout(() => setShouldHighlightAuth(false), 5000);
      navigate("/login");
      return;
    }
    navigate("/settings");
  };

  const handleSearch = (query: string) => {
    console.log(searchQuery);
    // 2. The Slick Auth Guard for Search
    if (!isLoggedIn) {
      dispatch(
        addToast({
          message: "Please Register or Login to search the database.",
          type: "info",
        }),
      );

      // Trigger the glare swipe highlight on AuthNav
      setShouldHighlightAuth(true);
      setTimeout(() => setShouldHighlightAuth(false), 1200);
      return;
    }

    setSearchQuery(query);
    if (window.location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
    console.log("Global Search Triggered:", query);
  };

  return (
    <Header
      currentTheme={currentTheme}
      topBarLeft={<SearchBar onSearch={handleSearch} />}
      topBarRight={
        <>
          <Icon name="gear" onClick={handleCog} />
          <Switch
            checked={currentTheme === "dark"}
            onChange={handleThemeToggle}
            label="Toggle Dark/Light Mode"
          />
        </>
      }
      bottomBarLeft={<span>{user?.general?.firstName || "Guest"}</span>}
      // 3. Wrap AuthNav in the trigger class
      bottomBarCenter={
        <div className={shouldHighlightAuth ? "auth-highlight-trigger" : ""}>
          <AuthNav />
        </div>
      }
      bottomBarRight={<Icon name="bars" onClick={toggleSidebar} />}
      sidebar={
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          filter={filter}
          setFilter={setFilter}
          setSearchQuery={setSearchQuery}
          // THE MISSING LINK: Pass the status down here
          isLoggedIn={isLoggedIn}
        />
      }
    />
  );
}

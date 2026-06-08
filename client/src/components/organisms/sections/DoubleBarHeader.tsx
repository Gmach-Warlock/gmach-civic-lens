import { useState } from "react";
import { useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { toggleTheme } from "../../../features/global/globalSlice";
import { selectTheme } from "../../../features/global/globalSelectors";

import Header from "../globals/Header";
import { Sidebar } from "../globals/Sidebar";
import SearchBar from "../../molecules/actions/SearchBar";
import AuthNav from "../../molecules/actions/AuthNav";
import Switch from "../../atoms/controls/Switch";
import Icon from "../../atoms/controls/Icon";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";
import { addToast } from "../../../features/global/globalSlice";

export default function DoubleBarHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentTheme = useAppSelector(selectTheme);
  const token = useAppSelector(selectAccessToken);

  const isAuthenticated = !!token;
  const [filter, setFilter] = useState<"all" | "mine">("all");

  const protectedNavigate = (path: string) => {
    if (isAuthenticated) {
      navigate(path);
    } else {
      dispatch(
        addToast({
          message: "You must be logged in to access this area.",
          type: "error",
        }),
      );
    }
  };

  const handleFeatureNotReady = (featureName: string) => {
    dispatch(
      addToast({
        message: `${featureName} is coming in the next update!`,
        type: "info",
      }),
    );
  };

  const toggleSidebar = () => {
    dispatch(
      addToast({
        message: "The sidebar features are currently under construction.",
        type: "info",
      }),
    );
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => setIsSidebarOpen(false);
  const handleThemeToggle = () => dispatch(toggleTheme());
  const handleSearch = (term: string) => {
    console.log("Term received by header:", term);
    handleFeatureNotReady("SearchBar");
  };
  const handleCog = () => protectedNavigate("/settings");

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
      bottomBarLeft={<span>GMach</span>}
      bottomBarCenter={<AuthNav />}
      bottomBarRight={<Icon name="bars" onClick={toggleSidebar} />}
      sidebar={
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          filter={filter}
          setFilter={setFilter}
          onNotReady={handleFeatureNotReady}
          isAuthenticated={isAuthenticated} // Pass the boolean here
        />
      }
    />
  );
}

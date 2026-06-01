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

export default function DoubleBarHeader() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 1. Add the filter state here
  const [filter, setFilter] = useState<"all" | "mine">("all");
  // 2. Add search query state if you want that functional as well
  const [searchQuery, setSearchQuery] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentTheme = useAppSelector(selectTheme);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleThemeToggle = () => dispatch(toggleTheme());
  const handleCog = () => navigate("/settings");

  console.log(searchQuery);
  return (
    <Header
      currentTheme={currentTheme}
      topBarLeft={<SearchBar />}
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
      // 3. Pass the actual state and setters to the Sidebar
      sidebar={
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          filter={filter}
          setFilter={setFilter}
          setSearchQuery={setSearchQuery}
        />
      }
    />
  );
}

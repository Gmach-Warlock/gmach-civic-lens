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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentTheme = useAppSelector(selectTheme);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const handleThemeToggle = () => dispatch(toggleTheme());
  const handleCog = () => navigate("/settings");

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
      sidebar={<Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />}
    />
  );
}

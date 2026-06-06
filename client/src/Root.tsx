import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks/generalHooks";
import { verifyToken } from "./features/auth/thunks/verifyToken";
// Importing the theme from your auth selectors since it's now in the User table
import { selectUserTheme } from "./features/auth/selectors/authSelectors";
import DoubleBarHeader from "./components/organisms/sections/DoubleBarHeader";
import ToastsContainer from "./components/organisms/sections/ToastsContainer";
import Footer from "./components/organisms/globals/Footer";

export default function Root() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectUserTheme);
  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  // Effect to apply the theme to the body or root element
  useEffect(() => {
    let activeTheme = theme;

    // Handle the "System Default" logic
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }

    // Applying to the documentElement is often more robust than just a div
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [theme]);

  return (
    // You can keep the class here as well for scoped styling
    <div className={`app-container theme--${theme}`}>
      <DoubleBarHeader />
      <main className="main-content">
        <Outlet />
      </main>
      <ToastsContainer />
      <Footer
        year={2026}
        copyrighter="GMach Development"
        links={[
          { label: "Terms", path: "/terms" },
          { label: "Privacy", path: "/privacy" },
        ]}
      />
    </div>
  );
}

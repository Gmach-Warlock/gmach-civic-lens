import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks/generalHooks";
import { verifyToken } from "./features/auth/thunks/verifyToken";
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

  useEffect(() => {
    let activeTheme = theme;
    if (theme === "system") {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    document.documentElement.setAttribute("data-theme", activeTheme);
  }, [theme]);

  // 2. Define your footer links
  const footerLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Contact Support", href: "/support" },
  ];

  return (
    <div className={`app-container theme--${theme}`}>
      <DoubleBarHeader />
      <main className="main-content">
        <Outlet />
      </main>
      {/* 3. Mount the Footer */}
      <Footer
        year={new Date().getFullYear()}
        copyrighter="GMach Civic Lens"
        version="1.0.0"
        links={footerLinks}
        showBackToTop={true}
      />
      <ToastsContainer />
    </div>
  );
}

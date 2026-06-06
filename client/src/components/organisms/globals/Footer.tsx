import React from "react";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";
import { useNavigate } from "react-router";

export interface FooterLink {
  label: string;
  path: string;
}

interface FooterProps {
  year: number | string;
  copyrighter: string;
  links: FooterLink[];
}

const Footer: React.FC<FooterProps> = ({ year, copyrighter, links }) => {
  const theme = useAppSelector(selectTheme);
  const navigate = useNavigate();

  return (
    <footer className={`footer-container--${theme}`}>
      <div className="footerContent">
        <p>
          &copy; {year} {copyrighter}. All rights reserved.
        </p>
        <nav>
          <ul className="footer-links">
            {links.map((link) => (
              <li key={link.path}>
                <button
                  onClick={() => navigate(link.path)}
                  className="footerLinkButton"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;

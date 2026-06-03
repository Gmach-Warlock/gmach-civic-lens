import type { ComponentPropsWithoutRef } from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps extends ComponentPropsWithoutRef<"footer"> {
  year: number | string;
  copyrighter: string;
  links: FooterLink[];
  version: string;
  showBackToTop?: boolean;
}

const Footer = ({
  year,
  copyrighter,
  links,
  version,
  showBackToTop = false,
  className,
  ...props
}: FooterProps) => {
  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={`footer ${className || ""}`} {...props}>
      <div className="footer__container">
        <div className="footer__info">
          <span className="footer__copyright">
            &copy; {year} {copyrighter}
          </span>
          <span className="footer__version">v{version}</span>
        </div>

        <nav className="footer__nav">
          <ul className="footer__list">
            {links.map((link) => (
              <li key={link.href} className="footer__item">
                <a href={link.href} className="footer__link">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {showBackToTop && (
          <button
            type="button"
            className="footer__back-to-top"
            onClick={handleBackToTop}
            aria-label="Back to top"
          >
            ↑ Back to Top
          </button>
        )}
      </div>
    </footer>
  );
};

export default Footer;

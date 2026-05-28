import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectTheme } from "../../../features/global/globalSelectors";
import Column from "../layout/Column";
import Row from "../layout/Row";
import Heading from "../../atoms/elements/Heading";
import Button from "../../atoms/controls/Button";

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Overlay({
  isOpen,
  onClose,
  title,
  children,
}: OverlayProps) {
  const theme = useAppSelector(selectTheme);

  // Keyboard accessibility: Close overlay on Escape key down
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className={`overlay-backdrop backdrop--${theme} fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm`}
      onClick={onClose}
    >
      {/* The overlay card itself is modeled as a unified layout Column.
        We prevent click propagation so clicking inside the card won't close it.
      */}
      <Column
        className={`overlay-card card--glass-${theme} m-4 p-5 rounded-sm max-w-lg w-full shadow-2xl border border-glass-light`}
        variant="start"
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
      >
        {/* Top Header Row */}
        <Row className="w-full justify-between items-center mb-4 pb-2 border-b border-glass-light">
          <Heading
            size={3}
            color="primary"
            headingStyle="basic"
            content={title}
          />
          <Button
            name="close-overlay"
            type="button"
            content="&times;"
            onClick={onClose}
            className="btn--tertiary text-xl p-1 min-w-fit leading-none"
          />
        </Row>

        {/* Content Node Block */}
        <div className="overlay-content w-full overflow-y-auto max-h-[70vh]">
          {children}
        </div>
      </Column>
    </div>,
    document.body,
  );
}

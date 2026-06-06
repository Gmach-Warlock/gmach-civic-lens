import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

export const useEscapeNavigation = (endpoint: string = "/") => {
  const navigate = useNavigate();

  // Wrap in useCallback so the function reference is stable
  const handleCancel = useCallback(() => {
    navigate(endpoint);
  }, [navigate, endpoint]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCancel]); // Now we depend on the memoized handleCancel

  return { handleCancel };
};

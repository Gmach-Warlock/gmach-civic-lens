import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router";

export const useFormEscape = (targetPath: string = "/dashboard") => {
  const navigate = useNavigate();

  // We memoize this so the useEffect dependency is stable
  const handleCancel = useCallback(() => {
    navigate(targetPath);
  }, [navigate, targetPath]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Cleanup: This is vital!
    // It removes the listener when the component using this hook unmounts.
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleCancel]);

  // We return the function so the component can also attach it to a "Cancel" button
  return { handleCancel };
};

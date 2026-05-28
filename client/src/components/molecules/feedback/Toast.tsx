import { useEffect } from "react";
import { useAppDispatch } from "../../../app/hooks/generalHooks";
import { removeToast } from "../../../features/global/globalSlice";
import type { ToastMessageInterface } from "../../../app/interfaces/globalInterfaces";

interface ToastProps {
  toast: ToastMessageInterface;
}

export default function Toast({ toast }: ToastProps) {
  const dispatch = useAppDispatch();
  const { id, message, type } = toast;

  useEffect(() => {
    // Automatically remove the toast after 4 seconds
    const timer = setTimeout(() => {
      dispatch(removeToast(id));
    }, 4000);

    return () => clearTimeout(timer); // Clean up timer if unmounted early
  }, [id, dispatch]);

  return (
    <div className={`toast toast--${type}`} role="alert">
      <div className="toast__content">
        <span className="toast__icon">
          {type === "success" && "🟢"}
          {type === "error" && "🔴"}
          {type === "info" && "🔵"}
        </span>
        <p className="toast__message">{message}</p>
      </div>
      <button
        type="button"
        className="toast__close-btn"
        onClick={() => dispatch(removeToast(id))}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
}

import { useAppSelector } from "../../../app/hooks/generalHooks";
import Toast from "../../molecules/feedback/Toast";

export default function ToastsContainer() {
  // Grab the array of toasts from your global slice state
  const toasts = useAppSelector((state) => state.global.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="toasts-container">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} />
      ))}
    </div>
  );
}

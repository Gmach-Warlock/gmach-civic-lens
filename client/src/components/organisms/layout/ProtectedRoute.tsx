import { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router";
import {
  useAppSelector,
  useAppDispatch,
} from "../../../app/hooks/generalHooks";
import { logoutUser } from "../../../features/auth/authSlice";
import { addToast } from "../../../features/global/globalSlice"; // Import toast action

const ProtectedRoute = () => {
  const dispatch = useAppDispatch();
  const { user, loadingState } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    if (loadingState.state === "loading" && !user) {
      timeout = setTimeout(() => {
        console.error("AUTH FATAL: Session verification hung. Forcing logout.");

        // 1. Immediate local cleanup
        localStorage.removeItem("token");

        // 2. Notify User
        dispatch(
          addToast({
            message: "Session verification timed out. Please log in again.",
            type: "error",
          }),
        );

        // 3. Reset Redux and Force Hard Redirect
        dispatch(logoutUser());
        window.location.href = "/login";
        navigate("/dashboard");
      }, 3500); // Give it a generous window
    }

    return () => clearTimeout(timeout);
  }, [loadingState.state, user, dispatch, navigate]);

  if (loadingState.state === "loading") {
    return (
      <div className="auth-fallback">
        <p>Verifying session...</p>
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  useAppDispatch,
  useAppSelector,
} from "../../../app/hooks/generalHooks";
import { addToast } from "../../../features/global/globalSlice";

const ProtectedRoute = () => {
  const { user, loadingState } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isLoading = loadingState.state === "loading";

  useEffect(() => {
    // Only run this logic if we are NOT loading AND no user exists
    if (!isLoading && !user) {
      dispatch(
        addToast({
          message:
            "Oops! You need to be logged in to view this. Please login to continue.",
          type: "info",
        }),
      );

      const timer = setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [user, isLoading, navigate, dispatch]);

  // Show loading ONLY if it is actually loading
  if (isLoading) return <div>Loading...</div>;

  // If user is logged in, show the page. Otherwise, show nothing (while redirecting)
  return user ? <Outlet /> : null;
};

export default ProtectedRoute;

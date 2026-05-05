import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../../app/hooks/generalHooks";

const ProtectedRoute = () => {
  const { user, loadingState } = useAppSelector((state) => state.auth);

  // Optional: Show a loader while verifyToken is running
  if (loadingState.state === "loading") return <div>Loading...</div>;

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;

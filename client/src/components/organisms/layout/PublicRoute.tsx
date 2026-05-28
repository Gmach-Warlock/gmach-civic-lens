import { Navigate, Outlet, useLocation } from "react-router"; // 👈 Add useLocation
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";

const PublicRoute = () => {
  const accessToken = useAppSelector(selectAccessToken);
  const location = useLocation(); // 👈 Access the router state

  console.log("here is the token", accessToken);

  // If we have a token, we need to redirect away from Login/Register
  if (accessToken) {
    // Check if there's a specific place we were trying to go
    const from = location.state?.from || "/dashboard";
    return <Navigate to={from} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;

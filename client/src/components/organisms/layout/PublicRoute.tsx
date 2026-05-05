import { Navigate, Outlet } from "react-router";
import { useAppSelector } from "../../../app/hooks/generalHooks";
import { selectAccessToken } from "../../../features/auth/selectors/authSelectors";

const PublicRoute = () => {
  const accessToken = useAppSelector(selectAccessToken);

  console.log("here is the token", accessToken);

  return accessToken ? <Navigate to="/dashboard" replace /> : <Outlet />;
};

export default PublicRoute;

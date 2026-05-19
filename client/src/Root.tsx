import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks/generalHooks";
import { verifyToken } from "./features/auth/thunks/verifyToken";
import { selectTheme } from "./features/global/globalSelectors";
import DoubleBarHeader from "./components/organisms/sections/DoubleBarHeader";

export default function Root() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  useEffect(() => {
    dispatch(verifyToken());
  }, [dispatch]);

  return (
    <div className={`theme--${theme}`}>
      <DoubleBarHeader />
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router";
import { useEffect } from "react";
import { useAppDispatch } from "./app/hooks/generalHooks";
import Header from "./components/organisms/globals/Header";
import { verifyToken } from "./features/auth/thunks/verifyToken";

export default function Root() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("working?");
    dispatch(verifyToken());
  }, [dispatch]);

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

import { useEffect } from "react";
import { verifyToken } from "../features/auth/thunks/verifyToken";
import { useAppDispatch } from "../app/hooks/generalHooks";
import Hero from "../components/organisms/sections/Hero";

export default function Home() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    console.log("working?");
    dispatch(verifyToken());
  }, [dispatch]);
  return (
    <div>
      <Hero />
    </div>
  );
}

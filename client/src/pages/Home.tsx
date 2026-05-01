import { useEffect } from "react";
import Hero from "../components/Hero/Hero";
import { verifyToken } from "../features/user/thunks/verifyToken";
import { useAppDispatch } from "../app/hooks/generalHooks";

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

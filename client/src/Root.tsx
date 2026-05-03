import { Outlet } from "react-router";
import Header from "./components/layout/Header";

export default function Root() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

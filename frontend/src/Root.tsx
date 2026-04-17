import { Outlet } from "react-router";
import Header from "./components/Header/Header";

export default function Root() {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
}

import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

export function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import AppFooter from "./AppFooter";

function MainLayout() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="page-body">
        <Outlet />
      </main>
      <AppFooter />
    </div>
  );
}

export default MainLayout;

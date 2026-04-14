import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const AppLayout = () => {
  return (
    <div style={{ display: "flex", minHeight: '100vh' }}>
        <Sidebar />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <main style={{ flex: 1, padding: '24px', backgroundColor: '#f5f5f5'}}>
                <Outlet />
            </main>
        </div>
    </div>
  )
}

export default AppLayout
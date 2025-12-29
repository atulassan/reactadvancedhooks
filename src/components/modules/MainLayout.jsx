import Sidebar from "./sidebar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex min-h-screen">
            <Sidebar />
            <div className="flex-1 p-6">
                <Outlet /> {/* This is where page-specific content will render */}
            </div>
        </div>
    );
}
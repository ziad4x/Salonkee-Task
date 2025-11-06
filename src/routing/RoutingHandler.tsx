import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/auth/login/page";
import ProtectedRoutes from "./ProtectedRoutes";
import CalendarPage from "../pages/calendar/page";

function RoutingHandler() {
    const router = createBrowserRouter([
        {
            path: "/",
            element: <ProtectedRoutes><CalendarPage /></ProtectedRoutes>
        },
        {
            path: "/login",
            element: <LoginPage />
        },
        {
            path: "/register",
            element: <div>Register</div>
        }
    ])
    return <RouterProvider router={router} />
}
export default RoutingHandler;
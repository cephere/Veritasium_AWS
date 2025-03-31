import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = () => {
    const username = sessionStorage.getItem("username"); 
    const location = useLocation();

    if (location.pathname === "/Admin" && username !== "admin1" && username !== "admin2") {
        return <Navigate to="/" replace />;
    }

    return username ? <Outlet /> : <Navigate to="/" replace />;
};

export default PrivateRoute;

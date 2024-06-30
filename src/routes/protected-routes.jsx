import React from "react";

import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
	let localStorageToken = localStorage.getItem("token");
	if (localStorageToken === "true") {
		return <Outlet />;
	} else {
		return <Navigate to="/" replace />;
	}
};

export default ProtectedRoutes;
import React from "react";

import { Navigate, Outlet } from "react-router-dom";
import { getUsers } from "../contacts";

const ProtectedRoutes = () => {
	// TODO: Use authentication token
	let localStorageToken = localStorage.getItem("token");
	console.log(localStorageToken);
	if (localStorageToken === "true") {
		return <Outlet />;
	} else {
		return <Navigate to="/" replace />;
	}
};

export default ProtectedRoutes;
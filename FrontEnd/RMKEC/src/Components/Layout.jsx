import React from "react";
import { Outlet, Link } from 'react-router-dom';
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import Login from "./Login";
import LoginPage from "../Pages/LoginPage";

const Layout = () => {
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    const userType = window.localStorage.getItem("userType");

    return (
        isLoggedIn ? (
            <div>
                <NavBar/>
                <SideBar/>
                <Outlet/>
            </div>
        ) : <LoginPage/>
    );
}

export default Layout;

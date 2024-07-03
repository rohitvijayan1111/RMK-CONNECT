import React, { useEffect } from "react";
import { Outlet, useNavigate } from 'react-router-dom';
import NavBar from "./NavBar";
import SideBar from "./SideBar";
import LoginPage from "../Pages/LoginPage";
import './Layout.css'; 
import Navigation from "./Navigation";

const Layout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const isLoggedIn = window.localStorage.getItem('loggedIn');
        if (isLoggedIn === 'false') {
          navigate('/'); 
        }
    }, []);

    return (
        <div>
            <NavBar />
            <Navigation/>
            <aside>

            <SideBar />
            </aside>
            <div className="main-frame">
            <Outlet/>
            </div>
        </div>
    );
}

export default Layout;

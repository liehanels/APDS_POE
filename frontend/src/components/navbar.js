import React from 'react';
import Logo from "../logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">
                <img src={Logo} alt="Logo" style={{ width: '25%' }} />
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/login">
                            Login
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/signup">
                            Sign Up
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/newtransaction">
                            New Transaction
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

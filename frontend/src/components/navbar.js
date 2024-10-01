import React from 'react';
import Logo from "../logo.svg"
import "bootstrap/dist/css/bootstrap.css";
import { NavLink } from "react-router-dom";
export default function Navbar() {
    return (
        <div>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <NavLink className = "navbar-brand" to = "/">
                    <img style = {{ "width" : 25 + '%'}} src = {Logo}></img>
                </NavLink>
                <div className ='navbar' id ='navbarSupportedContent'>
                    <ul className ='navbar-nav ml-auto'>
                        <NavLink className = "nav-link" to = "/login">
                            Login
                        </NavLink>
                        <NavLink className = "nav-link" to = "/signup">
                            Sign Up
                        </NavLink>
                        <NavLink className = "nav-link" to = "/newtransaction">
                            New Transaction
                        </NavLink>
                    </ul>
                </div>
            </nav>
        </div>
    );
}
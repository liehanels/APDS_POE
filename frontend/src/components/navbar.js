import React, { useEffect, useState } from 'react';
import Logo from "../logo.svg";
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

export default function Navbar() {
    const { logout, user } = useAuth();
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkUserRole = async () => {
            try {
                const response = await fetch('https://localhost:3001/user/checkUser'); // Use a single endpoint
                if (response.ok) {
                    const data = await response.json(); 
                    setRole(data.role); // Set the role directly from the response
                } else {
                    setRole("teller"); // Or handle the error appropriately
                }
            } catch (error) {
                console.error("Error checking user role:", error);
            }
        };
    
        if (user) {
            checkUserRole();
        }
    }, [user, role]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <NavLink className="navbar-brand" to="/">
                <img src={Logo} alt="Logo" style={{ width: '25%' }} />
            </NavLink>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav ms-auto"> {}
                    {!user && (
                        <>
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
                                <NavLink className="nav-link" to="/tellerLogin">
                                    Employees
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && role === 'user' && (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/viewtransactions">
                                    View my transactions
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/newtransaction">
                                    New Transaction
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && role === 'teller' && (
                        <>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/addTeller">
                                    Add Teller
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <NavLink className="nav-link" to="/addViewAllTransactions">
                                    View All Transactions
                                </NavLink>
                            </li>
                        </>
                    )}
                    {user && (
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={handleLogout}>
                                Logout
                            </button>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}

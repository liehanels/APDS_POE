import React, { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const Logo = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='100' height='100'%3E%3Cg fill='%23000' fill-rule='evenodd'%3E%3Cpath d='M100 100l40 40-40 40-40-40 40-40zM0 100a100 100 0 10200 0 100 100 0 00-200 0zM100 0l-40 40 40 40 40-40-40-40z' /%3E%3C/g%3E%3C/svg%3E";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [role, setRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    console.error("USE EFFECT RUNNING", user)
    const checkUserRole = async () => {
    console.error("CHECK USER ROLE RUNNING")
    
      if (user) {
        try {
          setIsLoading(true);
          console.error("SET IS_LOADING = TRUE");
          const accountnum = localStorage.getItem("accountnum");
          const response = await fetch(`https://localhost:3001/user/checkUser?accountnum=${accountnum}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Include JWT
            },
          });

          if (response.ok) {
            const data = await response.json();
            setRole(data.role);
          } else {
            const errorData = await response.json();
            setError(errorData.message || "Error fetching role");
          }
        } catch (error) {
          console.error("Error checking user role:", error);
          setError("Network error");
        } finally {
          setIsLoading(false);
        }
      } else {
        console.error("NO USER")
        // Reset state on logout
        setRole(null);
        setIsLoading(false);
        setError(null);
      }
    };

    checkUserRole();
  }, [user]); 

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
        <ul className="navbar-nav ms-auto">

          {isLoading && (
            <li className="nav-item">
              <span className="nav-link">Loading...</span>
            </li>
          )}

          {error && (
            <li className="nav-item">
              <span className="nav-link text-danger">{error}</span>
            </li>
          )}

          {!user && !isLoading && ( 
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

          {user && !isLoading && role === 'user' && (
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

          {user && !isLoading && role === 'teller' && (
            <>
              <li className="nav-item">
                <NavLink className="nav-link" to="/tellerSignup">
                  Add Teller
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/viewAllTransactions">
                  View All Transactions
                </NavLink>
              </li>
            </>
          )}

          {user && !isLoading && (
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
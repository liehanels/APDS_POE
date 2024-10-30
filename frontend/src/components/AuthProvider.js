import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Store user data
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("jwt")
  );

  const login = async (token, accountnum) => { // Include accountnum
    localStorage.setItem("jwt", token);
    setIsAuthenticated(true);

    try {
      // Fetch user data (including role) after login
      const response = await fetch(
        `https://localhost:3001/user/checkUser?accountnum=${accountnum}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser({ accountnum, role: data.role }); // Store user data in state
      } else {
        console.error("Error fetching user data:", response.status);
        // Consider handling the error (e.g., logout)
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Consider handling the error (e.g., logout)
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    setIsAuthenticated(false);
    setUser(null); // Clear user data on logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}> 
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
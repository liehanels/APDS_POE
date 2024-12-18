import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthProvider";

export default function Login() {
    const [form, setForm] = useState({
      accountnum: "",
      password: "",
    });
    const { login } = useAuth();
    const navigate = useNavigate();
  
    function updateForm(value) {
      setForm((prev) => ({ ...prev, ...value }));
    }
  
    async function onSubmit(e) {
      e.preventDefault();
  
      try {
        console.log("Sending request to backend");
        const response = await fetch("https://localhost:3001/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form), // Directly send the form data
        });
        console.log("Request sent");
  
        if (!response.ok) {
          const errorData = await response.json(); // Get error message from response
          throw new Error(errorData.message || "Login failed"); 
        }
  
        const data = await response.json();
        console.log(data);
        const { token, accountnum } = data;
  
        login(token, accountnum); // Call login with token and accountnum
  
        console.log(`accountnum: ${accountnum}\nToken: ${token}`);
  
        setForm({ accountnum: "", password: "" });
        navigate("/newtransaction");
      } catch (error) {
        window.alert(error);
        console.log(error);
      }
    }
    return (
        <div className="App-header">
            <div className="login-container">
                <h2>Login</h2>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Account Number</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={form.accountnum}
                            onChange={(e) => updateForm({ accountnum: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={form.password}
                            onChange={(e) => updateForm({ password: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <input
                            type="submit"
                            value="Login"
                            className="btn btn-primary"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}

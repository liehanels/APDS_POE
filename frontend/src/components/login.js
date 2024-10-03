import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthProvider";

export default function Login() {
    const [form, setForm] = useState({
        name: "",
        password: "",
    });
    const { login } = useAuth();
    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form };

        try {
            console.log("Sending request to backend")
            const response = await fetch("https://localhost:3001/user/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            });
            console.log("Request sent")
            if (!response.ok) {
                throw new Error("Login failed");
            }

            const data = await response.json();
            console.log(data);
            const { token, name } = data;
            login(token);
            console.log(`Name: ${name}\nToken: ${token}`);

            localStorage.setItem("jwt", token);
            localStorage.setItem("name", name);

            setForm({ name: "", password: "" });
            navigate("/newtransaction");
        } catch (error) {
            window.alert(error);
            console.log(error);
        }
    }

    return (
        <div className="App-header">
            <div className="login-container">
                <h3>Login</h3>
                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="name"
                            value={form.name}
                            onChange={(e) => updateForm({ name: e.target.value })}
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

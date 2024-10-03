import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        password: "",
    });
    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form };

        try {
            const response = await fetch("https://localhost:3001/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            });

            if (!response.ok) {
                throw new Error("Signup failed");
            }

            const data = await response.json();
            console.log(data);

            setForm({ name: "", password: "" });
            navigate("/login");
        } catch (error) {
            window.alert(error);
            console.log(error);
        }
    }

    return (
        <div className="signup-container">
            <h3>Sign Up</h3>
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
                        value="Create Profile"
                        className="btn btn-primary"
                    />
                </div>
            </form>
        </div>
    );
}

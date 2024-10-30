import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        tellerID: "",
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }
    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form };

        try {
            const response = await fetch("https://localhost:3001/teller/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newPerson),
            })
            .then(async response => {
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Something went wrong');
                }
                const data = await response.json();
                console.log(data);
            })

            setForm({ name: "", tellerID: "", password: "", confirmPassword: "", });
            navigate("/login");
        } catch (error) {
            window.alert(error);
            console.log(error);
        }
    }

    return (
        <div className="App-header">
            <h2>Sign Up</h2>
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
                    <label htmlFor="name">Service Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={form.tellerID}
                        onChange={(e) => updateForm({ tellerID: e.target.value })}
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
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        value={form.confirmPassword}
                        onChange={(e) => updateForm({ confirmPassword: e.target.value })}
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

import React, { useState } from "react";
import { useNavigate } from "react-router";
export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        password: "",
    });
    const navigate = useNavigate();
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value};
        });
    }
    async function onSubmit(e) {
        e.preventDefault();

        const newPerson = { ...form };

        await fetch("https://localhost:3001/user/signup", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(newPerson),
        })
        .catch(error => {
            window.alert(error);
            return;
        });

        setForm({ name: "", password: ""});
        navigate("/login")
    }
    
return (
    <div>
        <h3>Sign Up</h3>
        <form onSubmit = {onSubmit}>
            <div className = "form-group">
                <label htmlFor = "name">Name</label>
                <input
                    type = "text"
                    className = "form-control"
                    id = "name"
                    value = {form.name}
                    onChange = {(e) => updateForm({ name: e.target.value })}
                />
            </div>
            <div className = "form-group">
                <label htmlFor = "Password">Password</label>
                <input
                    type = "text"
                    className = "form-control"
                    id = "password"
                    value = {form.password}
                    onChange = {(e) => updateForm({ password: e.target.value })}
                />
            </div>
            <div className = "form-group">
                <input
                    type = "submit"
                    value = "Create Profile"
                    className = "btn btn-primary"
                />
            </div>
        </form>
    </div>
    )
}

import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function Signup() {
    const [form, setForm] = useState({
        name: "",
        accountnum: generateAccountNum(),
        password: "",
        confirmPassword: "",
    });
    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }
    //generates a random account number
    function generateAccountNum(length = 10) {
        const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    }

    console.log(generateAccountNum());
    
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
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message || 'Something went wrong');
                    });
                }
                return response.json();
            })

            const data = await response.json();
            console.log(data);

            setForm({ name: "", accountnum: generateAccountNum(), password: "", confirmPassword: "", });
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
                    <label htmlFor="name">Account Number</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={form.accountnum}
                        readOnly
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

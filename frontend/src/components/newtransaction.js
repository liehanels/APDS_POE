import React, { useState } from "react";
import { useNavigate } from "react-router";

export default function NewTransaction() {
    const [form, setForm] = useState({
        name: "",
        transactionAmount: "",
        transactionAddress: "",
    });
    const navigate = useNavigate();

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();

        const newTransaction = { ...form };

        try {
            const response = await fetch("https://localhost:3001/transaction/newtransaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newTransaction),
            });

            if (!response.ok) {
                throw new Error("Transaction failed");
            }

            const data = await response.json();
            const { token, name } = data;
            console.log(`Name: ${name}\nToken: ${token}`);

            localStorage.setItem("jwt", token);
            localStorage.setItem("name", name);

            setForm({ name: "", transactionAmount: "", transactionAddress: "" });
            navigate("/newtransaction");
        } catch (error) {
            window.alert(error);
        }
    }

    return (
        <div className="transaction-container">
            <h3 className="header">Perform a New Transaction</h3>
            <form onSubmit={onSubmit}>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Transaction Amount</th>
                            <th>Transaction Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" onChange={(e) => updateForm({ name: e.target.value })} placeholder="Enter user" /></td>
                            <td><input type="number" onChange={(e) => updateForm({ transactionAmount: e.target.value })} placeholder="Enter amount" /></td>
                            <td><input type="text" onChange={(e) => updateForm({ transactionAddress: e.target.value })} placeholder="Enter address" /></td>
                            <td><button type="submit">Submit</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
    
}

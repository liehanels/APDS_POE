import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router";

export default function NewTransaction() {
    const [form, setForm] = useState({
        accountnum: "",
        transactionAmount: "",
        transactionAddress: "",
    });
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");
    console.log(token);

    useEffect(() => {
        const accountnum = localStorage.getItem("accountnum");
        console.log(accountnum);
        if (accountnum) {
            setForm((prev) => ({ ...prev, accountnum: accountnum }));
        }
    }, []);

    function updateForm(value) {
        setForm((prev) => ({ ...prev, ...value }));
    }

    async function onSubmit(e) {
        e.preventDefault();
        console.log("Form state on submit:", form)
        const newTransaction = { ...form };
        try {
            const response = await fetch("https://localhost:3001/transaction/newtransaction", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(newTransaction),
            });

            if (!response.ok) {
                throw new Error("Transaction failed");
            }

            const data = await response.json();
            const { token: newToken, accountnum } = data;
            console.log(`Account Num: ${accountnum}\nToken: ${newToken}`);

            setForm({ accountnum: accountnum, transactionAmount: "", transactionAddress: "" });
            navigate("/viewtransactions");
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
                            <th>Account Num</th>
                            <th>Transaction Amount</th>
                            <th>Transaction Address</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><input type="text" value={form.accountnum} readOnly /></td>
                            <td><input type="number" value={form.transactionAmount} onChange={(e) => updateForm({ transactionAmount: e.target.value })} placeholder="Enter amount" /></td>
                            <td><input type="text" value={form.transactionAddress} onChange={(e) => updateForm({ transactionAddress: e.target.value })} placeholder="Enter address" /></td>
                            <td><button type="submit">Submit</button></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
}

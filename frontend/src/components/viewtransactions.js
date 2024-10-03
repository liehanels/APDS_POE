import React, { useState, useEffect } from "react";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const token = localStorage.getItem("jwt");
    const userName = localStorage.getItem("name");

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch(`https://localhost:3001/transaction/transactions?name=${userName}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch transactions");
                }

                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error("Error:", error);
            }
        }

        fetchTransactions();
    }, [userName, token]);

    return (
        <div className="transactions-container">
            <h3 className="header">Your Transactions</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Transaction Amount</th>
                        <th>Transaction Address</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.user}</td>
                            <td>{transaction.transactionAmount}</td>
                            <td>{transaction.transactionAddress}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

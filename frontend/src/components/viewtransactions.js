import React, { useState, useEffect } from "react";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const token = localStorage.getItem("jwt");
    const accountnum = localStorage.getItem("accountnum");

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch(`https://localhost:3001/transaction/transactions?accountnum=${accountnum}`, {
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
    }, [accountnum, token]);

    return (
        <div className="App-header">
            <div className="transaction-container">
                <h2 className="App">Your Transactions</h2>
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
                                <td>{transaction.accountnum}</td>
                                <td>{transaction.transactionAmount}</td>
                                <td>{transaction.transactionAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

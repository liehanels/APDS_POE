import React, { useState, useEffect } from "react";

export default function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const token = localStorage.getItem("jwt");
    const accountnum = localStorage.getItem("accountnum");

    useEffect(() => {
        async function fetchTransactions() {
            try {
                const response = await fetch(`https://localhost:3001/transaction/transactions`, {
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

    const updateTransactionStatus = async (id, transactionStatus) => {
        console.log('Updating transaction', id, 'to status', transactionStatus); // Log the ID and status
        try {
          const response = await fetch(`https://localhost:3001/transaction/transactions/${id}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ transactionStatus })
          });
      
          if (response.ok) {
            const updatedTransaction = await response.json();
            console.log('Updated transaction:', updatedTransaction);
            setTransactions(prevTransactions =>
              prevTransactions.map(transaction =>
                transaction._id === id ? updatedTransaction : transaction
              )
            );
          } else {
            console.error('Error updating transaction status', response.statusText);
          }
        } catch (error) {
          console.error('Error updating transaction status:', error);
        }
      };
      
    return (
        <div className="App-header">
            <div className="transaction-container">
                <h2 className="App">Transactions</h2>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Transaction Amount</th>
                            <th>Transaction Address</th>
                            <th>Approve</th>
                            <th>Deny</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.accountnum}</td>
                                <td>{transaction.transactionAmount}</td>
                                <td>{transaction.transactionAddress}</td>
                                <td>
                                    <button type="button" onClick={() => updateTransactionStatus(transaction._id, 'Approved')}>
                                        Accept
                                    </button>
                                </td>
                                <td>
                                    <button type="button" onClick={() => updateTransactionStatus(transaction._id, 'Denied')}>
                                        Deny
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

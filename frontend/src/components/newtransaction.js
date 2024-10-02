import React from 'react';
import { Link } from 'react-router-dom';

export default function NewTransaction() {
    return (
        <div className="transaction-container">
            <h3 className="header">Perform a New Transaction</h3>
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
                    {/* Add your table rows here */}
                </tbody>
            </table>
        </div>
    );
}

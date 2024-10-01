import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function NewTransaction() {
    return (
        <div className="container">
            <h3 className="header">Perform a new transaction</h3>
            <table className="table table-striped" style={{ marginTop: 20 }}>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Transaction amount</th>
                        <th>Transaction address</th>
                        <th>Action</th>
                    </tr>
                </thead>
            </table>
        </div>
    );
}

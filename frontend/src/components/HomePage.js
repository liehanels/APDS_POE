import React from 'react';
import '../HomePage.css';

const dodgyLogo = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200' width='100' height='100'%3E%3Cg fill='%23000' fill-rule='evenodd'%3E%3Cpath d='M100 100l40 40-40 40-40-40 40-40zM0 100a100 100 0 10200 0 100 100 0 00-200 0zM100 0l-40 40 40 40 40-40-40-40z' /%3E%3C/g%3E%3C/svg%3E`;

function HomePage() {
  return (
    <div className="container">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Your (un)Trusted Bank</h1>
          <p>Your (definitely not) reliable partner for none of your financial needs.</p>
        </div>
        <div className="hero-image">
          <img src={dodgyLogo} alt="Banking" />
        </div>
      </section>

      <section className="features">
        <h2>Our Services</h2>
        <div className="feature-grid">
          <div className="feature">
            <span className="icon"><i className="fas fa-piggy-bank"></i></span>
            <h3>Savings</h3>
            <p>Flexible accounts for your everyday banking with zero(?) risk.</p>
          </div>
          <div className="feature">
            <span className="icon"><i className="fas fa-home"></i></span>
            <h3>Transactions</h3>
            <p>Have your money sent awayyyyy.</p>
          </div>
          <div className="feature">
            <span className="icon"><i className="fas fa-chart-line"></i></span>
            <h3>That was it</h3>
            <p>What else do you expect from a college student?.</p>
          </div>
        </div>
      </section>

      <section className="cta">
        <h3>Start Banking Today</h3>
        <p>Open an account online in minutes.</p>
      </section>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Dodgy Bank Co. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default HomePage;

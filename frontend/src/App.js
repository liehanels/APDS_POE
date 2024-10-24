import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import ProtectedRoute from  './components/ProtectedRoute.js';
//components
import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup.js';
import Newtransaction from './components/newtransaction';
import ViewTransactions from './components/viewtransactions';
import TellerLogin from './components/tellerLogin.js';

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/newtransaction"
              element={
                <ProtectedRoute>
                  <Newtransaction />
                </ProtectedRoute>
                } />
            <Route
              path="/viewtransactions"
              element={
                <ProtectedRoute>
                  <ViewTransactions />
                </ProtectedRoute>
                } />
            <Route path="/signup" element={<Signup />} />
            <Route path="/tellerLogin" element={<TellerLogin />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;

import { BrowserRouter } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
//components
import Navbar from './components/navbar';
import Login from './components/login';
import Signup from './components/signup';
import Newtransaction from './components/newtransaction';

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/newtransaction" element={<Newtransaction />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

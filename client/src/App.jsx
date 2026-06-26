import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Menu from './pages/Menu';
import Active from './pages/Active';
import Stats from './pages/Stats';
import './App.css'; 

function App() {
  return (
    <Router>
      <Routes>
        {/* TODO: TEMPORARY DEVELOPMENT ROUTE 
        The landing page is temporarily routed to /active during frontend development. 
        This will revert to "/login" once authentication and backend sessions are implemented. 
        */}
        <Route path="/" element={<Navigate to="/active" />} />
        
        {/* Application Router Paths */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/active" element={<Active />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
    </Router>
  );
}

export default App;
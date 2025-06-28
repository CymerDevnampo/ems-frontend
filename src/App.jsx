import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import GuestRoute from './components/GuestRoute';
import Employees from './pages/employee/Employees';
import CreateEmployee from './pages/employee/Create';
import EditEmployee from './pages/employee/Edit';
import Positions from './pages/position/Positions';
import CreatePosition from './pages/position/Create';
import EditPosition from './pages/position/Edit';
import Profile from './pages/profile/Profile';


function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  return (

    <Router>
      <Navbar user={user} setUser={setUser} />
      <div className="container mt-4">
        <Routes>

          <Route
            path="/login"
            element={
              <GuestRoute user={user}>
                <Login setUser={setUser} />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute user={user}>
                <Register />
              </GuestRoute>
            }
          />

          <Route
            path="/dashboard"
            element={user ? <Dashboard user={user} /> : <Navigate to="/login" />}
          />

          <Route path="/" element={<Navigate to="/login" />} />

          {/* EMPLOYEES */}
          <Route
            path="/employees"
            element={user ? <Employees user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/createEmployee"
            element={user ? <CreateEmployee user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/edit/employee/:id"
            element={user ? <EditEmployee /> : <Navigate to="/login" />}
          />





          {/* POSITION */}
          <Route
            path="/positions"
            element={user ? <Positions user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/createPosition"
            element={user ? <CreatePosition user={user} /> : <Navigate to="/login" />}
          />

          <Route
            path="/edit/position/:id"
            element={user ? <EditPosition /> : <Navigate to="/login" />}
          />



          {/* PROFILE */}
          <Route
            path="/profile"
            element={user ? <Profile user={user} /> : <Navigate to="/login" />}
          />

        </Routes>
      </div>
    </Router>
  );
}

export default App;

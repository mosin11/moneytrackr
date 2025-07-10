import { Routes, Route, Navigate, HashRouter } from 'react-router-dom';

import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import SetMpinPage from './pages/SetMpinPage';
import MpinLoginPage from './pages/MpinLoginPage';
import LandingPage from './pages/LandingPage';
import Home from './Home';
import SeedTransactions from './components/SeedTransactions';
import PrivateRoute from './privateRoutes/PrivateRoute';
import { isLoggedIn } from './utils/auth';

function App() {
  return (
    <HashRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to={isLoggedIn() ? "/mpin-login" : "/welcome"} />} />

        {/* Public Routes */}
        <Route path="/welcome" element={<LandingPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/mpin-login" element={<MpinLoginPage />} />
        <Route path="/setmpin" element={<SetMpinPage />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/app"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/seed"
          element={
            <PrivateRoute>
              <SeedTransactions />
            </PrivateRoute>
          }
        />

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </HashRouter>
  );
}

export default App;

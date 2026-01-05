import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MyTickets from './pages/MyTickets';
import AgentTickets from './pages/AgentTickets';
import Analytics from './pages/Analytics';
import Users from './pages/Users';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* Employee routes */}
            <Route
              path="tickets"
              element={
                <ProtectedRoute roles={['employee']}>
                  <MyTickets />
                </ProtectedRoute>
              }
            />
            
            {/* Agent routes */}
            <Route
              path="agent/tickets"
              element={
                <ProtectedRoute roles={['agent', 'admin']}>
                  <AgentTickets />
                </ProtectedRoute>
              }
            />
            
            {/* Admin routes */}
            <Route
              path="admin/analytics"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="admin/users"
              element={
                <ProtectedRoute roles={['admin']}>
                  <Users />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

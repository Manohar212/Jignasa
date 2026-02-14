import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import StudentDashboard from './pages/StudentDashboard';
import StudentGroups from './pages/StudentGroups';
import StudentGroupDetails from './pages/StudentGroupDetails';
import StudentStatistics from './pages/StudentStatistics';
import StudentProfile from './pages/StudentProfile';
import JoinLecture from './pages/JoinLecture';
import FacultyDashboard from './pages/FacultyDashboard';
import LiveLecture from './pages/LiveLecture';
import FacultySchedule from './pages/FacultySchedule';
import FacultyGroups from './pages/FacultyGroups';
import FacultyAnalytics from './pages/FacultyAnalytics';
import FacultyProfile from './pages/FacultyProfile';
import { UserRole } from './types';

// Layout wrapper for authenticated pages
const DashboardLayout: React.FC<{ role: UserRole; onLogout: () => void; children: React.ReactNode }> = ({ role, onLogout, children }) => {
  const location = useLocation();
  const isLivePage = location.pathname === '/faculty/live';

  return (
    <div className="flex min-h-screen bg-[#F9F7F2]">
      <Sidebar role={role} onLogout={onLogout} />
      <div className={`flex-1 ${isLivePage ? 'ml-20' : 'ml-64'} transition-all duration-300`}>
        <Header userRole={role} userName={role === UserRole.STUDENT ? "John Doe" : "Dr. Robert Chen"} />
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
  };

  const handleLogout = () => {
    setUserRole(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login onLogin={handleLogin} />} />
        
        {/* Student Routes */}
        <Route path="/student/*" element={
          userRole === UserRole.STUDENT ? (
            <DashboardLayout role={UserRole.STUDENT} onLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="groups" element={<StudentGroups />} />
                <Route path="group/:id" element={<StudentGroupDetails />} />
                <Route path="statistics" element={<StudentStatistics />} />
                <Route path="profile" element={<StudentProfile />} />
                <Route path="lecture/:id" element={<JoinLecture />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          ) : <Navigate to="/" />
        } />

        {/* Faculty Routes */}
        <Route path="/faculty/*" element={
          userRole === UserRole.FACULTY ? (
            <DashboardLayout role={UserRole.FACULTY} onLogout={handleLogout}>
              <Routes>
                <Route path="dashboard" element={<FacultyDashboard />} />
                <Route path="live" element={<LiveLecture />} />
                <Route path="groups" element={<FacultyGroups />} />
                <Route path="schedule" element={<FacultySchedule />} />
                <Route path="analytics" element={<FacultyAnalytics />} />
                <Route path="profile" element={<FacultyProfile />} />
                <Route path="*" element={<Navigate to="dashboard" />} />
              </Routes>
            </DashboardLayout>
          ) : <Navigate to="/" />
        } />
      </Routes>
    </Router>
  );
};

export default App;
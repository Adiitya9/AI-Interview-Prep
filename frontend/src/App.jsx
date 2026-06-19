import React from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

import { darkTheme } from './theme/theme';
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Main Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import ResumeAnalyzerPage from './pages/resume/ResumeAnalyzerPage';
import QuestionGeneratorPage from './pages/questions/QuestionGeneratorPage';
import MockInterviewPage from './pages/interview/MockInterviewPage';
import SkillGapPage from './pages/skillgap/SkillGapPage';
import ProgressPage from './pages/progress/ProgressPage';
import ProfilePage from './pages/profile/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/dashboard" replace />,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
    ],
  },
  {
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'resume', element: <ResumeAnalyzerPage /> },
      { path: 'questions', element: <QuestionGeneratorPage /> },
      { path: 'interview', element: <MockInterviewPage /> },
      { path: 'skillgap', element: <SkillGapPage /> },
      { path: 'progress', element: <ProgressPage /> },
      { path: 'profile', element: <ProfilePage /> },
      {
        path: 'admin',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin/users',
        element: (
          <ProtectedRoute requireAdmin={true}>
            <AdminUsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <RouterProvider router={router} />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;

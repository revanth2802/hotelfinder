import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';
import Loader from './components/Loader';
import LandingPage from './pages/LandingPage';
import ProfilePage from './pages/ProfilePage';
// Lazy load pages dynamically
const LazyLoad = (componentPath) => React.lazy(() => import(`${componentPath}`));

// Pages
const HomePage = LazyLoad('./pages/HomePage');
const SearchPage = LazyLoad('./pages/SearchPage');
const LoginPage = LazyLoad('./pages/LoginPage');
const SignupPage = LazyLoad('./pages/SignupPage');
const Team = LazyLoad('./pages/Team');
const BusinessOwnerDashboard = LazyLoad('./pages/BusinessOwnerDashboard');
const AdminDashboard = LazyLoad('./pages/AdminDashboard');
const RestaurantDetails = LazyLoad('./pages/RestaurantDetails');
const NotFoundPage = LazyLoad('./pages/NotFoundPage'); // New: Fallback for undefined routes

const App = () => {
  return (
    <ErrorBoundary>
      <Layout>
        <Suspense fallback={<Loader />}>
          <Routes>
          <Route path="/" element={<LandingPage />} />
            <Route path="/find" element={<HomePage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/restaurant/:placeId" element={<RestaurantDetails />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage/>} />
            <Route path="/team" element={<Team />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/busowner-dashboard" element={<BusinessOwnerDashboard />} />
            <Route path="*" element={<NotFoundPage />} /> 
          </Routes>
        </Suspense>
      </Layout>
    </ErrorBoundary>
  );
};

export default App;

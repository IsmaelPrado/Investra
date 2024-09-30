// src/components/PublicRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute: React.FC = () => {
    const isAuthenticated = localStorage.getItem('user') !== null;

    return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
};

export default PublicRoute;

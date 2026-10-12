import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { VerifyEmailPage } from '../../pages/VerifyEmailPage';
import { RestaurantsPage } from '../../pages/RestaurantsPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<RestaurantsPage />} />

                    <Route
                        path="/products"
                        element={
                            <ProtectedRoute allowedRoles={['admin', 'owner']}>
                                <ProductsPage />
                            </ProtectedRoute>
                        }
                    />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
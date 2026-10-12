import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from '../../pages/LoginPage';
import { RegisterPage } from '../../pages/RegisterPage';
import { VerifyEmailPage } from '../../pages/VerifyEmailPage';
import { InvitePage } from '../../pages/InvitePage';
import { RestaurantsPage } from '../../pages/RestaurantsPage';
import { RestaurantDetailPage } from '../../pages/RestaurantDetailPage';
import { ProductsPage } from '../../pages/ProductsPage';
import { DashboardPage } from '../../pages/DashboardPage';
import { WarehousePage } from '../../pages/WarehousePage';
import { DeliveriesPage } from '../../pages/DeliveriesPage';
import { EmployeesPage } from '../../pages/EmployeesPage';
import { SettingsPage } from '../../pages/SettingsPage';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/invite/:code" element={<InvitePage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/" element={<RestaurantsPage />} />

                    <Route path="/restaurant/:id" element={<RestaurantDetailPage />}>
                        <Route index element={<Navigate to="dashboard" replace />} />
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="warehouse" element={<WarehousePage />} />
                        <Route path="deliveries" element={<DeliveriesPage />} />
                        <Route
                            path="products"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'owner']}>
                                    <ProductsPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="employees"
                            element={
                                <ProtectedRoute allowedRoles={['admin', 'owner']}>
                                    <EmployeesPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="pos" element={<div className="text-gray-600">POS-точки (заглушка)</div>} />
                        <Route
                            path="settings"
                            element={
                                <ProtectedRoute allowedRoles={['owner']}>
                                    <SettingsPage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
};
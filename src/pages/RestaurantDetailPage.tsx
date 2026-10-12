import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

export const RestaurantDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const tabs = [
        { name: 'Дашборд', path: 'dashboard', allowedRoles: undefined as string[] | undefined },
        { name: 'Склад', path: 'warehouse', allowedRoles: undefined },
        { name: 'Поставки', path: 'deliveries', allowedRoles: undefined },
        { name: 'Продукты', path: 'products', allowedRoles: ['admin', 'owner'] },
        { name: 'Сотрудники', path: 'employees', allowedRoles: ['admin', 'owner'] },
        { name: 'POS-точки', path: 'pos', allowedRoles: ['admin', 'owner'] },
        { name: 'Настройки', path: 'settings', allowedRoles: ['owner'] },
    ];

    const filteredTabs = tabs.filter(tab => {
        if (!tab.allowedRoles) return true;
        return user?.role && tab.allowedRoles.includes(user.role);
    });

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleCopyInviteLink = () => {
        const inviteCode = 'abc-123';
        const inviteLink = `${window.location.origin}/invite/${inviteCode}`;
        navigator.clipboard.writeText(inviteLink);
        alert('Ссылка-приглашение скопирована: ' + inviteLink);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-2">
                        <button
                            onClick={() => navigate('/')}
                            className="text-sm text-blue-600 hover:text-blue-800"
                        >
                            ← Назад к ресторанам
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm"
                        >
                            Выйти
                        </button>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Ресторан #{id}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {user?.email} ({user?.role === 'owner' ? 'Владелец' : user?.role === 'admin' ? 'Админ' : 'Менеджер'})
                    </p>
                </div>
            </header>

            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex space-x-8 overflow-x-auto">
                        {filteredTabs.map((tab) => (
                            <button
                                key={tab.path}
                                onClick={() => navigate(`/restaurant/${id}/${tab.path}`)}
                                className="py-4 px-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap"
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <Outlet />
            </main>

            {(user?.role === 'admin' || user?.role === 'owner') && (
                <div className="fixed bottom-6 right-6">
                    <button
                        onClick={handleCopyInviteLink}
                        className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition font-medium"
                    >
                        Скопировать ссылку-приглашение
                    </button>
                </div>
            )}
        </div>
    );
};
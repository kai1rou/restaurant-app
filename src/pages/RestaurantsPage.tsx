import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

interface Restaurant {
    id: string;
    name: string;
    role: 'owner' | 'admin' | 'manager';
}

// Мок данных — позже заменим на запрос к API
const MOCK_RESTAURANTS: Restaurant[] = [
    { id: '1', name: 'Ресторан "Уют"', role: 'owner' },
    { id: '2', name: 'Кафе "Вкусно"', role: 'admin' },
    { id: '3', name: 'Бар "Точка"', role: 'manager' },
];

export const RestaurantsPage = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [restaurants] = useState<Restaurant[]>(MOCK_RESTAURANTS);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [newRestaurantName, setNewRestaurantName] = useState('');
    const [newRestaurantApiKey, setNewRestaurantApiKey] = useState('');
    const [inviteCode, setInviteCode] = useState('');
    const [error, setError] = useState<string | null>(null);

    const handleCreateRestaurant = () => {
        if (!newRestaurantName.trim() || !newRestaurantApiKey.trim()) {
            setError('Заполните все поля');
            return;
        }
        // Здесь будет запрос к API: await axiosInstance.post('/restaurants', { name, apiKey })
        console.log('Создание ресторана:', newRestaurantName, newRestaurantApiKey);
        setShowCreateModal(false);
        setNewRestaurantName('');
        setNewRestaurantApiKey('');
        setError(null);
    };

    const handleJoinRestaurant = () => {
        if (!inviteCode.trim()) {
            setError('Введите код приглашения');
            return;
        }
        // Здесь будет запрос к API: await axiosInstance.post('/restaurants/join', { inviteCode })
        console.log('Присоединение по коду:', inviteCode);
        setShowJoinModal(false);
        setInviteCode('');
        setError(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Шапка */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Мои рестораны</h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Авторизован как: <span className="font-medium">{user?.email}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/products')}
                            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium"
                        >
                            Управление продуктами
                        </button>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition text-sm font-medium"
                        >
                            Выйти
                        </button>
                    </div>
                </div>
            </header>

            {/* Основной контент */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Кнопки действий */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition font-medium"
                    >
                        + Создать ресторан
                    </button>
                    <button
                        onClick={() => setShowJoinModal(true)}
                        className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-50 transition font-medium"
                    >
                        Присоединиться по коду
                    </button>
                </div>

                {/* Список ресторанов */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                        <div
                            key={restaurant.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition cursor-pointer"
                            onClick={() => navigate(`/restaurant/${restaurant.id}`)}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${restaurant.role === 'owner' ? 'bg-purple-100 text-purple-700' :
                                        restaurant.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                                            'bg-gray-100 text-gray-700'
                                    }`}>
                                    {restaurant.role === 'owner' ? 'Владелец' :
                                        restaurant.role === 'admin' ? 'Админ' : 'Менеджер'}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">
                                Нажмите, чтобы открыть панель управления
                            </p>
                        </div>
                    ))}
                </div>

                {restaurants.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                        <p className="text-gray-500">У вас пока нет ресторанов</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Создайте новый ресторан или присоединитесь по коду-приглашению
                        </p>
                    </div>
                )}
            </main>

            {/* Модальное окно создания ресторана */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Создать ресторан</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Название ресторана
                                </label>
                                <input
                                    type="text"
                                    value={newRestaurantName}
                                    onChange={(e) => setNewRestaurantName(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Введите название"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    API-ключ ресторана
                                </label>
                                <input
                                    type="text"
                                    value={newRestaurantApiKey}
                                    onChange={(e) => setNewRestaurantApiKey(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    placeholder="Введите API-ключ"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateRestaurant}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                            >
                                Создать
                            </button>
                            <button
                                onClick={() => { setShowCreateModal(false); setError(null); }}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition font-medium"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно присоединения */}
            {showJoinModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Присоединиться к ресторану</h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Код приглашения
                            </label>
                            <input
                                type="text"
                                value={inviteCode}
                                onChange={(e) => setInviteCode(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                placeholder="Введите код приглашения"
                            />
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleJoinRestaurant}
                                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                            >
                                Присоединиться
                            </button>
                            <button
                                onClick={() => { setShowJoinModal(false); setError(null); }}
                                className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition font-medium"
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
export const DashboardPage = () => {
    return (
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Дашборд</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Всего продуктов</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">124</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">Истекает срок годности</h3>
                    <p className="text-3xl font-bold text-orange-600 mt-2">7</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-sm font-medium text-gray-500">В стоп-листе</h3>
                    <p className="text-3xl font-bold text-red-600 mt-2">3</p>
                </div>
            </div>
            <p className="text-gray-600 mt-6">Здесь будет основная аналитика и графики.</p>
        </div>
    );
};
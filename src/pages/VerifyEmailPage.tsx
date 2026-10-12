import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const VerifyEmailPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email || 'ваш email';

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (code === '123456') {
                navigate('/login');
            } else {
                setError('Неверный код подтверждения');
            }
        } catch (err) {
            setError('Ошибка при проверке кода');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Подтверждение почты</h1>
                    <p className="text-gray-600 mt-2">
                        Мы отправили 6-значный код на <span className="font-medium text-gray-900">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                            Код подтверждения
                        </label>
                        <input
                            id="code"
                            type="text"
                            maxLength={6}
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                            className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-center text-2xl tracking-widest ${error ? 'border-red-500' : 'border-gray-300'
                                }`}
                            placeholder="000000"
                        />
                        {error && (
                            <p className="mt-1 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading || code.length !== 6}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        {isLoading ? 'Проверка...' : 'Подтвердить'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <button
                        onClick={() => navigate('/register')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        Вернуться к регистрации
                    </button>
                </div>
            </div>
        </div>
    );
};
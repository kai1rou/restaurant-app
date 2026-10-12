import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { axiosInstance } from '../shared/api/axios';

export const InvitePage = () => {
    const { code } = useParams<{ code: string }>();
    const navigate = useNavigate();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState<string>('');

    useEffect(() => {
        const acceptInvite = async () => {
            if (!code) {
                setStatus('error');
                setErrorMessage('Код приглашения отсутствует');
                return;
            }

            try {
                await axiosInstance.post(`/api/invitations/${code}/accept`);
                setStatus('success');
                setTimeout(() => navigate('/'), 1500);
            } catch (error: any) {
                setStatus('error');
                setErrorMessage(
                    error.response?.data?.message || 'Неверный код приглашения или срок его действия истёк'
                );
            }
        };

        acceptInvite();
    }, [code, navigate]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
                {status === 'loading' && (
                    <>
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <h2 className="text-xl font-semibold text-gray-900">Присоединение к ресторану...</h2>
                    </>
                )}

                {status === 'success' && (
                    <>
                        <div className="text-green-600 text-5xl mb-4">✓</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Успешно!</h2>
                        <p className="text-gray-600">Вы присоединились к ресторану.</p>
                        <p className="text-sm text-gray-500 mt-4">Перенаправление в панель управления...</p>
                    </>
                )}

                {status === 'error' && (
                    <>
                        <div className="text-red-600 text-5xl mb-4">✗</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ошибка</h2>
                        <p className="text-gray-600 mb-6">{errorMessage}</p>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition font-medium"
                        >
                            Вернуться на главную
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};
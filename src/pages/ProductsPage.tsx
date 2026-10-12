import { useState, useRef } from 'react';
import { z } from 'zod';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

const productSchema = z.object({
    name: z.string().min(1, 'Название продукта обязательно').max(100, 'Название слишком длинное'),
    shelfLifeDays: z.number().int('Должно быть целым числом').positive('Срок годности должен быть больше 0'),
});

const productsListSchema = z.array(productSchema);

type Product = z.infer<typeof productSchema>;

const TEMPLATE_PRODUCTS: Product[] = [
    { name: 'Молоко', shelfLifeDays: 7 },
    { name: 'Томаты', shelfLifeDays: 5 },
    { name: 'Говядина', shelfLifeDays: 3 },
    { name: 'Сыр моцарелла', shelfLifeDays: 14 },
    { name: 'Базилик', shelfLifeDays: 2 },
];

export const ProductsPage = () => {
    const { id: restaurantId } = useParams<{ id: string }>();
    const { user } = useAuthStore();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const handleDownloadTemplate = () => {
        const blob = new Blob([JSON.stringify(TEMPLATE_PRODUCTS, null, 2)], {
            type: 'application/json',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'products_template.json';
        link.click();
        URL.revokeObjectURL(url);
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setSuccessMessage(null);

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const validatedData = productsListSchema.parse(json);
                setProducts(validatedData);
                setSuccessMessage(`Загружено ${validatedData.length} продуктов. Проверьте данные перед сохранением.`);
            } catch (err) {
                if (err instanceof z.ZodError) {
                    const firstError = err.errors[0];
                    const path = firstError.path.length > 0 ? `элемент [${firstError.path[0]}].${firstError.path.slice(1).join('.')}` : 'корень файла';
                    setError(`Ошибка валидации в ${path}: ${firstError.message}`);
                } else if (err instanceof SyntaxError) {
                    setError('Неверный формат JSON. Проверьте синтаксис файла.');
                } else {
                    setError('Неизвестная ошибка при чтении файла');
                }
                setProducts([]);
            }
        };
        reader.onerror = () => {
            setError('Ошибка при чтении файла');
            setProducts([]);
        };
        reader.readAsText(file);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCellEdit = (index: number, field: keyof Product, value: string) => {
        setProducts((prev) => {
            const updated = [...prev];
            if (field === 'name') {
                updated[index] = { ...updated[index], name: value };
            } else if (field === 'shelfLifeDays') {
                const num = parseInt(value, 10);
                updated[index] = { ...updated[index], shelfLifeDays: isNaN(num) ? 0 : num };
            }
            return updated;
        });
    };

    const handleDeleteRow = (index: number) => {
        setProducts((prev) => prev.filter((_, i) => i !== index));
    };

    const handleAddRow = () => {
        setProducts((prev) => [...prev, { name: '', shelfLifeDays: 1 }]);
    };

    const validateProducts = (): boolean => {
        try {
            productsListSchema.parse(products);
            return true;
        } catch (err) {
            if (err instanceof z.ZodError) {
                const firstError = err.errors[0];
                const path = firstError.path.length > 0 ? `строка ${Number(firstError.path[0]) + 1}` : '';
                setError(`Ошибка в ${path}: ${firstError.message}`);
            }
            return false;
        }
    };

    const handleSave = async () => {
        if (!validateProducts()) return;

        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);

        try {
            console.log(`Сохранение продуктов для ресторана ${restaurantId}:`, products);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            setSuccessMessage(`Успешно сохранено ${products.length} продуктов.`);
            setProducts([]);
        } catch (err) {
            setError('Ошибка при сохранении. Попробуйте ещё раз.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClear = () => {
        setProducts([]);
        setError(null);
        setSuccessMessage(null);
    };

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Управление продуктами</h2>
                <p className="text-gray-600 mt-1 text-sm">
                    Ресторан #{restaurantId} · Роль: <span className="font-medium capitalize">{user?.role}</span>
                </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Загрузка продуктов</h3>
                <div className="flex items-center gap-4 flex-wrap">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={handleFileUpload}
                        className="block w-full max-w-md text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100 cursor-pointer"
                    />
                    <button
                        onClick={handleAddRow}
                        className="bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition text-sm font-medium whitespace-nowrap"
                    >
                        + Добавить вручную
                    </button>
                    <button
                        onClick={handleDownloadTemplate}
                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium whitespace-nowrap"
                    >
                        Скачать шаблон JSON
                    </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    Формат JSON: массив объектов с полями <code className="bg-gray-100 px-1 rounded">name</code> (string) и <code className="bg-gray-100 px-1 rounded">shelfLifeDays</code> (int, дни)
                </p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-700 font-medium">Ошибка:</p>
                    <p className="text-sm text-red-600 mt-1">{error}</p>
                </div>
            )}

            {successMessage && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-700">{successMessage}</p>
                </div>
            )}

            {products.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Список продуктов ({products.length} шт.)
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleClear}
                                className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition text-sm font-medium"
                            >
                                Очистить
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить в базу'}
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                        №
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Название продукта
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                                        Срок годности (дней)
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                                        Действия
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {products.map((product, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-6 py-3 text-sm text-gray-500">
                                            {index + 1}
                                        </td>
                                        <td className="px-6 py-3">
                                            <input
                                                type="text"
                                                value={product.name}
                                                onChange={(e) => handleCellEdit(index, 'name', e.target.value)}
                                                className={`w-full px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${!product.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                                placeholder="Введите название"
                                            />
                                        </td>
                                        <td className="px-6 py-3">
                                            <input
                                                type="number"
                                                min={1}
                                                value={product.shelfLifeDays}
                                                onChange={(e) => handleCellEdit(index, 'shelfLifeDays', e.target.value)}
                                                className={`w-full px-3 py-1.5 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${product.shelfLifeDays <= 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                                    }`}
                                            />
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => handleDeleteRow(index)}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium"
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {products.length === 0 && !error && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                    <p className="text-gray-500">Список продуктов пуст</p>
                    <p className="text-sm text-gray-400 mt-2">
                        Загрузите JSON-файл или добавьте продукты вручную
                    </p>
                </div>
            )}
        </div>
    );
};
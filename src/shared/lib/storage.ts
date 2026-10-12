const STORAGE_KEYS = {
    ACCESS_TOKEN: 'access_token',
};

export const storage = {
    getAccessToken: (): string | null => {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },
    setAccessToken: (token: string): void => {
        localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
    },
    clearAccessToken: (): void => {
        localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    },
};
const DEFAULT_SOCKET_ORIGIN = 'http://localhost:5002';

export const getApiBaseUrl = () => import.meta.env.VITE_API_URL || `${DEFAULT_SOCKET_ORIGIN}/api`;

export const getSocketBaseUrl = () => getApiBaseUrl().replace(/\/api\/?$/, '');


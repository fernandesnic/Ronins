// Verifica se estamos rodando localmente
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Define as duas URLs
const LOCAL_BACKEND = 'http://localhost:3000';
const PRODUCTION_BACKEND = 'https://ronins.onrender.com';

// Exporta a URL correta baseada no ambiente
export const BACKEND_URL = isLocal ? LOCAL_BACKEND : PRODUCTION_BACKEND;
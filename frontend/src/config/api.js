// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_URL || 'https://finverify-backend.onrender.com',
  ENDPOINTS: {
    LOGIN: '/login',
    REGISTER: '/register',
    PREDICT: '/predict',
    HISTORY: '/history',
  },
  TIMEOUT: 120000, // 120 seconds for cold starts on hosted services
};

// Helper function to build full URLs
export const buildUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function for API requests with timeout
export const apiRequest = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out while the hosted services were waking up. Please try again.');
    }
    throw error;
  }
};

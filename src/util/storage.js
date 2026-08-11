// Utility functions to manage localStorage and sessionStorage

/**
 * Clear all authentication-related storage items
 */
export const clearAuthStorage = () => {
  // Clear localStorage items
  const localStorageKeys = [
    'userId',
    'token',
    'accessToken',
    'user',
    'auth',
    'isLoggedIn',
    'role',
  ];

  localStorageKeys.forEach((key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove localStorage key: ${key}`, error);
    }
  });

  // Clear sessionStorage items
  const sessionStorageKeys = [
    'userId',
    'token',
    'accessToken',
    'user',
    'auth',
    'isLoggedIn',
    'role',
  ];

  sessionStorageKeys.forEach((key) => {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn(`Failed to remove sessionStorage key: ${key}`, error);
    }
  });

  // Clear all localStorage if needed (nuclear option - use with caution)
  // localStorage.clear();
  // sessionStorage.clear();
};

/**
 * Check if any auth tokens exist in storage
 */
export const hasAuthTokens = () => {
  const hasLocalStorage = 
    localStorage.getItem('token') || 
    localStorage.getItem('accessToken') || 
    localStorage.getItem('userId');
  
  const hasSessionStorage = 
    sessionStorage.getItem('token') || 
    sessionStorage.getItem('accessToken') || 
    sessionStorage.getItem('userId');
  
  return hasLocalStorage || hasSessionStorage;
};

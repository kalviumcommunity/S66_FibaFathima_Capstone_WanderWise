// Utility to clear old localStorage data and migrate to sessionStorage
export const clearOldAuthData = () => {
  // Clear any existing localStorage auth data
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('isLoggedIn');
  
  console.log('Cleared old authentication data from localStorage');
};

// Call this when the app starts to clean up old data
clearOldAuthData();

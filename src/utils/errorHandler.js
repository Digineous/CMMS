// src/utils/errorHandler.js
export const handleApiError = (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', error.response.data);
      console.error('Status:', error.response.status);
      // You can add more specific error handling based on status codes here
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    
    // You can also dispatch actions to update your app's state or show notifications
    // For example:
    // store.dispatch(showErrorNotification(error.message));
    
    return Promise.reject(error);
  };
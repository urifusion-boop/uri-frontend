import axios, { AxiosError, AxiosResponse } from 'axios';

axios.interceptors.response.use(
  (response: AxiosResponse) => response, // Just return the response if it's successful
  (error: AxiosError) => {
    // Handle the error globally
    console.error('API Error:', error.response);

    const defaultMessage = "An error occurred, please try again later";
    const message = defaultMessage;
    const statusCode = error.response?.status || 500;

    // Return a standardized error object
    return Promise.reject({
      success: false,
      statusCode,
      message,
      data: null,
    });
  }
);

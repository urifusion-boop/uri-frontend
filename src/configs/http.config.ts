import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { STORE_KEYS } from './store.config';

class UriHttpClient {
  private static client: AxiosInstance;

  static initialize() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_URI_API_BASE_URL || 'https://api.uricreative.com:8443',
      withCredentials: false,
      headers: {
        'Content-Type': 'application/json',
      },
      validateStatus: (status) => status >= 200 && status < 300,
    });

    this.client.interceptors.request.use(
      (config) => {
        const tokens = this.getStoredTokens();
        if (tokens) {
          config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError) => {
        return this.handleErrorResponse(error);
      }
    );

    // this.client.interceptors.response.use(
    //   (response: AxiosResponse) => response,
    //   (error: AxiosError) => this.handleErrorResponse(error)
    // );
  }

  static getClient(): AxiosInstance {
    if (!this.client) {
      this.initialize();
    }
    return this.client;
  }

  static addHeaders(headers: Record<string, string>): void {
    this.getClient().defaults.headers = {
      ...this.getClient().defaults.headers,
      ...headers,
    };
  }

  private static getStoredTokens() {
    // Replace with a secure storage mechanism if necessary
    return JSON.parse(localStorage.getItem(STORE_KEYS.USER_TOKENS) || '{}');
  }

  private static async handleErrorResponse(error: AxiosError) {
    if (error.response) {
      switch (error.response.status) {
        case 402:
          // Dispatch a custom event for payment-required errors
          window.dispatchEvent(new CustomEvent('payment-required'));

          return await Promise.reject(error.response);
        case 401:
        case 403:
          this.clearUserData();
          window.dispatchEvent(new CustomEvent('unauthorized'));
          return await Promise.reject(error.response);
        default:
          return await Promise.resolve(error.response);
      }
    }
    return Promise.reject(error);
  }

  private static clearUserData() {
    localStorage.removeItem(STORE_KEYS.USER_DETAILS);
    localStorage.removeItem(STORE_KEYS.USER_TOKENS);
    localStorage.removeItem(STORE_KEYS.USER_PROFILE);
  }

  static readonly instantiate = () => new UriHttpClient();
}

export { UriHttpClient };

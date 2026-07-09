import {
  FORGOT_PASSWORD_ENDPOINT,
  INGREDIENTS_ENDPOINT,
  LOGIN_ENDPOINT,
  LOGOUT_ENDPOINT,
  ORDERS_ENDPOINT,
  REGISTER_ENDPOINT,
  RESET_PASSWORD_ENDPOINT,
  TOKEN_ENDPOINT,
  USER_ENDPOINT,
} from './constants';
import { getAccessToken, getRefreshToken, saveTokens } from './token-storage';

import type {
  TAuthCredentials,
  TAuthResponse,
  TIngredient,
  TIngredientsResponse,
  TMessageResponse,
  TOrderResponse,
  TRegisterData,
  TResetPasswordData,
  TTokenResponse,
  TUpdateUserData,
  TUserResponse,
} from '@utils/types';

type TApiErrorResponse = {
  success?: boolean;
  message?: string;
};

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const checkResponse = async <T>(response: Response): Promise<T> => {
  const data = (await response.json()) as T & TApiErrorResponse;

  if (!response.ok) {
    throw new ApiError(
      data.message ?? `HTTP error: ${response.status}`,
      response.status
    );
  }

  return data;
};

const request = async <T>(url: string, options?: RequestInit): Promise<T> => {
  const response = await fetch(url, options);

  return checkResponse<T>(response);
};

const getJsonHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json',
});

const addAuthorization = (options: RequestInit, accessToken: string): RequestInit => {
  const headers = new Headers(options.headers);

  headers.set('authorization', accessToken);

  return { ...options, headers };
};

export const refreshTokens = async (): Promise<TTokenResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  const data = await request<TTokenResponse>(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ token: refreshToken }),
  });

  saveTokens(data);

  return data;
};

export const fetchWithRefresh = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  let accessToken = getAccessToken();

  if (!accessToken) {
    accessToken = (await refreshTokens()).accessToken;
  }

  try {
    return await request<T>(url, addAuthorization(options, accessToken));
  } catch (error) {
    if (!(error instanceof ApiError) || ![401, 403].includes(error.status)) {
      throw error;
    }

    const tokens = await refreshTokens();

    return request<T>(url, addAuthorization(options, tokens.accessToken));
  }
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const data = await request<TIngredientsResponse>(INGREDIENTS_ENDPOINT);

  if (!data.success) {
    throw new Error('Failed to load ingredients');
  }

  return data.data;
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  const data = await fetchWithRefresh<TOrderResponse>(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ ingredients }),
  });

  if (!data.success) {
    throw new Error('Failed to create order');
  }

  return data;
};

export const registerUserRequest = (data: TRegisterData): Promise<TAuthResponse> =>
  request<TAuthResponse>(REGISTER_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(data),
  });

export const loginUserRequest = (data: TAuthCredentials): Promise<TAuthResponse> =>
  request<TAuthResponse>(LOGIN_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(data),
  });

export const logoutUserRequest = async (): Promise<TMessageResponse> => {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('Refresh token is missing');
  }

  return request<TMessageResponse>(LOGOUT_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ token: refreshToken }),
  });
};

export const getUserRequest = (): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(USER_ENDPOINT);

export const updateUserRequest = (data: TUpdateUserData): Promise<TUserResponse> =>
  fetchWithRefresh<TUserResponse>(USER_ENDPOINT, {
    method: 'PATCH',
    headers: getJsonHeaders(),
    body: JSON.stringify(data),
  });

export const forgotPasswordRequest = (email: string): Promise<TMessageResponse> =>
  request<TMessageResponse>(FORGOT_PASSWORD_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify({ email }),
  });

export const resetPasswordRequest = (
  data: TResetPasswordData
): Promise<TMessageResponse> =>
  request<TMessageResponse>(RESET_PASSWORD_ENDPOINT, {
    method: 'POST',
    headers: getJsonHeaders(),
    body: JSON.stringify(data),
  });

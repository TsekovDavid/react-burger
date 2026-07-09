import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  RESET_PASSWORD_ACCESS_KEY,
} from './constants';

import type { TTokenResponse } from './types';

export const getAccessToken = (): string | null =>
  localStorage.getItem(ACCESS_TOKEN_KEY);

export const getRefreshToken = (): string | null =>
  localStorage.getItem(REFRESH_TOKEN_KEY);

export const saveTokens = (
  tokens: Pick<TTokenResponse, 'accessToken' | 'refreshToken'>
): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refreshToken);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

export const allowPasswordReset = (): void => {
  localStorage.setItem(RESET_PASSWORD_ACCESS_KEY, 'true');
};

export const disallowPasswordReset = (): void => {
  localStorage.removeItem(RESET_PASSWORD_ACCESS_KEY);
};

export const canResetPassword = (): boolean =>
  localStorage.getItem(RESET_PASSWORD_ACCESS_KEY) === 'true';

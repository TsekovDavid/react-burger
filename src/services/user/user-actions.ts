import {
  forgotPasswordRequest,
  getUserRequest,
  loginUserRequest,
  logoutUserRequest,
  registerUserRequest,
  resetPasswordRequest,
  updateUserRequest,
} from '@utils/api';
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from '@utils/token-storage';

import type {
  TAuthCredentials,
  TRegisterData,
  TResetPasswordData,
  TUpdateUserData,
  TUser,
} from '@utils/types';

import { createAsyncThunk } from '@reduxjs/toolkit';

const getErrorMessage = (error: unknown, fallback: string): string =>
  error instanceof Error ? error.message : fallback;

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    try {
      const response = await registerUserRequest(data);

      saveTokens(response);

      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось зарегистрироваться'));
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TAuthCredentials, { rejectWithValue }) => {
    try {
      const response = await loginUserRequest(data);

      saveTokens(response);

      return response.user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось войти'));
    }
  }
);

export const checkUserAuth = createAsyncThunk<
  TUser | null,
  void,
  { rejectValue: string }
>('user/checkAuth', async (_, { rejectWithValue }) => {
  if (!getAccessToken() && !getRefreshToken()) {
    return null;
  }

  try {
    return (await getUserRequest()).user;
  } catch (error) {
    clearTokens();

    return rejectWithValue(getErrorMessage(error, 'Не удалось проверить авторизацию'));
  }
});

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    if (!getRefreshToken()) {
      clearTokens();
      return;
    }

    try {
      await logoutUserRequest();
      clearTokens();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось выйти'));
    }
  }
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: TUpdateUserData, { rejectWithValue }) => {
    try {
      return (await updateUserRequest(data)).user;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось обновить профиль'));
    }
  }
);

export const requestPasswordReset = createAsyncThunk(
  'user/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      return await forgotPasswordRequest(email);
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, 'Не удалось отправить письмо для восстановления')
      );
    }
  }
);

export const resetUserPassword = createAsyncThunk(
  'user/resetPassword',
  async (data: TResetPasswordData, { rejectWithValue }) => {
    try {
      return await resetPasswordRequest(data);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Не удалось сохранить пароль'));
    }
  }
);

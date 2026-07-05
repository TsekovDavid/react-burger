import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  resetUserPassword,
  updateUser,
} from './user-actions';

import type { TUser } from '@utils/types';

import { createSlice, isAnyOf } from '@reduxjs/toolkit';

type TUserState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

const initialState: TUserState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
};

const getRejectedError = (payload: unknown, fallback: string): string =>
  typeof payload === 'string' ? payload : fallback;

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  selectors: {
    selectUser: (state) => state.user,
    selectIsAuthChecked: (state) => state.isAuthChecked,
    selectUserIsLoading: (state) => state.isLoading,
    selectUserError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.user = null;
        state.isAuthChecked = true;
        state.isLoading = false;
        state.error = getRejectedError(
          action.payload,
          'Не удалось проверить авторизацию'
        );
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthChecked = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addMatcher(
        isAnyOf(
          checkUserAuth.pending,
          registerUser.pending,
          loginUser.pending,
          logoutUser.pending,
          updateUser.pending,
          requestPasswordReset.pending,
          resetUserPassword.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          checkUserAuth.fulfilled,
          registerUser.fulfilled,
          loginUser.fulfilled,
          logoutUser.fulfilled,
          updateUser.fulfilled,
          requestPasswordReset.fulfilled,
          resetUserPassword.fulfilled
        ),
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          logoutUser.rejected,
          updateUser.rejected,
          requestPasswordReset.rejected,
          resetUserPassword.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.error = getRejectedError(action.payload, 'Произошла ошибка');
        }
      );
  },
});

export const { clearUserError } = userSlice.actions;
export const { selectIsAuthChecked, selectUser, selectUserError, selectUserIsLoading } =
  userSlice.selectors;

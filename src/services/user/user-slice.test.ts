import { testUser } from '@services/test-fixtures';

import {
  checkUserAuth,
  loginUser,
  logoutUser,
  registerUser,
  requestPasswordReset,
  updateUser,
} from './user-actions';
import { clearUserError, userSlice } from './user-slice';

describe('userSlice', () => {
  const reducer = userSlice.reducer;
  const credentials = { email: testUser.email, password: 'password' };
  const registrationData = { ...credentials, name: testUser.name };

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      user: null,
      isAuthChecked: false,
      isLoading: false,
      error: null,
    });
  });

  it('clears the current error', () => {
    const state = reducer(
      { user: null, isAuthChecked: true, isLoading: false, error: 'Ошибка' },
      clearUserError()
    );

    expect(state.error).toBeNull();
  });

  it('stores the user after a successful auth check', () => {
    const state = reducer(
      undefined,
      checkUserAuth.fulfilled(testUser, 'request-id', undefined)
    );

    expect(state.user).toEqual(testUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('finishes auth checking after a rejected request', () => {
    const state = reducer(
      undefined,
      checkUserAuth.rejected(
        new Error('Network error'),
        'request-id',
        undefined,
        'Не удалось проверить авторизацию'
      )
    );

    expect(state.user).toBeNull();
    expect(state.isAuthChecked).toBe(true);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось проверить авторизацию');
  });

  it('stores a registered user', () => {
    const state = reducer(
      undefined,
      registerUser.fulfilled(testUser, 'request-id', registrationData)
    );

    expect(state.user).toEqual(testUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('stores a logged-in user', () => {
    const state = reducer(
      undefined,
      loginUser.fulfilled(testUser, 'request-id', credentials)
    );

    expect(state.user).toEqual(testUser);
    expect(state.isAuthChecked).toBe(true);
  });

  it('clears the user after logout', () => {
    const state = reducer(
      { user: testUser, isAuthChecked: true, isLoading: true, error: null },
      logoutUser.fulfilled(undefined, 'request-id', undefined)
    );

    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
  });

  it('updates user data', () => {
    const updatedUser = { ...testUser, name: 'Updated User' };
    const state = reducer(
      { user: testUser, isAuthChecked: true, isLoading: true, error: null },
      updateUser.fulfilled(updatedUser, 'request-id', {
        ...registrationData,
        name: updatedUser.name,
      })
    );

    expect(state.user).toEqual(updatedUser);
    expect(state.isLoading).toBe(false);
  });

  it('sets loading for asynchronous actions', () => {
    const state = reducer(
      { user: null, isAuthChecked: true, isLoading: false, error: 'Ошибка' },
      requestPasswordReset.pending('request-id', testUser.email)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('clears loading after a fulfilled asynchronous action', () => {
    const state = reducer(
      { user: null, isAuthChecked: true, isLoading: true, error: null },
      requestPasswordReset.fulfilled(
        { success: true, message: 'Письмо отправлено' },
        'request-id',
        testUser.email
      )
    );

    expect(state.isLoading).toBe(false);
  });

  it('stores an asynchronous action error', () => {
    const state = reducer(
      { user: null, isAuthChecked: true, isLoading: true, error: null },
      loginUser.rejected(
        new Error('Unauthorized'),
        'request-id',
        credentials,
        'Неверный логин или пароль'
      )
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Неверный логин или пароль');
  });
});

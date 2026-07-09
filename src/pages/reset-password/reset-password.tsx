import { AuthForm } from '@components/auth-form/auth-form';
import { useClearUserError } from '@hooks/use-clear-user-error';
import { useForm } from '@hooks/use-form';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { resetUserPassword } from '@services/user/user-actions';
import { selectUserError, selectUserIsLoading } from '@services/user/user-slice';
import { canResetPassword, disallowPasswordReset } from '@utils/token-storage';
import { isValidPassword, PASSWORD_VALIDATION_ERROR } from '@utils/validation';

import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';

export const ResetPasswordPage = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ password: '', token: '' });
  const { password, token } = values;
  const [validationError, setValidationError] = useState<string | null>(null);
  const [hasResetAccess] = useState(canResetPassword);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectUserIsLoading);
  const error = useAppSelector(selectUserError);

  useClearUserError();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidPassword(password)) {
      setValidationError(PASSWORD_VALIDATION_ERROR);
      return;
    }

    setValidationError(null);

    try {
      await dispatch(resetUserPassword({ password, token })).unwrap();
      disallowPasswordReset();
      void navigate('/login', { replace: true });
    } catch {
      // The request error is displayed from the user slice.
    }
  };

  if (!hasResetAccess) {
    return <Navigate to='/forgot-password' replace />;
  }

  return (
    <AuthForm
      title='Восстановление пароля'
      submitText='Сохранить'
      onSubmit={handleSubmit}
      error={validationError ?? error}
      isLoading={isLoading}
      footer={
        <p className='text text_type_main-default text_color_inactive'>
          Вспомнили пароль? <Link to='/login'>Войти</Link>
        </p>
      }
    >
      <PasswordInput
        value={password}
        onChange={(event) => {
          handleChange(event);
          setValidationError(null);
        }}
        placeholder='Введите новый пароль'
        name='password'
        required
      />
      <Input
        value={token}
        onChange={handleChange}
        placeholder='Введите код из письма'
        name='token'
        required
      />
    </AuthForm>
  );
};

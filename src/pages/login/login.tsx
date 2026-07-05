import { AuthForm } from '@components/auth-form/auth-form';
import { useClearUserError } from '@hooks/use-clear-user-error';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { loginUser } from '@services/user/user-actions';
import { selectUserError, selectUserIsLoading } from '@services/user/user-slice';
import {
  EMAIL_VALIDATION_ERROR,
  isValidEmail,
  isValidPassword,
  PASSWORD_VALIDATION_ERROR,
} from '@utils/validation';

import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectUserIsLoading);
  const error = useAppSelector(selectUserError);

  useClearUserError();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setValidationError(EMAIL_VALIDATION_ERROR);
      return;
    }

    if (!isValidPassword(password)) {
      setValidationError(PASSWORD_VALIDATION_ERROR);
      return;
    }

    setValidationError(null);

    try {
      await dispatch(loginUser({ email, password })).unwrap();
    } catch {
      // The request error is displayed from the user slice.
    }
  };

  return (
    <AuthForm
      title='Вход'
      submitText='Войти'
      onSubmit={handleSubmit}
      error={validationError ?? error}
      isLoading={isLoading}
      footer={
        <>
          <p className='text text_type_main-default text_color_inactive'>
            Вы — новый пользователь? <Link to='/register'>Зарегистрироваться</Link>
          </p>
          <p className='text text_type_main-default text_color_inactive'>
            Забыли пароль? <Link to='/forgot-password'>Восстановить пароль</Link>
          </p>
        </>
      }
    >
      <EmailInput
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setValidationError(null);
        }}
        placeholder='E-mail'
        name='email'
        required
      />
      <PasswordInput
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setValidationError(null);
        }}
        placeholder='Пароль'
        name='password'
        required
      />
    </AuthForm>
  );
};

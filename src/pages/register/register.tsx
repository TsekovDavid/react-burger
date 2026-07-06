import { AuthForm } from '@components/auth-form/auth-form';
import { useClearUserError } from '@hooks/use-clear-user-error';
import { useForm } from '@hooks/use-form';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { registerUser } from '@services/user/user-actions';
import { selectUserError, selectUserIsLoading } from '@services/user/user-slice';
import {
  EMAIL_VALIDATION_ERROR,
  isValidEmail,
  isValidPassword,
  PASSWORD_VALIDATION_ERROR,
} from '@utils/validation';

import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const RegisterPage = (): React.JSX.Element => {
  const { values, handleChange } = useForm({ name: '', email: '', password: '' });
  const { name, email, password } = values;
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
      await dispatch(registerUser({ name, email, password })).unwrap();
    } catch {
      // The request error is displayed from the user slice.
    }
  };

  return (
    <AuthForm
      title='Регистрация'
      submitText='Зарегистрироваться'
      onSubmit={handleSubmit}
      error={validationError ?? error}
      isLoading={isLoading}
      footer={
        <p className='text text_type_main-default text_color_inactive'>
          Уже зарегистрированы? <Link to='/login'>Войти</Link>
        </p>
      }
    >
      <Input
        value={name}
        onChange={handleChange}
        placeholder='Имя'
        name='name'
        required
      />
      <EmailInput
        value={email}
        onChange={(event) => {
          handleChange(event);
          setValidationError(null);
        }}
        placeholder='E-mail'
        name='email'
        required
      />
      <PasswordInput
        value={password}
        onChange={(event) => {
          handleChange(event);
          setValidationError(null);
        }}
        placeholder='Пароль'
        name='password'
        required
      />
    </AuthForm>
  );
};

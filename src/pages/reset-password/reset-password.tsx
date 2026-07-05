import { AuthForm } from '@components/auth-form/auth-form';

import { Input, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const ResetPasswordPage = (): React.JSX.Element => {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthForm
      title='Восстановление пароля'
      submitText='Сохранить'
      onSubmit={handleSubmit}
      footer={
        <p className='text text_type_main-default text_color_inactive'>
          Вспомнили пароль? <Link to='/login'>Войти</Link>
        </p>
      }
    >
      <PasswordInput
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='Введите новый пароль'
        name='password'
        required
      />
      <Input
        value={token}
        onChange={(event) => setToken(event.target.value)}
        placeholder='Введите код из письма'
        name='token'
        required
      />
    </AuthForm>
  );
};

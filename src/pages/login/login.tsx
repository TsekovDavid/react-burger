import { AuthForm } from '@components/auth-form/auth-form';

import { EmailInput, PasswordInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const LoginPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthForm
      title='Вход'
      submitText='Войти'
      onSubmit={handleSubmit}
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
        onChange={(event) => setEmail(event.target.value)}
        placeholder='E-mail'
        name='email'
        required
      />
      <PasswordInput
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='Пароль'
        name='password'
        required
      />
    </AuthForm>
  );
};

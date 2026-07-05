import { AuthForm } from '@components/auth-form/auth-form';

import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <AuthForm
      title='Восстановление пароля'
      submitText='Восстановить'
      onSubmit={handleSubmit}
      footer={
        <p className='text text_type_main-default text_color_inactive'>
          Вспомнили пароль? <Link to='/login'>Войти</Link>
        </p>
      }
    >
      <EmailInput
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder='Укажите e-mail'
        name='email'
        required
      />
    </AuthForm>
  );
};

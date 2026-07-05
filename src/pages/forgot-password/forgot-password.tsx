import { AuthForm } from '@components/auth-form/auth-form';
import { useClearUserError } from '@hooks/use-clear-user-error';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { requestPasswordReset } from '@services/user/user-actions';
import { selectUserError, selectUserIsLoading } from '@services/user/user-slice';
import { allowPasswordReset } from '@utils/token-storage';
import { EMAIL_VALIDATION_ERROR, isValidEmail } from '@utils/validation';

import { EmailInput } from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const ForgotPasswordPage = (): React.JSX.Element => {
  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLoading = useAppSelector(selectUserIsLoading);
  const error = useAppSelector(selectUserError);

  useClearUserError();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isValidEmail(email)) {
      setValidationError(EMAIL_VALIDATION_ERROR);
      return;
    }

    setValidationError(null);

    try {
      await dispatch(requestPasswordReset(email)).unwrap();
      allowPasswordReset();
      void navigate('/reset-password');
    } catch {
      // The request error is displayed from the user slice.
    }
  };

  return (
    <AuthForm
      title='Восстановление пароля'
      submitText='Восстановить'
      onSubmit={handleSubmit}
      error={validationError ?? error}
      isLoading={isLoading}
      footer={
        <p className='text text_type_main-default text_color_inactive'>
          Вспомнили пароль? <Link to='/login'>Войти</Link>
        </p>
      }
    >
      <EmailInput
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setValidationError(null);
        }}
        placeholder='Укажите e-mail'
        name='email'
        required
      />
    </AuthForm>
  );
};

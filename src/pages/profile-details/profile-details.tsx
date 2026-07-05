import { useClearUserError } from '@hooks/use-clear-user-error';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { updateUser } from '@services/user/user-actions';
import {
  selectUser,
  selectUserError,
  selectUserIsLoading,
} from '@services/user/user-slice';
import {
  EMAIL_VALIDATION_ERROR,
  isValidEmail,
  isValidPassword,
  PASSWORD_VALIDATION_ERROR,
} from '@utils/validation';

import styles from './profile-details.module.css';

import {
  Button,
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState, type FormEvent, type MouseEvent } from 'react';

export const ProfileDetailsPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const isLoading = useAppSelector(selectUserIsLoading);
  const error = useAppSelector(selectUserError);
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [password, setPassword] = useState('');
  const [passwordInputVersion, setPasswordInputVersion] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);
  const isChanged =
    name !== (user?.name ?? '') || email !== (user?.email ?? '') || password !== '';

  useClearUserError();

  useEffect(() => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setValidationError(null);
    setPasswordInputVersion((version) => version + 1);
  }, [user]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isChanged) {
      return;
    }

    if (!isValidEmail(email)) {
      setValidationError(EMAIL_VALIDATION_ERROR);
      return;
    }

    if (password && !isValidPassword(password)) {
      setValidationError(PASSWORD_VALIDATION_ERROR);
      return;
    }

    setValidationError(null);

    try {
      await dispatch(updateUser({ name, email, password })).unwrap();
    } catch {
      // The request error is displayed from the user slice.
    }
  };

  const handleCancel = () => {
    setName(user?.name ?? '');
    setEmail(user?.email ?? '');
    setPassword('');
    setValidationError(null);
    setPasswordInputVersion((version) => version + 1);
  };

  const handleCancelMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        extraClass='mb-6'
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder='Имя'
        name='name'
        icon='EditIcon'
        required
      />
      <EmailInput
        extraClass='mb-6'
        value={email}
        onChange={(event) => {
          setEmail(event.target.value);
          setValidationError(null);
        }}
        placeholder='Логин'
        name='email'
        isIcon
        required
      />
      <PasswordInput
        key={passwordInputVersion}
        value={password}
        onChange={(event) => {
          setPassword(event.target.value);
          setValidationError(null);
        }}
        placeholder='Пароль'
        name='password'
        icon='EditIcon'
      />
      {isChanged ? (
        <div className={styles.actions}>
          <Button
            htmlType='button'
            type='secondary'
            size='medium'
            disabled={isLoading}
            onClick={handleCancel}
            onMouseDown={handleCancelMouseDown}
          >
            Отмена
          </Button>
          <Button htmlType='submit' type='primary' size='medium' disabled={isLoading}>
            Сохранить
          </Button>
        </div>
      ) : null}
      {validationError || error ? (
        <p className={`${styles.error} text text_type_main-default`}>
          {validationError ?? error}
        </p>
      ) : null}
    </form>
  );
};

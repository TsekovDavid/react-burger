import {
  EmailInput,
  Input,
  PasswordInput,
} from '@krgaa/react-developer-burger-ui-components';
import { useState, type FormEvent } from 'react';

export const ProfileDetailsPage = (): React.JSX.Element => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        extraClass='mb-6'
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder='Имя'
        name='name'
        icon='EditIcon'
      />
      <EmailInput
        extraClass='mb-6'
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder='Логин'
        name='email'
        isIcon
      />
      <PasswordInput
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder='Пароль'
        name='password'
        icon='EditIcon'
      />
    </form>
  );
};

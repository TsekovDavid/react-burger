import type { FormEventHandler, ReactNode } from 'react';

import styles from './auth-form.module.css';

import { Button } from '@krgaa/react-developer-burger-ui-components';

type TAuthFormProps = {
  title: string;
  submitText: string;
  children: ReactNode;
  footer: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  error?: string | null;
  isLoading?: boolean;
};

export const AuthForm = ({
  title,
  submitText,
  children,
  footer,
  onSubmit,
  error = null,
  isLoading = false,
}: TAuthFormProps): React.JSX.Element => (
  <main className={styles.page}>
    <section className={styles.content}>
      <h1 className='text text_type_main-medium mb-6'>{title}</h1>
      <form className={styles.form} onSubmit={onSubmit}>
        {children}
        <Button htmlType='submit' type='primary' size='medium' disabled={isLoading}>
          {submitText}
        </Button>
      </form>
      {error ? (
        <p className={`${styles.error} text text_type_main-default`}>{error}</p>
      ) : null}
      <div className={styles.links}>{footer}</div>
    </section>
  </main>
);

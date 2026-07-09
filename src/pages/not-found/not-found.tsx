import styles from '../page.module.css';

import { Link } from 'react-router-dom';

export const NotFoundPage = (): React.JSX.Element => (
  <main className={styles.centered}>
    <p className='text text_type_digits-large mb-6'>404</p>
    <h1 className='text text_type_main-medium mb-8'>Страница не найдена</h1>
    <Link className={`${styles.link} text text_type_main-default`} to='/'>
      Вернуться к конструктору
    </Link>
  </main>
);

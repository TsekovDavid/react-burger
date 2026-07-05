import styles from '../page.module.css';

import { NavLink, Outlet, useLocation } from 'react-router-dom';

export const ProfilePage = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const isOrdersActive = pathname.startsWith('/profile/orders');

  return (
    <main className={styles.profile}>
      <aside>
        <nav className={styles['profile-menu']}>
          <NavLink
            end
            to='/profile'
            className={({ isActive }) =>
              `${styles['profile-link']} ${
                isActive ? styles['profile-link-active'] : ''
              } text text_type_main-medium`
            }
          >
            Профиль
          </NavLink>
          <NavLink
            to='/profile/orders'
            className={`${styles['profile-link']} ${
              isOrdersActive ? styles['profile-link-active'] : ''
            } text text_type_main-medium`}
          >
            История заказов
          </NavLink>
          <button
            className={`${styles['profile-link']} ${styles['profile-button']} text text_type_main-medium`}
            type='button'
          >
            Выход
          </button>
        </nav>
        <p className={`${styles['profile-description']} text text_type_main-default`}>
          В этом разделе вы можете изменить свои персональные данные
        </p>
      </aside>
      <section className={styles['profile-content']}>
        <Outlet />
      </section>
    </main>
  );
};

import { useAppDispatch, useAppSelector } from '@services/hooks';
import { logoutUser } from '@services/user/user-actions';
import { selectUserIsLoading } from '@services/user/user-slice';

import styles from '../page.module.css';

import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';

export const ProfilePage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const isOrdersActive = pathname.startsWith('/profile/orders');
  const isLoading = useAppSelector(selectUserIsLoading);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      void navigate('/login', { replace: true });
    } catch {
      // The request error remains available in the user slice.
    }
  };

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
            disabled={isLoading}
            onClick={handleLogout}
          >
            {isLoading ? 'Выходим...' : 'Выход'}
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

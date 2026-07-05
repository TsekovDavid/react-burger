import styles from './app-header.module.css';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink, useLocation } from 'react-router-dom';

export const AppHeader = (): React.JSX.Element => {
  const { pathname } = useLocation();
  const isHomeActive = pathname === '/' || pathname.startsWith('/ingredients/');
  const isFeedActive = pathname.startsWith('/feed');
  const isProfileActive = pathname.startsWith('/profile');

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <div className={styles['menu-part-left']}>
          <NavLink
            to='/'
            className={`${styles.link} ${isHomeActive ? styles['link-active'] : ''}`}
          >
            <BurgerIcon type={isHomeActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default'>Конструктор</p>
          </NavLink>
          <NavLink
            to='/feed'
            className={`${styles.link} ${isFeedActive ? styles['link-active'] : ''}`}
          >
            <ListIcon type={isFeedActive ? 'primary' : 'secondary'} />
            <p className='text text_type_main-default'>Лента заказов</p>
          </NavLink>
        </div>
        <Link to='/' className={styles.logo} aria-label='Stellar Burgers'>
          <Logo />
        </Link>
        <NavLink
          to='/profile'
          className={`${styles.link} ${styles['link-position-last']} ${
            isProfileActive ? styles['link-active'] : ''
          }`}
        >
          <ProfileIcon type={isProfileActive ? 'primary' : 'secondary'} />
          <p className='text text_type_main-default'>Личный кабинет</p>
        </NavLink>
      </nav>
    </header>
  );
};

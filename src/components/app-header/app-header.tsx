import styles from './app-header.module.css';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, NavLink } from 'react-router-dom';

export const AppHeader = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <div className={styles['menu-part-left']}>
          <NavLink
            to='/'
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles['link-active'] : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default'>Конструктор</p>
              </>
            )}
          </NavLink>
          <NavLink
            to='/feed'
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles['link-active'] : ''}`
            }
          >
            {({ isActive }) => (
              <>
                <ListIcon type={isActive ? 'primary' : 'secondary'} />
                <p className='text text_type_main-default'>Лента заказов</p>
              </>
            )}
          </NavLink>
        </div>
        <Link to='/' className={styles.logo} aria-label='Stellar Burgers'>
          <Logo />
        </Link>
        <NavLink
          to='/profile'
          className={({ isActive }) =>
            `${styles.link} ${styles['link-position-last']} ${
              isActive ? styles['link-active'] : ''
            }`
          }
        >
          {({ isActive }) => (
            <>
              <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
              <p className='text text_type_main-default'>Личный кабинет</p>
            </>
          )}
        </NavLink>
      </nav>
    </header>
  );
};

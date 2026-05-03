import styles from './app-header.module.css';

import {
  BurgerIcon,
  ListIcon,
  Logo,
  ProfileIcon,
} from '@krgaa/react-developer-burger-ui-components';

export const AppHeader = (): React.JSX.Element => {
  const preventNavigation = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.menu}>
        <div className={styles['menu-part-left']}>
          {/* Тут должны быть ссылки, а не например кнопки или абзацы */}
          <a
            href='/'
            className={`${styles.link} ${styles['link-active']}`}
            onClick={preventNavigation}
          >
            <BurgerIcon type='primary' />
            <p className='text text_type_main-default'>Конструктор</p>
          </a>
          <a href='/feed' className={styles.link} onClick={preventNavigation}>
            <ListIcon type='secondary' />
            <p className='text text_type_main-default'>Лента заказов</p>
          </a>
        </div>
        <div className={styles.logo}>
          <Logo />
        </div>
        <a
          href='/profile'
          className={`${styles.link} ${styles['link-position-last']}`}
          onClick={preventNavigation}
        >
          <ProfileIcon type='secondary' />
          <p className='text text_type_main-default'>Личный кабинет</p>
        </a>
      </nav>
    </header>
  );
};

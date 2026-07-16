import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { getOrderIngredients, getOrderStatusLabel, getOrderTotal } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-card.module.css';

import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';
import { Link, type Location } from 'react-router-dom';

type TOrderCardProps = {
  order: TOrder;
  to: string;
  background: Location;
  showStatus?: boolean;
};

const MAX_VISIBLE_INGREDIENTS = 6;

export const OrderCard = ({
  order,
  to,
  background,
  showStatus = false,
}: TOrderCardProps): React.JSX.Element => {
  const ingredients = useAppSelector(selectIngredients);
  const orderIngredients = getOrderIngredients(order, ingredients);
  const visibleIngredients = orderIngredients.slice(0, MAX_VISIBLE_INGREDIENTS);
  const hiddenIngredientsCount = orderIngredients.length - visibleIngredients.length;
  const total = getOrderTotal(order, ingredients);

  return (
    <li>
      <Link className={styles.card} to={to} state={{ background }}>
        <header className={styles.header}>
          <span className='text text_type_digits-default'>#{order.number}</span>
          <FormattedDate
            date={new Date(order.createdAt)}
            className='text text_type_main-default text_color_inactive'
          />
        </header>
        <h2 className={`${styles.name} text text_type_main-medium`}>{order.name}</h2>
        {showStatus ? (
          <p
            className={`${styles.status} ${
              order.status === 'done' ? styles['status-done'] : ''
            } text text_type_main-default`}
          >
            {getOrderStatusLabel(order.status)}
          </p>
        ) : null}
        <footer className={styles.footer}>
          <ul className={styles.ingredients}>
            {visibleIngredients.map((ingredient, index) => {
              const isLast = index === visibleIngredients.length - 1;

              return (
                <li
                  key={`${ingredient._id}-${index}`}
                  className={styles['ingredient-item']}
                  style={{ zIndex: visibleIngredients.length - index }}
                >
                  <img
                    className={`${styles.image} ${
                      isLast && hiddenIngredientsCount > 0 ? styles['image-dimmed'] : ''
                    }`}
                    src={ingredient.image_mobile}
                    alt={ingredient.name}
                  />
                  {isLast && hiddenIngredientsCount > 0 ? (
                    <span className={`${styles.more} text text_type_main-default`}>
                      +{hiddenIngredientsCount}
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className={styles.price}>
            <span className='text text_type_digits-default'>{total}</span>
            <CurrencyIcon type='primary' />
          </div>
        </footer>
      </Link>
    </li>
  );
};

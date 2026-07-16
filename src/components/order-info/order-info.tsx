import { useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  getOrderIngredientDetails,
  getOrderStatusLabel,
  getOrderTotal,
} from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './order-info.module.css';

import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

type TOrderInfoProps = {
  order: TOrder;
  centeredNumber?: boolean;
};

export const OrderInfo = ({
  order,
  centeredNumber = false,
}: TOrderInfoProps): React.JSX.Element => {
  const ingredients = useAppSelector(selectIngredients);
  const ingredientDetails = getOrderIngredientDetails(order, ingredients);
  const total = getOrderTotal(order, ingredients);

  return (
    <article className={styles.order}>
      <p
        className={`${styles.number} ${
          centeredNumber ? styles['number-centered'] : ''
        } text text_type_digits-default`}
      >
        #{order.number}
      </p>
      <h1 className={`${styles.name} text text_type_main-medium`}>{order.name}</h1>
      <p
        className={`${styles.status} ${
          order.status === 'done' ? styles['status-done'] : ''
        } text text_type_main-default`}
      >
        {getOrderStatusLabel(order.status)}
      </p>
      <h2 className={`${styles.heading} text text_type_main-medium`}>Состав:</h2>
      <ul className={`${styles.ingredients} custom-scroll`}>
        {ingredientDetails.map(({ ingredient, count }) => (
          <li className={styles['ingredient-row']} key={ingredient._id}>
            <div className={styles['ingredient-main']}>
              <div className={styles['image-frame']}>
                <img
                  className={styles.image}
                  src={ingredient.image_mobile}
                  alt={ingredient.name}
                />
              </div>
              <span className='text text_type_main-default'>{ingredient.name}</span>
            </div>
            <div className={styles.price}>
              <span className='text text_type_digits-default'>
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type='primary' />
            </div>
          </li>
        ))}
      </ul>
      <footer className={styles.footer}>
        <FormattedDate
          date={new Date(order.createdAt)}
          className='text text_type_main-default text_color_inactive'
        />
        <div className={styles.price}>
          <span className='text text_type_digits-default'>{total}</span>
          <CurrencyIcon type='primary' />
        </div>
      </footer>
    </article>
  );
};

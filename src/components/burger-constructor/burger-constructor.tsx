import type { TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';

type TBurgerConstructorProps = {
  bun: TIngredient | null;
  ingredients: TIngredient[];
  totalPrice: number;
  onOrderClick: () => void;
};

export const BurgerConstructor = ({
  bun,
  ingredients,
  totalPrice,
  onOrderClick,
}: TBurgerConstructorProps): React.JSX.Element => {
  const handleClose = useCallback(() => undefined, []);

  return (
    <section className={styles['burger-constructor']}>
      {bun ? (
        <div className={`${styles['locked-element']} ${styles['top-locked']}`}>
          <ConstructorElement
            type='top'
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : null}
      <ul className={`${styles.list} custom-scroll`}>
        {ingredients.map((ingredient, index) => (
          <li key={`${ingredient._id}-${index}`} className={styles.item}>
            <DragIcon type='primary' />
            <ConstructorElement
              text={ingredient.name}
              price={ingredient.price}
              thumbnail={ingredient.image}
              handleClose={handleClose}
            />
          </li>
        ))}
      </ul>
      {bun ? (
        <div className={`${styles['locked-element']} ${styles['bottom-locked']}`}>
          <ConstructorElement
            type='bottom'
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : null}
      <div className={styles.footer}>
        <div className={styles.total}>
          <span className='text text_type_digits-medium'>{totalPrice}</span>
          <CurrencyIcon type='primary' className={styles.currency} />
        </div>
        <Button htmlType='button' type='primary' size='large' onClick={onOrderClick}>
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

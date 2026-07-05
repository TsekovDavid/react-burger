import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  clearCurrentIngredient,
  selectCurrentIngredient,
} from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';
import { clearOrder, selectOrderNumber } from '@services/order/order-slice';

import styles from './home.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export const Home = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const orderNumber = useAppSelector(selectOrderNumber);

  const handleIngredientClose = useCallback(() => {
    dispatch(clearCurrentIngredient());
  }, [dispatch]);

  const handleOrderClose = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  if (isLoading) {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.status}>
        <div className={styles.error}>
          <p className='text text_type_main-medium mb-4'>
            Не удалось загрузить ингредиенты
          </p>
          <p className='text text_type_main-default text_color_inactive'>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <main className={styles.main}>
        <BurgerIngredients ingredients={ingredients} />
        <BurgerConstructor />
      </main>
      {selectedIngredient ? (
        <Modal title='Детали ингредиента' onClose={handleIngredientClose}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      ) : null}
      {orderNumber ? (
        <Modal onClose={handleOrderClose}>
          <OrderDetails orderNumber={orderNumber} />
        </Modal>
      ) : null}
    </DndProvider>
  );
};

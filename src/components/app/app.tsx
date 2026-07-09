import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import {
  selectCurrentIngredient,
  clearCurrentIngredient,
} from '@services/current-ingredient/current-ingredient-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients/ingredients-actions';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';
import { clearOrder, selectOrderNumber } from '@services/order/order-slice';

import styles from './app.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const orderNumber = useAppSelector(selectOrderNumber);

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  const handleIngredientClose = useCallback(() => {
    dispatch(clearCurrentIngredient());
  }, [dispatch]);

  const handleOrderClose = useCallback(() => {
    dispatch(clearOrder());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      {isLoading ? (
        <div className={styles.status}>
          <Preloader />
        </div>
      ) : error ? (
        <div className={styles.status}>
          <div className={styles.error}>
            <p className='text text_type_main-medium mb-4'>
              Не удалось загрузить ингредиенты
            </p>
            <p className='text text_type_main-default text_color_inactive'>{error}</p>
          </div>
        </div>
      ) : (
        <main className={styles.main}>
          <BurgerIngredients ingredients={ingredients} />
          <BurgerConstructor />
        </main>
      )}
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
    </div>
  );
};

export default App;

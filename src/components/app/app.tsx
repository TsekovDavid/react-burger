import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
import { OrderDetails } from '@components/order-details/order-details';
import { getIngredients } from '@utils/api';

import type { TIngredient } from '@utils/types';

import styles from './app.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect, useMemo, useState } from 'react';

const isIngredient = (ingredient: TIngredient | undefined): ingredient is TIngredient =>
  Boolean(ingredient);

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState<TIngredient | null>(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getIngredients()
      .then((data) => {
        if (isMounted) {
          setIngredients(data);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError('Не удалось загрузить ингредиенты. Попробуйте обновить страниу');
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const burgerConstructor = useMemo(() => {
    const bun = ingredients.find((ingredient) => ingredient.type === 'bun') ?? null;
    const constructorIngredients = ingredients
      .filter((ingredient) => ingredient.type !== 'bun')
      .slice(0, 5)
      .filter(isIngredient);

    return {
      bun,
      ingredients: constructorIngredients,
    };
  }, [ingredients]);

  const ingredientCounts = useMemo(() => {
    const counts: Record<string, number> = {};

    if (burgerConstructor.bun) {
      counts[burgerConstructor.bun._id] = 2;
    }

    burgerConstructor.ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }, [burgerConstructor]);

  const totalPrice = useMemo(() => {
    const bunPrice = burgerConstructor.bun ? burgerConstructor.bun.price * 2 : 0;
    const ingredientsPrice = burgerConstructor.ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [burgerConstructor]);

  const handleIngredientClick = useCallback((ingredient: TIngredient) => {
    setSelectedIngredient(ingredient);
  }, []);

  const handleIngredientClose = useCallback(() => {
    setSelectedIngredient(null);
  }, []);

  const handleOrderOpen = useCallback(() => {
    setIsOrderModalOpen(true);
  }, []);

  const handleOrderClose = useCallback(() => {
    setIsOrderModalOpen(false);
  }, []);

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
          <BurgerIngredients
            ingredients={ingredients}
            ingredientCounts={ingredientCounts}
            onIngredientClick={handleIngredientClick}
          />
          <BurgerConstructor
            bun={burgerConstructor.bun}
            ingredients={burgerConstructor.ingredients}
            totalPrice={totalPrice}
            onOrderClick={handleOrderOpen}
          />
        </main>
      )}
      {selectedIngredient ? (
        <Modal title='Детали ингредиента' onClose={handleIngredientClose}>
          <IngredientDetails ingredient={selectedIngredient} />
        </Modal>
      ) : null}
      {isOrderModalOpen ? (
        <Modal onClose={handleOrderClose}>
          <OrderDetails />
        </Modal>
      ) : null}
    </div>
  );
};

export default App;

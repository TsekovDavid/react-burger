import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { useAppSelector } from '@services/hooks';
import {
  selectIngredients,
  selectIngredientsError,
  selectIngredientsIsLoading,
} from '@services/ingredients/ingredients-slice';

import styles from '../page.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

export const IngredientPage = (): React.JSX.Element => {
  const { id } = useParams();
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const ingredient = ingredients.find((item) => item._id === id);

  if (isLoading) {
    return (
      <main className={styles.centered}>
        <Preloader />
      </main>
    );
  }

  if (error || !ingredient) {
    return (
      <main className={styles.centered}>
        <h1 className='text text_type_main-medium mb-6'>Ингредиент не найден</h1>
        <p className='text text_type_main-default text_color_inactive'>
          {error ?? 'Проверьте адрес страницы'}
        </p>
      </main>
    );
  }

  return (
    <main className={styles.centered}>
      <h1 className='text text_type_main-large'>Детали ингредиента</h1>
      <IngredientDetails ingredient={ingredient} />
    </main>
  );
};

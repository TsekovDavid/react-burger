import { IngredientDetails } from '@components/ingredient-details/ingredient-details';
import { Modal } from '@components/modal/modal';
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

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const IngredientModal = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const selectedIngredient = useAppSelector(selectCurrentIngredient);
  const ingredients = useAppSelector(selectIngredients);
  const isLoading = useAppSelector(selectIngredientsIsLoading);
  const error = useAppSelector(selectIngredientsError);
  const ingredient =
    selectedIngredient?._id === id
      ? selectedIngredient
      : ingredients.find((item) => item._id === id);

  const handleClose = useCallback(() => {
    dispatch(clearCurrentIngredient());
    void navigate(-1);
  }, [dispatch, navigate]);

  return (
    <Modal title='Детали ингредиента' onClose={handleClose}>
      {isLoading ? (
        <Preloader />
      ) : error || !ingredient ? (
        <p className='text text_type_main-default text_color_inactive'>
          {error ?? 'Ингредиент не найден'}
        </p>
      ) : (
        <IngredientDetails ingredient={ingredient} />
      )}
    </Modal>
  );
};

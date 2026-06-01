import { fetchIngredients } from './ingredients-actions';

import type { RootState } from '@services/store';
import type { TIngredient } from '@utils/types';

import { createSlice } from '@reduxjs/toolkit';

type TIngredientsState = {
  items: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
  items: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.items,
    selectIngredientsError: (state) => state.error,
    selectIngredientsIsLoading: (state) => state.isLoading,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.items = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось загрузить ингредиенты';
      });
  },
});

export const { selectIngredients, selectIngredientsError, selectIngredientsIsLoading } =
  ingredientsSlice.selectors;

export const selectIngredientsState = (state: RootState): TIngredientsState =>
  state.ingredients;

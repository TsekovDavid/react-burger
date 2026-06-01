import type { TIngredient } from '@utils/types';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type TCurrentIngredientState = {
  ingredient: TIngredient | null;
};

const initialState: TCurrentIngredientState = {
  ingredient: null,
};

export const currentIngredientSlice = createSlice({
  name: 'currentIngredient',
  initialState,
  reducers: {
    setCurrentIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.ingredient = action.payload;
    },
    clearCurrentIngredient: (state) => {
      state.ingredient = null;
    },
  },
  selectors: {
    selectCurrentIngredient: (state) => state.ingredient,
  },
});

export const { clearCurrentIngredient, setCurrentIngredient } =
  currentIngredientSlice.actions;
export const { selectCurrentIngredient } = currentIngredientSlice.selectors;

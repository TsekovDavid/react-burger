import type { RootState } from '@services/store';
import type { TConstructorIngredient, TIngredient } from '@utils/types';

import {
  createSelector,
  createSlice,
  nanoid,
  type PayloadAction,
} from '@reduxjs/toolkit';

type TBurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TBurgerConstructorState = {
  bun: null,
  ingredients: [],
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }

        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          constructorId: nanoid(),
        },
      }),
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ingredient) => ingredient.constructorId !== action.payload
      );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const [draggedIngredient] = state.ingredients.splice(dragIndex, 1);

      if (draggedIngredient) {
        state.ingredients.splice(hoverIndex, 0, draggedIngredient);
      }
    },
  },
});

const selectBurgerConstructorState = (state: RootState): TBurgerConstructorState =>
  state.burgerConstructor;

export const selectBurgerConstructor = createSelector(
  selectBurgerConstructorState,
  (state) => state
);

export const selectBurgerConstructorBun = createSelector(
  selectBurgerConstructorState,
  (state) => state.bun
);

export const selectBurgerConstructorIngredients = createSelector(
  selectBurgerConstructorState,
  (state) => state.ingredients
);

export const selectIngredientCounts = createSelector(
  selectBurgerConstructorState,
  ({ bun, ingredients }) => {
    const counts: Record<string, number> = {};

    if (bun) {
      counts[bun._id] = 2;
    }

    ingredients.forEach((ingredient) => {
      counts[ingredient._id] = (counts[ingredient._id] ?? 0) + 1;
    });

    return counts;
  }
);

export const selectTotalPrice = createSelector(
  selectBurgerConstructorState,
  ({ bun, ingredients }) => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce(
      (sum, ingredient) => sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }
);

export const selectOrderIngredientIds = createSelector(
  selectBurgerConstructorState,
  ({ bun, ingredients }) => {
    if (!bun) {
      return [];
    }

    return [bun._id, ...ingredients.map((ingredient) => ingredient._id), bun._id];
  }
);

export const { addIngredient, moveIngredient, removeIngredient } =
  burgerConstructorSlice.actions;

import { bunIngredient } from '@services/test-fixtures';

import {
  clearCurrentIngredient,
  currentIngredientSlice,
  setCurrentIngredient,
} from './current-ingredient-slice';

describe('currentIngredientSlice', () => {
  const reducer = currentIngredientSlice.reducer;

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({ ingredient: null });
  });

  it('sets the current ingredient', () => {
    expect(reducer(undefined, setCurrentIngredient(bunIngredient))).toEqual({
      ingredient: bunIngredient,
    });
  });

  it('clears the current ingredient', () => {
    expect(reducer({ ingredient: bunIngredient }, clearCurrentIngredient())).toEqual({
      ingredient: null,
    });
  });
});

import { bunIngredient } from '@services/test-fixtures';

import { fetchIngredients } from './ingredients-actions';
import { ingredientsSlice } from './ingredients-slice';

describe('ingredientsSlice', () => {
  const reducer = ingredientsSlice.reducer;

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      items: [],
      isLoading: false,
      error: null,
    });
  });

  it('handles a pending request', () => {
    const state = reducer(undefined, fetchIngredients.pending('request-id', undefined));

    expect(state).toEqual({ items: [], isLoading: true, error: null });
  });

  it('handles a fulfilled request', () => {
    const state = reducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.fulfilled([bunIngredient], 'request-id', undefined)
    );

    expect(state).toEqual({
      items: [bunIngredient],
      isLoading: false,
      error: null,
    });
  });

  it('handles a rejected request', () => {
    const state = reducer(
      { items: [], isLoading: true, error: null },
      fetchIngredients.rejected(
        new Error('Network error'),
        'request-id',
        undefined,
        'Не удалось загрузить ингредиенты'
      )
    );

    expect(state).toEqual({
      items: [],
      isLoading: false,
      error: 'Не удалось загрузить ингредиенты',
    });
  });
});

import {
  bunIngredient,
  constructorMain,
  constructorSauce,
  sauceIngredient,
} from '@services/test-fixtures';

import {
  addIngredient,
  burgerConstructorSlice,
  clearBurgerConstructor,
  moveIngredient,
  removeIngredient,
} from './burger-constructor-slice';

describe('burgerConstructorSlice', () => {
  const reducer = burgerConstructorSlice.reducer;

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      bun: null,
      ingredients: [],
    });
  });

  it('adds a bun and generates a constructor id', () => {
    const action = addIngredient(bunIngredient);
    const state = reducer(undefined, action);

    expect(state.bun).toEqual(action.payload);
    expect(action.payload.constructorId).toEqual(expect.any(String));
    expect(state.ingredients).toEqual([]);
  });

  it('adds a non-bun ingredient', () => {
    const action = addIngredient(sauceIngredient);
    const state = reducer(undefined, action);

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([action.payload]);
  });

  it('removes an ingredient by constructor id', () => {
    const state = reducer(
      { bun: null, ingredients: [constructorSauce, constructorMain] },
      removeIngredient(constructorSauce.constructorId)
    );

    expect(state.ingredients).toEqual([constructorMain]);
  });

  it('moves an ingredient to another position', () => {
    const state = reducer(
      { bun: null, ingredients: [constructorSauce, constructorMain] },
      moveIngredient({ dragIndex: 0, hoverIndex: 1 })
    );

    expect(state.ingredients).toEqual([constructorMain, constructorSauce]);
  });

  it('keeps the list unchanged when the drag index is invalid', () => {
    const state = reducer(
      { bun: null, ingredients: [constructorSauce] },
      moveIngredient({ dragIndex: 5, hoverIndex: 0 })
    );

    expect(state.ingredients).toEqual([constructorSauce]);
  });

  it('clears the constructor', () => {
    const state = reducer(
      { bun: bunIngredient, ingredients: [constructorSauce] },
      clearBurgerConstructor()
    );

    expect(state).toEqual({ bun: null, ingredients: [] });
  });
});

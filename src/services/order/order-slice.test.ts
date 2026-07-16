import { sendOrder } from './order-actions';
import { clearOrder, orderSlice } from './order-slice';

describe('orderSlice', () => {
  const reducer = orderSlice.reducer;
  const orderResponse = {
    success: true,
    name: 'Тестовый бургер',
    order: { number: 42 },
  };

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      number: null,
      isLoading: false,
      error: null,
    });
  });

  it('clears order data', () => {
    expect(
      reducer({ number: 42, isLoading: false, error: 'Ошибка' }, clearOrder())
    ).toEqual({ number: null, isLoading: false, error: null });
  });

  it('handles a pending order request', () => {
    const state = reducer(
      { number: 10, isLoading: false, error: 'Ошибка' },
      sendOrder.pending('request-id', ['bun-id'])
    );

    expect(state).toEqual({ number: null, isLoading: true, error: null });
  });

  it('handles a fulfilled order request', () => {
    const state = reducer(
      { number: null, isLoading: true, error: null },
      sendOrder.fulfilled(orderResponse, 'request-id', ['bun-id'])
    );

    expect(state).toEqual({ number: 42, isLoading: false, error: null });
  });

  it('handles a rejected order request', () => {
    const state = reducer(
      { number: null, isLoading: true, error: null },
      sendOrder.rejected(
        new Error('Network error'),
        'request-id',
        ['bun-id'],
        'Не удалось оформить заказ'
      )
    );

    expect(state).toEqual({
      number: null,
      isLoading: false,
      error: 'Не удалось оформить заказ',
    });
  });
});

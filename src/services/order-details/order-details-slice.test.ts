import { testOrder } from '@services/test-fixtures';

import { fetchOrderDetails } from './order-details-actions';
import { orderDetailsSlice } from './order-details-slice';

describe('orderDetailsSlice', () => {
  const reducer = orderDetailsSlice.reducer;

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      order: null,
      requestedId: null,
      isLoading: false,
      error: null,
    });
  });

  it('handles a pending request', () => {
    const state = reducer(
      undefined,
      fetchOrderDetails.pending('request-id', testOrder._id)
    );

    expect(state).toEqual({
      order: null,
      requestedId: testOrder._id,
      isLoading: true,
      error: null,
    });
  });

  it('handles a fulfilled request', () => {
    const state = reducer(
      {
        order: null,
        requestedId: testOrder._id,
        isLoading: true,
        error: null,
      },
      fetchOrderDetails.fulfilled(testOrder, 'request-id', testOrder._id)
    );

    expect(state).toEqual({
      order: testOrder,
      requestedId: testOrder._id,
      isLoading: false,
      error: null,
    });
  });

  it('handles a rejected request', () => {
    const state = reducer(
      {
        order: null,
        requestedId: testOrder._id,
        isLoading: true,
        error: null,
      },
      fetchOrderDetails.rejected(
        new Error('Network error'),
        'request-id',
        testOrder._id,
        'Заказ не найден'
      )
    );

    expect(state).toEqual({
      order: null,
      requestedId: testOrder._id,
      isLoading: false,
      error: 'Заказ не найден',
    });
  });
});

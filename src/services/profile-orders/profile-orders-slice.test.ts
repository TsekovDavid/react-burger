import { testOrdersResponse } from '@services/test-fixtures';

import {
  connectProfileOrders,
  profileOrdersSlice,
  profileOrdersWsMessage,
} from './profile-orders-slice';

describe('profileOrdersSlice', () => {
  it('returns the initial profile orders state', () => {
    expect(profileOrdersSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      hasReceivedData: false,
      url: null,
      connectionStatus: 'idle',
      error: null,
    });
  });

  it('uses the profile orders action aliases', () => {
    const connectedState = profileOrdersSlice.reducer(
      undefined,
      connectProfileOrders('wss://example.test/orders?token=test')
    );
    const state = profileOrdersSlice.reducer(
      connectedState,
      profileOrdersWsMessage(testOrdersResponse)
    );

    expect(state.url).toBe('wss://example.test/orders?token=test');
    expect(state.orders).toEqual(testOrdersResponse.orders);
  });
});

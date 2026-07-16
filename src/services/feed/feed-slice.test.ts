import { testOrdersResponse } from '@services/test-fixtures';

import { connectFeed, feedSlice, feedWsMessage } from './feed-slice';

describe('feedSlice', () => {
  it('returns the initial public feed state', () => {
    expect(feedSlice.reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      hasReceivedData: false,
      url: null,
      connectionStatus: 'idle',
      error: null,
    });
  });

  it('uses the public feed action aliases', () => {
    const connectedState = feedSlice.reducer(
      undefined,
      connectFeed('wss://example.test/orders/all')
    );
    const state = feedSlice.reducer(connectedState, feedWsMessage(testOrdersResponse));

    expect(state.url).toBe('wss://example.test/orders/all');
    expect(state.orders).toEqual(testOrdersResponse.orders);
  });
});

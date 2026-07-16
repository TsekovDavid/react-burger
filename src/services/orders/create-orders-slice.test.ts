import { testOrdersResponse } from '@services/test-fixtures';

import { createOrdersSlice } from './create-orders-slice';

describe('createOrdersSlice', () => {
  const ordersSlice = createOrdersSlice('testOrders');
  const reducer = ordersSlice.reducer;
  const actions = ordersSlice.actions;
  const connectedState = {
    orders: [],
    total: 0,
    totalToday: 0,
    hasReceivedData: false,
    url: 'wss://example.test/orders',
    connectionStatus: 'connected' as const,
    error: null,
  };

  it('returns the initial state', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual({
      orders: [],
      total: 0,
      totalToday: 0,
      hasReceivedData: false,
      url: null,
      connectionStatus: 'idle',
      error: null,
    });
  });

  it('stores the URL when connecting', () => {
    const state = reducer(undefined, actions.connect('wss://example.test/orders'));

    expect(state.url).toBe('wss://example.test/orders');
    expect(state.hasReceivedData).toBe(false);
    expect(state.error).toBeNull();
  });

  it('resets connection data when disconnecting', () => {
    const state = reducer(connectedState, actions.disconnect());

    expect(state.connectionStatus).toBe('idle');
    expect(state.url).toBeNull();
  });

  it('handles the connecting state', () => {
    const state = reducer(
      { ...connectedState, connectionStatus: 'idle', error: 'Ошибка' },
      actions.wsConnecting()
    );

    expect(state.connectionStatus).toBe('connecting');
    expect(state.error).toBeNull();
  });

  it('handles an opened connection', () => {
    const state = reducer(
      { ...connectedState, connectionStatus: 'connecting', error: 'Ошибка' },
      actions.wsOpen()
    );

    expect(state.connectionStatus).toBe('connected');
    expect(state.error).toBeNull();
  });

  it('handles a closed connection', () => {
    const state = reducer(connectedState, actions.wsClose());

    expect(state.connectionStatus).toBe('disconnected');
  });

  it('stores a connection error', () => {
    const state = reducer(connectedState, actions.wsError('Ошибка соединения'));

    expect(state.error).toBe('Ошибка соединения');
  });

  it('replaces orders with the latest WebSocket message', () => {
    const state = reducer(
      { ...connectedState, error: 'Старая ошибка' },
      actions.wsMessage(testOrdersResponse)
    );

    expect(state.orders).toEqual(testOrdersResponse.orders);
    expect(state.total).toBe(testOrdersResponse.total);
    expect(state.totalToday).toBe(testOrdersResponse.totalToday);
    expect(state.hasReceivedData).toBe(true);
    expect(state.error).toBeNull();
  });
});

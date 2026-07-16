import type { TOrder, TOrdersResponse } from '@utils/types';

import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type TOrdersConnectionStatus =
  | 'idle'
  | 'connecting'
  | 'connected'
  | 'disconnected';

export type TOrdersState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  hasReceivedData: boolean;
  url: string | null;
  connectionStatus: TOrdersConnectionStatus;
  error: string | null;
};

const getInitialState = (): TOrdersState => ({
  orders: [],
  total: 0,
  totalToday: 0,
  hasReceivedData: false,
  url: null,
  connectionStatus: 'idle',
  error: null,
});

export const createOrdersSlice = (name: string) =>
  createSlice({
    name,
    initialState: getInitialState(),
    reducers: {
      connect: (state, action: PayloadAction<string>) => {
        state.error = null;
        state.hasReceivedData = false;
        state.url = action.payload;
      },
      disconnect: (state) => {
        state.connectionStatus = 'idle';
        state.url = null;
      },
      wsConnecting: (state) => {
        state.connectionStatus = 'connecting';
        state.error = null;
      },
      wsOpen: (state) => {
        state.connectionStatus = 'connected';
        state.error = null;
      },
      wsClose: (state) => {
        state.connectionStatus = 'disconnected';
      },
      wsError: (state, action: PayloadAction<string>) => {
        state.error = action.payload;
      },
      wsMessage: (state, action: PayloadAction<TOrdersResponse>) => {
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
        state.hasReceivedData = true;
        state.error = null;
      },
    },
    selectors: {
      selectOrders: (state) => state.orders,
      selectTotal: (state) => state.total,
      selectTotalToday: (state) => state.totalToday,
      selectHasReceivedData: (state) => state.hasReceivedData,
      selectConnectionStatus: (state) => state.connectionStatus,
      selectError: (state) => state.error,
    },
  });

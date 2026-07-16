import { createOrdersSlice } from '@services/orders/create-orders-slice';

export const feedSlice = createOrdersSlice('feed');

export const {
  connect: connectFeed,
  disconnect: disconnectFeed,
  wsClose: feedWsClose,
  wsConnecting: feedWsConnecting,
  wsError: feedWsError,
  wsMessage: feedWsMessage,
  wsOpen: feedWsOpen,
} = feedSlice.actions;

export const {
  selectConnectionStatus: selectFeedConnectionStatus,
  selectError: selectFeedError,
  selectHasReceivedData: selectFeedHasReceivedData,
  selectOrders: selectFeedOrders,
  selectTotal: selectFeedTotal,
  selectTotalToday: selectFeedTotalToday,
} = feedSlice.selectors;

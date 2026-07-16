import { createOrdersSlice } from '@services/orders/create-orders-slice';

export const profileOrdersSlice = createOrdersSlice('profileOrders');

export const {
  connect: connectProfileOrders,
  disconnect: disconnectProfileOrders,
  wsClose: profileOrdersWsClose,
  wsConnecting: profileOrdersWsConnecting,
  wsError: profileOrdersWsError,
  wsMessage: profileOrdersWsMessage,
  wsOpen: profileOrdersWsOpen,
} = profileOrdersSlice.actions;

export const {
  selectConnectionStatus: selectProfileOrdersConnectionStatus,
  selectError: selectProfileOrdersError,
  selectHasReceivedData: selectProfileOrdersHasReceivedData,
  selectOrders: selectProfileOrders,
} = profileOrdersSlice.selectors;

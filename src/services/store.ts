import { isTokenErrorResponse, parseOrdersResponse } from '@utils/orders';

import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { currentIngredientSlice } from './current-ingredient/current-ingredient-slice';
import {
  connectFeed,
  disconnectFeed,
  feedSlice,
  feedWsClose,
  feedWsConnecting,
  feedWsError,
  feedWsMessage,
  feedWsOpen,
} from './feed/feed-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { orderDetailsSlice } from './order-details/order-details-slice';
import { orderSlice } from './order/order-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  profileOrdersSlice,
  profileOrdersWsClose,
  profileOrdersWsConnecting,
  profileOrdersWsError,
  profileOrdersWsMessage,
  profileOrdersWsOpen,
} from './profile-orders/profile-orders-slice';
import { refreshProfileOrdersUrl } from './profile-orders/profile-orders-websocket';
import { userSlice } from './user/user-slice';
import { createWebSocketMiddleware } from './websocket/websocket-middleware';

import { combineSlices, configureStore } from '@reduxjs/toolkit';

const feedWebSocketMiddleware = createWebSocketMiddleware({
  actions: {
    connect: connectFeed,
    disconnect: disconnectFeed,
    connecting: feedWsConnecting,
    open: feedWsOpen,
    close: feedWsClose,
    error: feedWsError,
    message: feedWsMessage,
  },
  parseMessage: parseOrdersResponse,
});

const profileOrdersWebSocketMiddleware = createWebSocketMiddleware({
  actions: {
    connect: connectProfileOrders,
    disconnect: disconnectProfileOrders,
    connecting: profileOrdersWsConnecting,
    open: profileOrdersWsOpen,
    close: profileOrdersWsClose,
    error: profileOrdersWsError,
    message: profileOrdersWsMessage,
  },
  parseMessage: parseOrdersResponse,
  auth: {
    isAuthError: isTokenErrorResponse,
    refreshUrl: refreshProfileOrdersUrl,
  },
});

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  currentIngredientSlice,
  orderSlice,
  orderDetailsSlice,
  feedSlice,
  profileOrdersSlice,
  userSlice
);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      feedWebSocketMiddleware,
      profileOrdersWebSocketMiddleware
    ),
  devTools: import.meta.env.DEV,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

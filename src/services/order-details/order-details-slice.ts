import { fetchOrderDetails } from './order-details-actions';

import type { TOrder } from '@utils/types';

import { createSlice } from '@reduxjs/toolkit';

type TOrderDetailsState = {
  order: TOrder | null;
  requestedId: string | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderDetailsState = {
  order: null,
  requestedId: null,
  isLoading: false,
  error: null,
};

export const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  selectors: {
    selectOrderDetails: (state) => state.order,
    selectOrderDetailsRequestedId: (state) => state.requestedId,
    selectOrderDetailsIsLoading: (state) => state.isLoading,
    selectOrderDetailsError: (state) => state.error,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state, action) => {
        state.requestedId = action.meta.arg;
        state.order = null;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.order = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          typeof action.payload === 'string'
            ? action.payload
            : 'Не удалось загрузить заказ';
      });
  },
});

export const {
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsIsLoading,
  selectOrderDetailsRequestedId,
} = orderDetailsSlice.selectors;

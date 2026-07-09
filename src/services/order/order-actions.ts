import { createOrder } from '@utils/api';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const sendOrder = createAsyncThunk(
  'order/sendOrder',
  async (ingredientIds: string[], { rejectWithValue }) => {
    try {
      return await createOrder(ingredientIds);
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось оформить заказ'
      );
    }
  }
);

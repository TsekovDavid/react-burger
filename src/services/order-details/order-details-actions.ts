import { getOrderById } from '@utils/api';
import { isOrder } from '@utils/orders';

import { createAsyncThunk } from '@reduxjs/toolkit';

export const fetchOrderDetails = createAsyncThunk(
  'orderDetails/fetch',
  async (orderId: string, { rejectWithValue }) => {
    try {
      const response = await getOrderById(orderId);
      const order = response.orders.find(isOrder);

      if (!order) {
        return rejectWithValue('Заказ не найден');
      }

      return order;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Не удалось загрузить заказ'
      );
    }
  }
);

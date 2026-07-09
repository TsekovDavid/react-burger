import { INGREDIENTS_ENDPOINT, ORDERS_ENDPOINT } from './constants';

import type { TIngredient, TIngredientsResponse, TOrderResponse } from '@utils/types';

const checkResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json() as Promise<T>;
};

export const getIngredients = async (): Promise<TIngredient[]> => {
  const response = await fetch(INGREDIENTS_ENDPOINT);
  const data = await checkResponse<TIngredientsResponse>(response);

  if (!data.success) {
    throw new Error('Failed to load ingredients');
  }

  return data.data;
};

export const createOrder = async (ingredients: string[]): Promise<TOrderResponse> => {
  const response = await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ingredients }),
  });
  const data = await checkResponse<TOrderResponse>(response);

  if (!data.success) {
    throw new Error('Failed to create order');
  }

  return data;
};

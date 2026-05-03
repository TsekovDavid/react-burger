import { INGREDIENTS_ENDPOINT } from './constants';

import type { TIngredient, TIngredientsResponse } from '@utils/types';

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

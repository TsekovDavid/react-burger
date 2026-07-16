import type { TIngredient, TOrder, TOrderStatus, TOrdersResponse } from './types';

const orderStatuses: TOrderStatus[] = ['created', 'pending', 'done'];

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isOrderStatus = (value: unknown): value is TOrderStatus =>
  typeof value === 'string' && orderStatuses.includes(value as TOrderStatus);

export const isOrder = (value: unknown): value is TOrder => {
  if (!isRecord(value)) {
    return false;
  }

  return (
    Array.isArray(value.ingredients) &&
    value.ingredients.length > 0 &&
    value.ingredients.every((ingredientId) => typeof ingredientId === 'string') &&
    typeof value._id === 'string' &&
    value._id.length > 0 &&
    isOrderStatus(value.status) &&
    typeof value.name === 'string' &&
    typeof value.number === 'number' &&
    Number.isFinite(value.number) &&
    typeof value.createdAt === 'string' &&
    !Number.isNaN(Date.parse(value.createdAt)) &&
    typeof value.updatedAt === 'string' &&
    !Number.isNaN(Date.parse(value.updatedAt))
  );
};

export const parseOrdersResponse = (value: unknown): TOrdersResponse | null => {
  if (
    !isRecord(value) ||
    value.success !== true ||
    !Array.isArray(value.orders) ||
    typeof value.total !== 'number' ||
    typeof value.totalToday !== 'number'
  ) {
    return null;
  }

  return {
    success: true,
    orders: value.orders.filter(isOrder),
    total: value.total,
    totalToday: value.totalToday,
  };
};

export const isTokenErrorResponse = (value: unknown): boolean =>
  isRecord(value) && value.message === 'Invalid or missing token';

export type TOrderIngredient = {
  ingredient: TIngredient;
  count: number;
};

export const getOrderIngredients = (
  order: TOrder,
  ingredients: TIngredient[]
): TIngredient[] => {
  const ingredientsById = new Map(
    ingredients.map((ingredient) => [ingredient._id, ingredient])
  );

  return order.ingredients.flatMap((ingredientId) => {
    const ingredient = ingredientsById.get(ingredientId);

    return ingredient ? [ingredient] : [];
  });
};

export const getOrderIngredientDetails = (
  order: TOrder,
  ingredients: TIngredient[]
): TOrderIngredient[] => {
  const orderIngredients = getOrderIngredients(order, ingredients);
  const ingredientDetails = new Map<string, TOrderIngredient>();

  orderIngredients.forEach((ingredient) => {
    const currentIngredient = ingredientDetails.get(ingredient._id);

    if (currentIngredient) {
      currentIngredient.count += 1;
    } else {
      ingredientDetails.set(ingredient._id, { ingredient, count: 1 });
    }
  });

  return Array.from(ingredientDetails.values());
};

export const getOrderTotal = (order: TOrder, ingredients: TIngredient[]): number =>
  getOrderIngredients(order, ingredients).reduce(
    (total, ingredient) => total + ingredient.price,
    0
  );

export const getOrderStatusLabel = (status: TOrderStatus): string => {
  const statusLabels: Record<TOrderStatus, string> = {
    created: 'Создан',
    pending: 'Готовится',
    done: 'Выполнен',
  };

  return statusLabels[status];
};

import type {
  TConstructorIngredient,
  TIngredient,
  TOrder,
  TOrdersResponse,
  TUser,
} from '@utils/types';

export const bunIngredient: TIngredient = {
  _id: 'bun-id',
  name: 'Тестовая булка',
  type: 'bun',
  proteins: 10,
  fat: 5,
  carbohydrates: 20,
  calories: 200,
  price: 100,
  image: 'bun.png',
  image_large: 'bun-large.png',
  image_mobile: 'bun-mobile.png',
  __v: 0,
};

export const sauceIngredient: TIngredient = {
  _id: 'sauce-id',
  name: 'Тестовый соус',
  type: 'sauce',
  proteins: 1,
  fat: 2,
  carbohydrates: 3,
  calories: 40,
  price: 25,
  image: 'sauce.png',
  image_large: 'sauce-large.png',
  image_mobile: 'sauce-mobile.png',
  __v: 0,
};

export const mainIngredient: TIngredient = {
  _id: 'main-id',
  name: 'Тестовая начинка',
  type: 'main',
  proteins: 30,
  fat: 15,
  carbohydrates: 10,
  calories: 300,
  price: 75,
  image: 'main.png',
  image_large: 'main-large.png',
  image_mobile: 'main-mobile.png',
  __v: 0,
};

export const constructorSauce: TConstructorIngredient = {
  ...sauceIngredient,
  constructorId: 'constructor-sauce',
};

export const constructorMain: TConstructorIngredient = {
  ...mainIngredient,
  constructorId: 'constructor-main',
};

export const testOrder: TOrder = {
  ingredients: [bunIngredient._id, sauceIngredient._id, bunIngredient._id],
  _id: 'order-id',
  status: 'done',
  name: 'Тестовый бургер',
  number: 42,
  createdAt: '2026-01-01T10:00:00.000Z',
  updatedAt: '2026-01-01T10:01:00.000Z',
};

export const testOrdersResponse: TOrdersResponse = {
  success: true,
  orders: [testOrder],
  total: 100,
  totalToday: 10,
};

export const testUser: TUser = {
  name: 'Test User',
  email: 'test@example.com',
};

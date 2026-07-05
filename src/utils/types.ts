export type TIngredientType = 'bun' | 'main' | 'sauce';

export type TIngredient = {
  _id: string;
  name: string;
  type: TIngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TConstructorIngredient = TIngredient & {
  constructorId: string;
};

export type TIngredientsResponse = {
  success: boolean;
  data: TIngredient[];
};

export type TOrderResponse = {
  success: boolean;
  name: string;
  order: {
    number: number;
  };
};

export type TUser = {
  email: string;
  name: string;
};

export type TAuthCredentials = {
  email: string;
  password: string;
};

export type TRegisterData = TAuthCredentials & {
  name: string;
};

export type TUpdateUserData = TRegisterData;

export type TAuthResponse = {
  success: boolean;
  user: TUser;
  accessToken: string;
  refreshToken: string;
};

export type TTokenResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TUserResponse = {
  success: boolean;
  user: TUser;
};

export type TMessageResponse = {
  success: boolean;
  message: string;
};

export type TResetPasswordData = {
  password: string;
  token: string;
};

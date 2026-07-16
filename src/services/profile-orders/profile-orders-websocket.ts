import { refreshTokens } from '@utils/api';
import { USER_ORDERS_WS_ENDPOINT } from '@utils/constants';
import { getAccessTokenValue } from '@utils/token-storage';

const getProfileOrdersUrl = (accessToken: string): string =>
  `${USER_ORDERS_WS_ENDPOINT}?token=${encodeURIComponent(accessToken)}`;

export const getCurrentProfileOrdersUrl = (): string => {
  const accessToken = getAccessTokenValue();

  if (!accessToken) {
    throw new Error('Access token is missing');
  }

  return getProfileOrdersUrl(accessToken);
};

export const refreshProfileOrdersUrl = async (): Promise<string> => {
  const { accessToken } = await refreshTokens();
  const tokenValue = accessToken.replace(/^Bearer\s+/i, '');

  return getProfileOrdersUrl(tokenValue);
};

import {
  selectFeedError,
  selectFeedHasReceivedData,
  selectFeedOrders,
} from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { fetchOrderDetails } from '@services/order-details/order-details-actions';
import {
  selectOrderDetails,
  selectOrderDetailsError,
  selectOrderDetailsIsLoading,
  selectOrderDetailsRequestedId,
} from '@services/order-details/order-details-slice';
import {
  selectProfileOrders,
  selectProfileOrdersError,
  selectProfileOrdersHasReceivedData,
} from '@services/profile-orders/profile-orders-slice';

import type { TOrder } from '@utils/types';

import { useEffect } from 'react';

export type TOrderSource = 'feed' | 'profile';

type TUseOrderDetailsResult = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const useOrderDetails = (
  orderId: string | undefined,
  source: TOrderSource
): TUseOrderDetailsResult => {
  const dispatch = useAppDispatch();
  const feedOrders = useAppSelector(selectFeedOrders);
  const feedHasReceivedData = useAppSelector(selectFeedHasReceivedData);
  const feedError = useAppSelector(selectFeedError);
  const profileOrders = useAppSelector(selectProfileOrders);
  const profileHasReceivedData = useAppSelector(selectProfileOrdersHasReceivedData);
  const profileError = useAppSelector(selectProfileOrdersError);
  const fallbackOrder = useAppSelector(selectOrderDetails);
  const fallbackRequestedId = useAppSelector(selectOrderDetailsRequestedId);
  const isFallbackLoading = useAppSelector(selectOrderDetailsIsLoading);
  const fallbackError = useAppSelector(selectOrderDetailsError);
  const sourceOrders = source === 'feed' ? feedOrders : profileOrders;
  const hasReceivedData =
    source === 'feed' ? feedHasReceivedData : profileHasReceivedData;
  const sourceError = source === 'feed' ? feedError : profileError;
  const socketOrder = sourceOrders.find((order) => order._id === orderId) ?? null;
  const requestedFallbackOrder = fallbackOrder?._id === orderId ? fallbackOrder : null;
  const canRequestFallback = hasReceivedData || Boolean(sourceError);
  const isCurrentFallbackRequest = fallbackRequestedId === orderId;

  useEffect(() => {
    if (
      orderId &&
      !socketOrder &&
      !requestedFallbackOrder &&
      !isCurrentFallbackRequest &&
      canRequestFallback
    ) {
      void dispatch(fetchOrderDetails(orderId));
    }
  }, [
    canRequestFallback,
    dispatch,
    isCurrentFallbackRequest,
    orderId,
    requestedFallbackOrder,
    socketOrder,
  ]);

  return {
    order: socketOrder ?? requestedFallbackOrder,
    isLoading:
      !socketOrder &&
      !requestedFallbackOrder &&
      (!canRequestFallback || !isCurrentFallbackRequest || isFallbackLoading),
    error:
      !socketOrder && !requestedFallbackOrder && isCurrentFallbackRequest
        ? fallbackError
        : null,
  };
};

import { OrderDetailsContent } from '@components/order-details-content/order-details-content';
import { connectFeed, disconnectFeed } from '@services/feed/feed-slice';
import { useAppDispatch } from '@services/hooks';
import {
  connectProfileOrders,
  disconnectProfileOrders,
} from '@services/profile-orders/profile-orders-slice';
import { getCurrentProfileOrdersUrl } from '@services/profile-orders/profile-orders-websocket';
import { ALL_ORDERS_WS_ENDPOINT } from '@utils/constants';

import type { TOrderSource } from '@hooks/use-order-details';

import styles from './order.module.css';

import { useEffect } from 'react';

type TOrderPageProps = {
  source: TOrderSource;
};

export const OrderPage = ({ source }: TOrderPageProps): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (source === 'feed') {
      dispatch(connectFeed(ALL_ORDERS_WS_ENDPOINT));

      return () => {
        dispatch(disconnectFeed());
      };
    }

    dispatch(connectProfileOrders(getCurrentProfileOrdersUrl()));

    return () => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch, source]);

  return (
    <main className={styles.page}>
      <OrderDetailsContent source={source} centeredNumber />
    </main>
  );
};

import { OrderList } from '@components/order-list/order-list';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import {
  connectProfileOrders,
  disconnectProfileOrders,
  selectProfileOrders,
  selectProfileOrdersConnectionStatus,
  selectProfileOrdersError,
  selectProfileOrdersHasReceivedData,
} from '@services/profile-orders/profile-orders-slice';
import { getCurrentProfileOrdersUrl } from '@services/profile-orders/profile-orders-websocket';
import { getOrderIngredients } from '@utils/orders';

import styles from './profile-orders.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

export const ProfileOrdersPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const orders = useAppSelector(selectProfileOrders);
  const connectionStatus = useAppSelector(selectProfileOrdersConnectionStatus);
  const hasReceivedData = useAppSelector(selectProfileOrdersHasReceivedData);
  const error = useAppSelector(selectProfileOrdersError);
  const ingredients = useAppSelector(selectIngredients);
  const visibleOrders = useMemo(
    () => orders.filter((order) => getOrderIngredients(order, ingredients).length > 0),
    [ingredients, orders]
  );

  useEffect(() => {
    dispatch(connectProfileOrders(getCurrentProfileOrdersUrl()));

    return () => {
      dispatch(disconnectProfileOrders());
    };
  }, [dispatch]);

  if (!hasReceivedData && connectionStatus === 'connecting') {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (error && !hasReceivedData) {
    return (
      <div className={styles.status}>
        <p className='text text_type_main-medium'>Не удалось загрузить историю</p>
        <p className='text text_type_main-default text_color_inactive mt-4'>{error}</p>
      </div>
    );
  }

  if (visibleOrders.length === 0) {
    return (
      <div className={styles.status}>
        <p className='text text_type_main-medium'>У вас пока нет заказов</p>
      </div>
    );
  }

  return (
    <OrderList
      orders={visibleOrders}
      routePrefix='/profile/orders'
      background={location}
      showStatus
    />
  );
};

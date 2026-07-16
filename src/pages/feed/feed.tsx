import { OrderList } from '@components/order-list/order-list';
import {
  connectFeed,
  disconnectFeed,
  selectFeedConnectionStatus,
  selectFeedError,
  selectFeedHasReceivedData,
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday,
} from '@services/feed/feed-slice';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { selectIngredients } from '@services/ingredients/ingredients-slice';
import { ALL_ORDERS_WS_ENDPOINT } from '@utils/constants';
import { getOrderIngredients } from '@utils/orders';

import type { TOrder } from '@utils/types';

import styles from './feed.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const getNumberColumns = (orders: TOrder[]): number[][] => {
  const visibleNumbers = orders.slice(0, 20).map((order) => order.number);

  return [visibleNumbers.slice(0, 10), visibleNumbers.slice(10, 20)].filter(
    (column) => column.length > 0
  );
};

type TStatusColumnsProps = {
  title: string;
  orders: TOrder[];
  completed?: boolean;
};

const StatusColumns = ({
  title,
  orders,
  completed = false,
}: TStatusColumnsProps): React.JSX.Element => {
  const columns = getNumberColumns(orders);

  return (
    <section>
      <h2 className='text text_type_main-medium mb-6'>{title}</h2>
      <div className={styles['status-columns']}>
        {columns.map((column, columnIndex) => (
          <ul className={styles['status-list']} key={`${title}-${columnIndex}`}>
            {column.map((number) => (
              <li
                className={`${completed ? styles.completed : ''} text text_type_digits-default`}
                key={number}
              >
                {number}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </section>
  );
};

export const FeedPage = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const orders = useAppSelector(selectFeedOrders);
  const total = useAppSelector(selectFeedTotal);
  const totalToday = useAppSelector(selectFeedTotalToday);
  const connectionStatus = useAppSelector(selectFeedConnectionStatus);
  const hasReceivedData = useAppSelector(selectFeedHasReceivedData);
  const error = useAppSelector(selectFeedError);
  const ingredients = useAppSelector(selectIngredients);
  const visibleOrders = useMemo(
    () => orders.filter((order) => getOrderIngredients(order, ingredients).length > 0),
    [ingredients, orders]
  );
  const completedOrders = visibleOrders.filter((order) => order.status === 'done');
  const inProgressOrders = visibleOrders.filter((order) => order.status !== 'done');

  useEffect(() => {
    dispatch(connectFeed(ALL_ORDERS_WS_ENDPOINT));

    return () => {
      dispatch(disconnectFeed());
    };
  }, [dispatch]);

  return (
    <main className={styles.page}>
      <h1 className='text text_type_main-large'>Лента заказов</h1>
      {!hasReceivedData && connectionStatus === 'connecting' ? (
        <div className={styles.status}>
          <Preloader />
        </div>
      ) : error && !hasReceivedData ? (
        <div className={styles.status}>
          <p className='text text_type_main-medium'>Не удалось загрузить ленту</p>
          <p className='text text_type_main-default text_color_inactive mt-4'>{error}</p>
        </div>
      ) : (
        <div className={styles.content}>
          <OrderList orders={visibleOrders} routePrefix='/feed' background={location} />
          <div className={styles.summary}>
            <div className={styles['status-grid']}>
              <StatusColumns title='Готовы:' orders={completedOrders} completed />
              <StatusColumns title='В работе:' orders={inProgressOrders} />
            </div>
            <section className={styles.total}>
              <h2 className='text text_type_main-medium'>Выполнено за всё время:</h2>
              <p className={`${styles.digits} text text_type_digits-large`}>{total}</p>
            </section>
            <section className={styles.total}>
              <h2 className='text text_type_main-medium'>Выполнено за сегодня:</h2>
              <p className={`${styles.digits} text text_type_digits-large`}>
                {totalToday}
              </p>
            </section>
          </div>
        </div>
      )}
    </main>
  );
};

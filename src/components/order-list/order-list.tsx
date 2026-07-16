import { OrderCard } from '@components/order-card/order-card';

import type { TOrder } from '@utils/types';
import type { Location } from 'react-router-dom';

import styles from './order-list.module.css';

type TOrderListProps = {
  orders: TOrder[];
  routePrefix: '/feed' | '/profile/orders';
  background: Location;
  showStatus?: boolean;
};

export const OrderList = ({
  orders,
  routePrefix,
  background,
  showStatus = false,
}: TOrderListProps): React.JSX.Element => (
  <ul className={`${styles.list} custom-scroll`}>
    {orders.map((order) => (
      <OrderCard
        key={order._id}
        order={order}
        to={`${routePrefix}/${order._id}`}
        background={background}
        showStatus={showStatus}
      />
    ))}
  </ul>
);

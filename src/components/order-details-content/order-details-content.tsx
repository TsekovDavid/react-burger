import { OrderInfo } from '@components/order-info/order-info';
import { useOrderDetails, type TOrderSource } from '@hooks/use-order-details';

import styles from './order-details-content.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useParams } from 'react-router-dom';

type TOrderDetailsContentProps = {
  source: TOrderSource;
  centeredNumber?: boolean;
};

export const OrderDetailsContent = ({
  source,
  centeredNumber = false,
}: TOrderDetailsContentProps): React.JSX.Element => {
  const { id } = useParams();
  const { order, isLoading, error } = useOrderDetails(id, source);

  if (isLoading) {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className={styles.status}>
        <p className='text text_type_main-medium'>Заказ не найден</p>
        <p className='text text_type_main-default text_color_inactive mt-4'>
          {error ?? 'Проверьте адрес страницы'}
        </p>
      </div>
    );
  }

  return <OrderInfo order={order} centeredNumber={centeredNumber} />;
};

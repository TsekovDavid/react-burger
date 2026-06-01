import orderDoneIcon from '../../assets/images/order-done.svg';

import styles from './order-details.module.css';

type TOrderDetailsProps = {
  orderNumber: number;
};

export const OrderDetails = ({ orderNumber }: TOrderDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.content}>
      <p className={`${styles.number} text text_type_digits-large`}>{orderNumber}</p>
      <p className={`${styles.identifier} text text_type_main-medium`}>
        идентификатор заказа
      </p>
      <div className={styles['icon-wrapper']}>
        <img
          className={styles['icon-image']}
          src={orderDoneIcon}
          alt=''
          aria-hidden='true'
        />
      </div>
      <p className={`${styles.status} text text_type_main-default`}>
        Ваш заказ начали готовить
      </p>
      <p
        className={`${styles.description} text text_type_main-default text_color_inactive`}
      >
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

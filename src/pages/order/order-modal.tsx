import { Modal } from '@components/modal/modal';
import { OrderDetailsContent } from '@components/order-details-content/order-details-content';

import type { TOrderSource } from '@hooks/use-order-details';

import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

type TOrderModalProps = {
  source: TOrderSource;
};

export const OrderModal = ({ source }: TOrderModalProps): React.JSX.Element => {
  const navigate = useNavigate();

  const handleClose = useCallback(() => {
    void navigate(-1);
  }, [navigate]);

  return (
    <Modal onClose={handleClose}>
      <OrderDetailsContent source={source} />
    </Modal>
  );
};

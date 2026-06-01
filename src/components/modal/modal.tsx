import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';

type TModalProps = {
  title?: string;
  onClose: () => void;
  children: ReactNode;
};

export const Modal = ({ title, onClose, children }: TModalProps): React.JSX.Element => {
  const modalRoot = document.getElementById('modals');

  if (!modalRoot) {
    throw new Error('Modal root not found');
  }

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  return createPortal(
    <div className={styles.modal}>
      <ModalOverlay onClick={onClose} />
      <div
        className={styles.container}
        onClick={(event) => event.stopPropagation()}
        role='dialog'
        aria-modal='true'
        aria-labelledby={title ? 'modal-title' : undefined}
      >
        <button className={styles['close-button']} type='button' onClick={onClose}>
          <CloseIcon type='primary' />
        </button>
        {title ? (
          <div className={styles.header}>
            <h2 id='modal-title' className={styles.title}>
              {title}
            </h2>
          </div>
        ) : null}
        {children}
      </div>
    </div>,
    modalRoot
  );
};

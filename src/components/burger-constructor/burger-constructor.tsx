import {
  addIngredient,
  moveIngredient,
  removeIngredient,
  selectBurgerConstructorBun,
  selectBurgerConstructorIngredients,
  selectOrderIngredientIds,
  selectTotalPrice,
} from '@services/burger-constructor/burger-constructor-slice';
import { DND_ITEM_TYPES } from '@services/dnd';
import { useAppDispatch, useAppSelector } from '@services/hooks';
import { sendOrder } from '@services/order/order-actions';
import { selectOrderError, selectOrderIsLoading } from '@services/order/order-slice';

import type { TConstructorIngredient, TIngredient } from '@utils/types';

import styles from './burger-constructor.module.css';

import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

type TDraggedIngredient = {
  ingredient: TIngredient;
};

type TDraggedConstructorIngredient = {
  constructorId: string;
  index: number;
};

const isDraggedIngredient = (item: unknown): item is TDraggedIngredient => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'ingredient' in item &&
    typeof (item as TDraggedIngredient).ingredient === 'object'
  );
};

type TConstructorIngredientItemProps = {
  ingredient: TConstructorIngredient;
  index: number;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  onRemove: (constructorId: string) => void;
};

const ConstructorIngredientItem = ({
  ingredient,
  index,
  onMove,
  onRemove,
}: TConstructorIngredientItemProps): React.JSX.Element => {
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_ITEM_TYPES.constructorIngredient,
      item: { constructorId: ingredient.constructorId, index },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient.constructorId, index]
  );
  const [, dropRef] = useDrop<TDraggedConstructorIngredient>({
    accept: DND_ITEM_TYPES.constructorIngredient,
    hover: (item) => {
      if (item.constructorId === ingredient.constructorId || item.index === index) {
        return;
      }

      onMove(item.index, index);
      item.index = index;
    },
  });
  const handleClose = useCallback(() => {
    onRemove(ingredient.constructorId);
  }, [ingredient.constructorId, onRemove]);

  return (
    <li
      ref={(node) => {
        dropRef(node);
      }}
      className={`${styles.item} ${isDragging ? styles['item-dragging'] : ''}`}
    >
      <span
        ref={(node) => {
          dragRef(node);
        }}
        className={styles['drag-handle']}
      >
        <DragIcon type='primary' />
      </span>
      <ConstructorElement
        text={ingredient.name}
        price={ingredient.price}
        thumbnail={ingredient.image}
        handleClose={handleClose}
      />
    </li>
  );
};

export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const bun = useAppSelector(selectBurgerConstructorBun);
  const ingredients = useAppSelector(selectBurgerConstructorIngredients);
  const totalPrice = useAppSelector(selectTotalPrice);
  const orderIngredientIds = useAppSelector(selectOrderIngredientIds);
  const isOrderLoading = useAppSelector(selectOrderIsLoading);
  const orderError = useAppSelector(selectOrderError);
  const [{ isOver, draggedIngredientType }, dropRef] = useDrop<
    TDraggedIngredient,
    void,
    { isOver: boolean; draggedIngredientType: TIngredient['type'] | null }
  >({
    accept: DND_ITEM_TYPES.ingredient,
    drop: ({ ingredient }) => {
      dispatch(addIngredient(ingredient));
    },
    collect: (monitor) => {
      const item = monitor.getItem();
      const ingredient = isDraggedIngredient(item) ? item.ingredient : null;

      return {
        isOver: monitor.isOver(),
        draggedIngredientType: ingredient?.type ?? null,
      };
    },
  });

  const handleMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      dispatch(moveIngredient({ dragIndex, hoverIndex }));
    },
    [dispatch]
  );
  const handleRemove = useCallback(
    (constructorId: string) => {
      dispatch(removeIngredient(constructorId));
    },
    [dispatch]
  );
  const handleOrderClick = useCallback(() => {
    if (orderIngredientIds.length === 0) {
      return;
    }

    void dispatch(sendOrder(orderIngredientIds));
  }, [dispatch, orderIngredientIds]);
  const isBunHover = isOver && draggedIngredientType === 'bun';
  const isIngredientHover =
    isOver && draggedIngredientType !== null && draggedIngredientType !== 'bun';

  return (
    <section
      ref={(node) => {
        dropRef(node);
      }}
      className={styles['burger-constructor']}
    >
      {bun ? (
        <div className={`${styles['locked-element']} ${styles['top-locked']}`}>
          <ConstructorElement
            type='top'
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles['placeholder-top']} ${
            isBunHover ? styles['placeholder-active'] : ''
          }`}
        >
          <span className='text text_type_main-default text_color_inactive'>
            Перетащите булку
          </span>
        </div>
      )}
      <ul className={`${styles.list} custom-scroll`}>
        {ingredients.length > 0 ? (
          ingredients.map((ingredient, index) => (
            <ConstructorIngredientItem
              key={ingredient.constructorId}
              ingredient={ingredient}
              index={index}
              onMove={handleMove}
              onRemove={handleRemove}
            />
          ))
        ) : (
          <li
            className={`${styles.placeholder} ${styles['placeholder-list']} ${
              isIngredientHover ? styles['placeholder-active'] : ''
            }`}
          >
            <span className='text text_type_main-default text_color_inactive'>
              Перетащите ингредиенты
            </span>
          </li>
        )}
      </ul>
      {bun ? (
        <div className={`${styles['locked-element']} ${styles['bottom-locked']}`}>
          <ConstructorElement
            type='bottom'
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      ) : (
        <div
          className={`${styles.placeholder} ${styles['placeholder-bottom']} ${
            isBunHover ? styles['placeholder-active'] : ''
          }`}
        >
          <span className='text text_type_main-default text_color_inactive'>
            Перетащите булку
          </span>
        </div>
      )}
      <div className={styles.footer}>
        <div className={styles.total}>
          <span className='text text_type_digits-medium'>{totalPrice}</span>
          <CurrencyIcon type='primary' className={styles.currency} />
        </div>
        <Button
          htmlType='button'
          type='primary'
          size='large'
          onClick={handleOrderClick}
          disabled={!bun || isOrderLoading}
        >
          {isOrderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>
      {orderError ? (
        <p className={`${styles.error} text text_type_main-default text_color_inactive`}>
          {orderError}
        </p>
      ) : null}
    </section>
  );
};

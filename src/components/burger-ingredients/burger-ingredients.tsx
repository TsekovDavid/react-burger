import { selectIngredientCounts } from '@services/burger-constructor/burger-constructor-slice';
import { setCurrentIngredient } from '@services/current-ingredient/current-ingredient-slice';
import { DND_ITEM_TYPES } from '@services/dnd';
import { useAppDispatch, useAppSelector } from '@services/hooks';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useDrag } from 'react-dnd';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TIngredientCardProps = {
  ingredient: TIngredient;
  count: number;
  onIngredientClick: (ingredient: TIngredient) => void;
};

const IngredientCard = ({
  ingredient,
  count,
  onIngredientClick,
}: TIngredientCardProps): React.JSX.Element => {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [{ isDragging }, dragRef] = useDrag(
    () => ({
      type: DND_ITEM_TYPES.ingredient,
      item: { ingredient },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [ingredient]
  );

  dragRef(cardRef);

  return (
    <li className={styles['card-item']}>
      <button
        ref={cardRef}
        className={`${styles.card} ${isDragging ? styles['card-dragging'] : ''}`}
        type='button'
        onClick={() => onIngredientClick(ingredient)}
      >
        {count > 0 ? <Counter count={count} extraClass={styles.counter} /> : null}
        <img className={styles.image} src={ingredient.image} alt={ingredient.name} />
        <div className={styles.price}>
          <span className='text text_type_digits-default'>{ingredient.price}</span>
          <CurrencyIcon type='primary' />
        </div>
        <span className={`${styles.name} text text_type_main-default`}>
          {ingredient.name}
        </span>
      </button>
    </li>
  );
};

export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const ingredientCounts = useAppSelector(selectIngredientCounts);
  const [currentTab, setCurrentTab] = useState<TIngredientType>('bun');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<TIngredientType, HTMLElement | null>>({
    bun: null,
    sauce: null,
    main: null,
  });

  const groupedIngredients = useMemo(
    () => ({
      bun: ingredients.filter((ingredient) => ingredient.type === 'bun'),
      sauce: ingredients.filter((ingredient) => ingredient.type === 'sauce'),
      main: ingredients.filter((ingredient) => ingredient.type === 'main'),
    }),
    [ingredients]
  );

  const handleTabClick = useCallback((value: string) => {
    const nextTab = value as TIngredientType;

    setCurrentTab(nextTab);
    sectionRefs.current[nextTab]?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }, []);

  const handleScroll = useCallback(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const containerTop = scrollContainer.getBoundingClientRect().top;
    const sectionEntries = Object.entries(sectionRefs.current) as Array<
      [TIngredientType, HTMLElement | null]
    >;

    let nearestTab: TIngredientType = 'bun';
    let nearestDistance = Number.POSITIVE_INFINITY;

    sectionEntries.forEach(([tab, section]) => {
      if (!section) {
        return;
      }

      const distance = Math.abs(section.getBoundingClientRect().top - containerTop);

      if (distance < nearestDistance) {
        nearestTab = tab;
        nearestDistance = distance;
      }
    });

    setCurrentTab((previousTab) =>
      previousTab === nearestTab ? previousTab : nearestTab
    );
  }, []);

  const handleIngredientClick = useCallback(
    (ingredient: TIngredient) => {
      dispatch(setCurrentIngredient(ingredient));
    },
    [dispatch]
  );

  const renderIngredientCard = (ingredient: TIngredient): React.JSX.Element => {
    const count = ingredientCounts[ingredient._id] ?? 0;

    return (
      <IngredientCard
        key={ingredient._id}
        ingredient={ingredient}
        count={count}
        onIngredientClick={handleIngredientClick}
      />
    );
  };

  return (
    <section className={styles['burger-ingredients']}>
      <h1 className='text text_type_main-large'>Соберите бургер</h1>
      <nav className='mt-5'>
        <ul className={styles.menu} role='tablist'>
          <Tab value='bun' active={currentTab === 'bun'} onClick={handleTabClick}>
            Булки
          </Tab>
          <Tab value='sauce' active={currentTab === 'sauce'} onClick={handleTabClick}>
            Соусы
          </Tab>
          <Tab value='main' active={currentTab === 'main'} onClick={handleTabClick}>
            Начинки
          </Tab>
        </ul>
      </nav>
      <div
        ref={scrollContainerRef}
        className={`${styles.content} custom-scroll mt-10 pr-2`}
        onScroll={handleScroll}
      >
        <section
          ref={(node) => {
            sectionRefs.current.bun = node;
          }}
          className={styles.section}
        >
          <h2 className='text text_type_main-medium mb-6'>Булки</h2>
          <ul className={styles.grid}>
            {groupedIngredients.bun.map(renderIngredientCard)}
          </ul>
        </section>
        <section
          ref={(node) => {
            sectionRefs.current.sauce = node;
          }}
          className={styles.section}
        >
          <h2 className='text text_type_main-medium mb-6'>Соусы</h2>
          <ul className={styles.grid}>
            {groupedIngredients.sauce.map(renderIngredientCard)}
          </ul>
        </section>
        <section
          ref={(node) => {
            sectionRefs.current.main = node;
          }}
          className={styles.section}
        >
          <h2 className='text text_type_main-medium mb-6'>Начинки</h2>
          <ul className={styles.grid}>
            {groupedIngredients.main.map(renderIngredientCard)}
          </ul>
        </section>
      </div>
    </section>
  );
};

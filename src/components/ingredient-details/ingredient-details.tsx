import type { TIngredient } from '@utils/types';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient;
};

const NUTRITION_LABELS = [
  { key: 'calories', label: 'Калории,ккал' },
  { key: 'proteins', label: 'Белки, г' },
  { key: 'fat', label: 'Жиры, г' },
  { key: 'carbohydrates', label: 'Углеводы, г' },
] as const;

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element => {
  return (
    <div className={styles.content}>
      <img className={styles.image} src={ingredient.image_large} alt={ingredient.name} />
      <p className={`${styles.name} text text_type_main-medium`}>{ingredient.name}</p>
      <ul className={styles.nutrition}>
        {NUTRITION_LABELS.map(({ key, label }) => (
          <li key={key} className={styles['nutrition-item']}>
            <span className='text text_type_main-default text_color_inactive'>
              {label}
            </span>
            <span
              className={`${styles['nutrition-value']} text text_type_digits-default text_color_inactive`}
            >
              {ingredient[key]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

import { useState, type ChangeEvent } from 'react';

export const useForm = <T extends Record<string, string>>(initialValues: T) => {
  const [values, setValues] = useState<T>(initialValues);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  return { values, setValues, handleChange };
};

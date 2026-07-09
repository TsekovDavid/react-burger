import { useAppDispatch } from '@services/hooks';
import { clearUserError } from '@services/user/user-slice';

import { useEffect } from 'react';

export const useClearUserError = (): void => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(clearUserError());
  }, [dispatch]);
};

import { useAppSelector } from '@services/hooks';
import { selectIsAuthChecked, selectUser } from '@services/user/user-slice';

import type { ReactNode } from 'react';
import type { Location } from 'react-router-dom';

import styles from './protected-route.module.css';

import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { Navigate, useLocation } from 'react-router-dom';

type TProtectedRouteProps = {
  children: ReactNode;
  onlyUnAuth?: boolean;
};

type TLocationState = {
  from?: Location;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
}: TProtectedRouteProps): React.JSX.Element => {
  const user = useAppSelector(selectUser);
  const isAuthChecked = useAppSelector(selectIsAuthChecked);
  const location = useLocation();
  const locationState = location.state as TLocationState | null;

  if (!isAuthChecked) {
    return (
      <div className={styles.status}>
        <Preloader />
      </div>
    );
  }

  if (onlyUnAuth && user) {
    return <Navigate to={locationState?.from ?? '/'} replace />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return <>{children}</>;
};

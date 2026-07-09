import { AppHeader } from '@components/app-header/app-header';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient';
import { IngredientModal } from '@pages/ingredient/ingredient-modal';
import { LoginPage } from '@pages/login/login';
import { NotFoundPage } from '@pages/not-found/not-found';
import { ProfileDetailsPage } from '@pages/profile-details/profile-details';
import { ProfileOrdersPage } from '@pages/profile-orders/profile-orders';
import { ProfilePage } from '@pages/profile/profile';
import { RegisterPage } from '@pages/register/register';
import { ResetPasswordPage } from '@pages/reset-password/reset-password';
import { useAppDispatch } from '@services/hooks';
import { fetchIngredients } from '@services/ingredients/ingredients-actions';
import { checkUserAuth } from '@services/user/user-actions';

import styles from './app.module.css';

import { useEffect, useRef } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';

type TLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const locationState = location.state as TLocationState | null;
  const backgroundLocation = locationState?.background;
  const isInitialized = useRef(false);

  useEffect(() => {
    if (isInitialized.current) {
      return;
    }

    isInitialized.current = true;
    void dispatch(fetchIngredients());
    void dispatch(checkUserAuth());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path='/' element={<Home />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route
          path='/register'
          element={
            <ProtectedRoute onlyUnAuth>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/login'
          element={
            <ProtectedRoute onlyUnAuth>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ProtectedRoute onlyUnAuth>
              <ResetPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileDetailsPage />} />
          <Route path='orders' element={<ProfileOrdersPage />} />
        </Route>
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
      {backgroundLocation ? (
        <Routes>
          <Route path='/ingredients/:id' element={<IngredientModal />} />
        </Routes>
      ) : null}
    </div>
  );
};

export default App;

import { AppHeader } from '@components/app-header/app-header';
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

import styles from './app.module.css';

import { useEffect } from 'react';
import { Route, Routes, useLocation, type Location } from 'react-router-dom';

type TLocationState = {
  background?: Location;
};

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const locationState = location.state as TLocationState | null;
  const backgroundLocation = locationState?.background;

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={backgroundLocation ?? location}>
        <Route path='/' element={<Home />} />
        <Route path='/ingredients/:id' element={<IngredientPage />} />
        <Route path='/feed' element={<FeedPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='/profile' element={<ProfilePage />}>
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

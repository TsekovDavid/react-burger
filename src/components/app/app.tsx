import { AppHeader } from '@components/app-header/app-header';
import { FeedPage } from '@pages/feed/feed';
import { ForgotPasswordPage } from '@pages/forgot-password/forgot-password';
import { Home } from '@pages/home/home';
import { IngredientPage } from '@pages/ingredient/ingredient';
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
import { Route, Routes } from 'react-router-dom';

export const App = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(fetchIngredients());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes>
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
    </div>
  );
};

export default App;

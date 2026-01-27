import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams
} from 'react-router-dom';
import { ProtectedRoute } from '../protected-route/protected-route';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { TIngredient } from '@utils-types';
import { selectIngredients } from '@selectors';
import {
  checkUserAuth,
  setAuthChecked
} from '../../services/slices/user/userSlice';
import { fetchIngredients } from '../../services/slices/ingredients/ingredientsSlice';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const background = location.state?.background;
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  const onCloseModal = () => {
    navigate(-1);
  };

  const formatOrderNumber = (number: string | undefined): string => {
    if (!number) return '';

    const num = parseInt(number, 10);
    if (isNaN(num)) return '';

    return `#${num.toString().padStart(6, '0')}`;
  };

  const ModalWithOrderFeed = () => {
    const { number } = useParams<{ number: string }>();

    return (
      <Modal title={formatOrderNumber(number)} onClose={onCloseModal}>
        <OrderInfo />
      </Modal>
    );
  };

  const ModalWithOrderProfile = () => {
    const { number } = useParams<{ number: string }>();

    return (
      <ProtectedRoute>
        <Modal title={formatOrderNumber(number)} onClose={onCloseModal}>
          <OrderInfo />
        </Modal>
      </ProtectedRoute>
    );
  };

  useEffect(() => {
    dispatch(checkUserAuth()).finally(() => dispatch(setAuthChecked(true)));
  }, [dispatch]);

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/register' element={<Register />} />
        <Route path='/login' element={<Login />} />
        <Route
          path='/profile'
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route
          path='/profile/orders'
          element={
            <ProtectedRoute>
              <ProfileOrders />
            </ProtectedRoute>
          }
        />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route path='/feed/:number' element={<ModalWithOrderFeed />} />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='Детали ингредиента' onClose={onCloseModal}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={<ModalWithOrderProfile />}
          />
        </Routes>
      )}
    </div>
  );
};

export default App;

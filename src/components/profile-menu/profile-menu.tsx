import { FC, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/user/userSlice';
import { clearOrders } from '../../services/slices/order/orderSlice';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(clearOrders());
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Ошибка при выходе:', error);
    }
  }, [dispatch, navigate]);

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};

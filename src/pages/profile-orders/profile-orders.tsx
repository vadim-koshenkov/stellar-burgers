import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectFeedTape,
  selectOrdersLoading,
  getOrders
} from '../../services/slices/order/orderSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectFeedTape);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(getOrders());
  }, [dispatch]);

  if (isLoading && !orders) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders || []} />;
};

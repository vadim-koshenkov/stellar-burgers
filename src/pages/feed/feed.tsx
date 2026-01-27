import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  selectOrdersLoading,
  fetchFeeds
} from '../../services/slices/order/orderSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectOrdersLoading);

  useEffect(() => {
    dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = useCallback(() => {
    console.log('Кнопка "Обновить" нажата');
    dispatch(fetchFeeds())
      .unwrap()
      .then(() => console.log('Заказы успешно обновлены'))
      .catch((error) => console.error('Ошибка обновления:', error));
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};

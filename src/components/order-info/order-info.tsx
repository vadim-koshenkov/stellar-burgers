import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { useSelector, useDispatch } from '../../services/store';
import { selectOrder, selectOrdersLoading } from '@selectors';
import { fetchOrderByNumber } from '../../services/slices/order/orderSlice';
import { selectIngredients } from '@selectors';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const orderData = useSelector(selectOrder);
  const isLoading = useSelector(selectOrdersLoading);
  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (number) {
      const orderNumber = parseInt(number, 10);
      if (!isNaN(orderNumber)) {
        dispatch(fetchOrderByNumber(orderNumber));
      }
    }
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce<TIngredientsWithCount>(
      (acc, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) {
    return <Preloader />;
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};

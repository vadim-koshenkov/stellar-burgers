import { FC, useMemo, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import { selectBurgerIngredients } from '../../services/slices/burgerConstructor/burgerConstructorSlice';
import {
  selectOrder,
  selectOrdersLoading,
  createOrder,
  clearOrder,
  fetchFeeds
} from '../../services/slices/order/orderSlice';
import {
  selectUser,
  selectIsAuthChecked
} from '../../services/slices/user/userSlice';
import { clearBurgerConstructor } from '../../services/slices/burgerConstructor/burgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const burgerIngredients = useSelector(selectBurgerIngredients);
  const orderRequest = useSelector(selectOrdersLoading);
  const orderModalData = useSelector(selectOrder);
  const user = useSelector(selectUser);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  const constructorItems = burgerIngredients;

  const onOrderClick = useCallback(() => {
    if (!constructorItems.bun) {
      alert('Пожалуйста, выберите булку для бургера');
      return;
    }

    if (!user) {
      navigate('/login', { state: { from: '/' } });
      return;
    }

    if (orderRequest) return;

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map(
        (ingredient: TConstructorIngredient) => ingredient._id
      ),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .catch((error) => {
        console.error('Ошибка создания заказа:', error);
        alert('Ошибка создания заказа. Попробуйте еще раз.');
      });
  }, [constructorItems, user, orderRequest, dispatch, navigate]);

  const closeOrderModal = useCallback(() => {
    dispatch(clearOrder());
    if (orderModalData) {
      dispatch(clearBurgerConstructor());
      dispatch(fetchFeeds());
    }
  }, [dispatch, orderModalData]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  useEffect(
    () => () => {
      dispatch(clearOrder());
    },
    [dispatch]
  );

  if (!isAuthChecked) {
    return <div>Проверка авторизации...</div>;
  }

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};

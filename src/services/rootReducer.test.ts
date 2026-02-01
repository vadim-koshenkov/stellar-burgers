import rootReducer from './rootReducer';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    // Вызываем rootReducer с undefined и неизвестным экшеном
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние содержит все необходимые слайсы
    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');

    // Проверяем структуру каждого слайса
    // burgerConstructor
    expect(state.burgerConstructor).toHaveProperty('burgerIngredients');
    expect(state.burgerConstructor.burgerIngredients).toHaveProperty('bun');
    expect(state.burgerConstructor.burgerIngredients).toHaveProperty('ingredients');
    expect(state.burgerConstructor).toHaveProperty('isLoading');
    expect(state.burgerConstructor).toHaveProperty('error');
    
    // Проверяем начальные значения burgerConstructor
    expect(state.burgerConstructor.burgerIngredients.bun).toBeNull();
    expect(state.burgerConstructor.burgerIngredients.ingredients).toEqual([]);
    expect(state.burgerConstructor.isLoading).toBe(false);
    expect(state.burgerConstructor.error).toBeNull();

    // ingredients
    expect(state.ingredients).toHaveProperty('ingredients');
    expect(state.ingredients).toHaveProperty('isLoading');
    expect(state.ingredients).toHaveProperty('error');
    
    // Проверяем начальные значения ingredients
    expect(state.ingredients.ingredients).toEqual([]);
    expect(state.ingredients.isLoading).toBe(false);
    expect(state.ingredients.error).toBeNull();

    // order
    expect(state.order).toHaveProperty('feed');
    expect(state.order.feed).toHaveProperty('success');
    expect(state.order.feed).toHaveProperty('orders');
    expect(state.order.feed).toHaveProperty('total');
    expect(state.order.feed).toHaveProperty('totalToday');
    expect(state.order).toHaveProperty('ordersTape');
    expect(state.order).toHaveProperty('order');
    expect(state.order).toHaveProperty('orderNumber');
    expect(state.order).toHaveProperty('isLoading');
    expect(state.order).toHaveProperty('error');
    
    // Проверяем начальные значения order
    expect(state.order.feed.success).toBe(false);
    expect(state.order.feed.orders).toEqual([]);
    expect(state.order.feed.total).toBe(0);
    expect(state.order.feed.totalToday).toBe(0);
    expect(state.order.ordersTape).toEqual([]);
    expect(state.order.order).toBeNull();
    expect(state.order.orderNumber).toBeNull();
    expect(state.order.isLoading).toBe(false);
    expect(state.order.error).toBeNull();

    // user
    expect(state.user).toHaveProperty('user');
    expect(state.user).toHaveProperty('isAuthChecked');
    expect(state.user).toHaveProperty('isLoading');
    expect(state.user).toHaveProperty('error');
    
    // Проверяем начальные значения user
    expect(state.user.user).toBeNull();
    expect(state.user.isAuthChecked).toBe(false);
    expect(state.user.isLoading).toBe(false);
    expect(state.user.error).toBeNull();
  });
});
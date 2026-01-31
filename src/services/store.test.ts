import store from './store';
import { RootState } from './store';

describe('Redux Store', () => {
  test('должен быть правильно сконфигурирован', () => {
    const state = store.getState();

    expect(state).toHaveProperty('burgerConstructor');
    expect(state).toHaveProperty('ingredients');
    expect(state).toHaveProperty('order');
    expect(state).toHaveProperty('user');

    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
    expect(store).toHaveProperty('subscribe');
    expect(store).toHaveProperty('replaceReducer');
  });

  test('RootState тип должен соответствовать структуре состояния', () => {
    const state: RootState = store.getState();

    expect(state.burgerConstructor).toBeDefined();
    expect(state.ingredients).toBeDefined();
    expect(state.order).toBeDefined();
    expect(state.user).toBeDefined();
  });
});

import reducer, {
  initialState,
  addIngredient,
  removeIngredient,
  moveIngredient,
  addBun,
  clearBurgerConstructor
} from '../burgerConstructorSlice';
import { TIngredient } from '@utils-types';

describe('burgerConstructorSlice reducer', () => {
  const mockIngredient: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093e',
    name: 'Филе Люминесцентного тетраодонтимформа',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 988,
    image: 'https://code.s3.yandex.net/react/code/meat-03.png',
    image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png',
    image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png'
  };

  const mockBun: TIngredient = {
    ...mockIngredient,
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    price: 1255
  };

  test('должен возвращать initialState при первом вызове', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  describe('addIngredient', () => {
    test('должен добавлять ингредиент с уникальным id', () => {
      const action = addIngredient(mockIngredient);
      const state = reducer(initialState, action);

      expect(state.burgerIngredients.ingredients).toHaveLength(1);
      expect(state.burgerIngredients.ingredients[0].name).toBe(
        'Филе Люминесцентного тетраодонтимформа'
      );
      expect(state.burgerIngredients.ingredients[0].id).toBeDefined();
      expect(state.burgerIngredients.ingredients[0].id).not.toBe(
        mockIngredient._id
      );
    });

    test('должен сохранять порядок добавления ингредиентов', () => {
      let state = reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: '1' })
      );
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '2' }));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '3' }));

      expect(state.burgerIngredients.ingredients).toHaveLength(3);
      expect(state.burgerIngredients.ingredients[0]._id).toBe('1');
      expect(state.burgerIngredients.ingredients[1]._id).toBe('2');
      expect(state.burgerIngredients.ingredients[2]._id).toBe('3');
    });
  });

  describe('addBun', () => {
    test('должен добавлять булку', () => {
      const action = addBun(mockBun);
      const state = reducer(initialState, action);

      expect(state.burgerIngredients.bun).toEqual(mockBun);
    });

    test('должен заменять существующую булку', () => {
      const firstBun = { ...mockBun, _id: 'bun-1' };
      const secondBun = { ...mockBun, _id: 'bun-2' };

      let state = reducer(initialState, addBun(firstBun));
      state = reducer(state, addBun(secondBun));

      expect(state.burgerIngredients.bun).toEqual(secondBun);
      expect(state.burgerIngredients.bun?._id).toBe('bun-2');
    });
  });

  describe('removeIngredient', () => {
    test('должен удалять ингредиент по id', () => {
      let state = reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: '1' })
      );
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '2' }));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '3' }));

      const ingredientToRemove = state.burgerIngredients.ingredients[1];
      const action = removeIngredient(ingredientToRemove.id);
      state = reducer(state, action);

      expect(state.burgerIngredients.ingredients).toHaveLength(2);
      expect(
        state.burgerIngredients.ingredients.find((i) => i._id === '2')
      ).toBeUndefined();
      expect(state.burgerIngredients.ingredients[0]._id).toBe('1');
      expect(state.burgerIngredients.ingredients[1]._id).toBe('3');
    });

    test('не должен изменять state при удалении несуществующего ингредиента', () => {
      let state = reducer(initialState, addIngredient(mockIngredient));
      const originalState = { ...state };

      const action = removeIngredient('non-existent-id');
      state = reducer(state, action);

      expect(state).toEqual(originalState);
    });
  });

  describe('moveIngredient', () => {
    test('должен перемещать ингредиенты местами', () => {
      let state = reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: '1', name: 'Первый' })
      );
      state = reducer(
        state,
        addIngredient({ ...mockIngredient, _id: '2', name: 'Второй' })
      );
      state = reducer(
        state,
        addIngredient({ ...mockIngredient, _id: '3', name: 'Третий' })
      );

      const action = moveIngredient({ first: 0, second: 2 });
      state = reducer(state, action);

      expect(state.burgerIngredients.ingredients[0].name).toBe('Третий');
      expect(state.burgerIngredients.ingredients[1].name).toBe('Второй');
      expect(state.burgerIngredients.ingredients[2].name).toBe('Первый');
    });

    test('должен корректно работать при одинаковых индексах', () => {
      let state = reducer(
        initialState,
        addIngredient({ ...mockIngredient, _id: '1' })
      );
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '2' }));

      const originalIngredients = [...state.burgerIngredients.ingredients];
      const action = moveIngredient({ first: 1, second: 1 });
      state = reducer(state, action);

      expect(state.burgerIngredients.ingredients).toEqual(originalIngredients);
    });
  });

  describe('clearBurgerConstructor', () => {
    test('должен очищать все ингредиенты и булку', () => {
      let state = reducer(initialState, addBun(mockBun));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '1' }));
      state = reducer(state, addIngredient({ ...mockIngredient, _id: '2' }));

      const action = clearBurgerConstructor();
      state = reducer(state, action);

      expect(state.burgerIngredients.bun).toBeNull();
      expect(state.burgerIngredients.ingredients).toHaveLength(0);
    });
  });
});

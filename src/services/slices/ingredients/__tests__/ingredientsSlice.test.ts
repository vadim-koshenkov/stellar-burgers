import reducer, {
  initialState,
  fetchIngredients,
  selectIngredients,
  selectIngredientsLoading,
  selectIngredientsError
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Краторная булка N-200i',
      type: 'bun',
      proteins: 80,
      fat: 24,
      carbohydrates: 53,
      calories: 420,
      price: 1255,
      image: 'https://code.s3.yandex.net/react/code/bun-02.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://code.s3.yandex.net/react/code/meat-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png'
    }
  ];

  test('должен возвращать initialState при первом вызове', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  describe('fetchIngredients pending', () => {
    test('должен устанавливать isLoading в true и очищать error', () => {
      const stateWithError = {
        ...initialState,
        error: 'Previous error',
        isLoading: false
      };

      const action = { type: fetchIngredients.pending.type };
      const state = reducer(stateWithError, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients fulfilled', () => {
    test('должен устанавливать isLoading в false и записывать данные', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
        ingredients: []
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });

    test('должен заменять существующие данные', () => {
      const existingState = {
        ...initialState,
        ingredients: [{ ...mockIngredients[0], _id: 'old' }],
        isLoading: true
      };

      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };

      const state = reducer(existingState, action);

      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });
  });

  describe('fetchIngredients rejected', () => {
    test('должен устанавливать isLoading в false и записывать ошибку', () => {
      const loadingState = {
        ...initialState,
        isLoading: true,
        error: null
      };

      const errorMessage = 'Network error';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual([]);
    });

    test('должен использовать сообщение по умолчанию если error.message отсутствует', () => {
      const loadingState = {
        ...initialState,
        isLoading: true
      };

      const action = {
        type: fetchIngredients.rejected.type,
        error: {}
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки ингредиентов');
    });
  });

  describe('selectors', () => {
    const mockState = {
      ingredients: {
        ingredients: mockIngredients,
        isLoading: true,
        error: 'Test error'
      }
    };

    test('selectIngredients должен возвращать массив ингредиентов', () => {
      const result = selectIngredients(mockState);
      expect(result).toEqual(mockIngredients);
    });

    test('selectIngredientsLoading должен возвращает isLoading', () => {
      const result = selectIngredientsLoading(mockState);
      expect(result).toBe(true);
    });

    test('selectIngredientsError должен возвращать error', () => {
      const result = selectIngredientsError(mockState);
      expect(result).toBe('Test error');
    });
  });
});

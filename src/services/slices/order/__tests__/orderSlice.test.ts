import reducer, {
  initialState,
  fetchFeeds,
  createOrder,
  clearOrder,
  clearOrders,
  selectOrdersLoading,
  selectOrder
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice reducer', () => {
  const mockOrder: TOrder = {
    _id: '1',
    ingredients: ['ing1', 'ing2'],
    status: 'done',
    name: 'Test Burger',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    number: 12345
  };

  test('должен возвращать initialState при первом вызове', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  describe('async actions', () => {
    test('fetchFeeds.pending должен устанавливать isLoading в true', () => {
      const action = { type: fetchFeeds.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fetchFeeds.fulfilled должен записывать данные и устанавливать isLoading в false', () => {
      const mockFeed = {
        success: true,
        orders: [mockOrder],
        total: 100,
        totalToday: 10
      };

      const loadingState = { ...initialState, isLoading: true };
      const action = {
        type: fetchFeeds.fulfilled.type,
        payload: mockFeed
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.feed).toEqual(mockFeed);
    });

    test('fetchFeeds.rejected должен записывать ошибку и устанавливать isLoading в false', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Failed to fetch feeds';
      const action = {
        type: fetchFeeds.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('createOrder', () => {
    test('pending должен устанавливать isLoading в true', () => {
      const action = { type: createOrder.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled должен записывать заказ и номер', () => {
      const loadingState = { ...initialState, isLoading: true };
      const mockResponse = {
        order: mockOrder,
        success: true
      };

      const action = {
        type: createOrder.fulfilled.type,
        payload: mockResponse
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.order).toEqual(mockOrder);
      expect(state.orderNumber).toBe(mockOrder.number);
    });

    test('rejected должен записывать ошибку', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Order creation failed';

      const action = {
        type: createOrder.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('clear actions', () => {
    test('clearOrder должен очищать order и orderNumber', () => {
      const stateWithOrder = {
        ...initialState,
        order: mockOrder,
        orderNumber: mockOrder.number,
        isLoading: true
      };

      const state = reducer(stateWithOrder, clearOrder());

      expect(state.order).toBeNull();
      expect(state.orderNumber).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    test('clearOrders должен очищать feed и ordersTape', () => {
      const stateWithOrders = {
        ...initialState,
        feed: {
          success: true,
          orders: [mockOrder],
          total: 100,
          totalToday: 10
        },
        ordersTape: [mockOrder]
      };

      const state = reducer(stateWithOrders, clearOrders());

      expect(state.feed).toEqual({
        success: false,
        orders: [],
        total: 0,
        totalToday: 0
      });
      expect(state.ordersTape).toEqual([]);
    });
  });

  describe('selectors', () => {
    const mockState = {
      order: {
        isLoading: true,
        order: mockOrder,
        orderNumber: mockOrder.number,
        error: null,
        feed: {
          success: false,
          orders: [],
          total: 0,
          totalToday: 0
        },
        ordersTape: []
      }
    };

    test('selectOrdersLoading должен возвращать isLoading', () => {
      const result = selectOrdersLoading(mockState);
      expect(result).toBe(true);
    });

    test('selectOrder должен возвращать order', () => {
      const result = selectOrder(mockState);
      expect(result).toEqual(mockOrder);
    });
  });
});

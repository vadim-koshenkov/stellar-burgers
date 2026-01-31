import reducer, {
  initialState,
  registerUser,
  getUser,
  updateUser,
  setUser,
  setAuthChecked,
  clearUserState,
  selectIsLoading,
  selectUserError
} from '../userSlice';
import { TUser } from '@utils-types';

describe('userSlice reducer', () => {
  const mockUser: TUser = {
    email: 'misterywou@gmail.com',
    name: 'Vadim'
  };

  test('должен возвращать initialState при первом вызове', () => {
    const state = reducer(undefined, { type: '@@INIT' });
    expect(state).toEqual(initialState);
  });

  describe('registerUser', () => {
    test('pending должен устанавливать isLoading в true', () => {
      const action = { type: registerUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled должен устанавливать user и isAuthChecked', () => {
      const loadingState = { ...initialState, isLoading: true };
      const action = {
        type: registerUser.fulfilled.type,
        payload: mockUser
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    test('rejected должен записывать ошибку', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Registration failed';

      const action = {
        type: registerUser.rejected.type,
        error: { message: errorMessage }
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('getUser', () => {
    test('pending должен устанавливать isLoading в true', () => {
      const action = { type: getUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled должен устанавливать user и isAuthChecked', () => {
      const loadingState = { ...initialState, isLoading: true };
      const action = {
        type: getUser.fulfilled.type,
        payload: mockUser
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecked).toBe(true);
    });

    test('rejected должен устанавливать isAuthChecked в true и записывать ошибку', () => {
      const loadingState = { ...initialState, isLoading: true };
      const errorMessage = 'Failed to get user';

      const action = {
        type: getUser.rejected.type,
        payload: errorMessage
      };

      const state = reducer(loadingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.isAuthChecked).toBe(true);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('updateUser', () => {
    test('pending должен устанавливать isLoading в true', () => {
      const action = { type: updateUser.pending.type };
      const state = reducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    test('fulfilled должен обновлять пользователя', () => {
      const existingUser = { email: 'old@example.com', name: 'Old Name' };
      const existingState = {
        ...initialState,
        user: existingUser,
        isLoading: true
      };

      const updatedUser = { ...mockUser, name: 'Updated Name' };
      const action = {
        type: updateUser.fulfilled.type,
        payload: updatedUser
      };

      const state = reducer(existingState, action);

      expect(state.isLoading).toBe(false);
      expect(state.user).toEqual(updatedUser);
    });
  });

  describe('sync actions', () => {
    test('setUser должен устанавливать пользователя', () => {
      const action = setUser(mockUser);
      const state = reducer(initialState, action);

      expect(state.user).toEqual(mockUser);
    });

    test('setAuthChecked должен устанавливать isAuthChecked', () => {
      const action = setAuthChecked(true);
      const state = reducer(initialState, action);

      expect(state.isAuthChecked).toBe(true);
    });

    test('clearUserState должен очищать user и error', () => {
      const stateWithData = {
        ...initialState,
        user: mockUser,
        error: 'Some error'
      };

      const state = reducer(stateWithData, clearUserState());

      expect(state.user).toBeNull();
      expect(state.error).toBeNull();
    });
  });

  describe('selectors', () => {
    const mockState = {
      user: {
        user: mockUser,
        isAuthChecked: true,
        isLoading: true,
        error: 'Test error'
      }
    };

    test('selectIsLoading должен возвращать isLoading', () => {
      const result = selectIsLoading(mockState);
      expect(result).toBe(true);
    });

    test('selectUserError должен возвращать error', () => {
      const result = selectUserError(mockState);
      expect(result).toBe('Test error');
    });
  });
});

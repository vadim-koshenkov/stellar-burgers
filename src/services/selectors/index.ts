import { RootState } from '../store';

// BurgerConstructor selectors
export const selectBurgerConstructorState = (state: RootState) =>
  state.burgerConstructor;
export const selectBurgerIngredients = (state: RootState) =>
  state.burgerConstructor?.burgerIngredients || { bun: null, ingredients: [] };

// Order selectors
export const selectOrderState = (state: RootState) => state.order;
export const selectOrder = (state: RootState) => state.order?.order || null;
export const selectOrdersLoading = (state: RootState) =>
  state.order?.isLoading || false;
export const selectOrderNumber = (state: RootState) =>
  state.order?.orderNumber || null;

// User selectors
export const selectUserState = (state: RootState) => state.user;
export const selectUser = (state: RootState) => state.user?.user || null;
export const selectIsAuthChecked = (state: RootState) =>
  state.user?.isAuthChecked || false;

// Ingredients selectors
export const selectIngredientsState = (state: RootState) => state.ingredients;
export const selectIngredients = (state: RootState) =>
  state.ingredients?.ingredients || [];
export const selectIngredientsLoading = (state: RootState) =>
  state.ingredients?.isLoading || false;

import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

export type TBurgerConstructorState = {
  burgerIngredients: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  isLoading: boolean;
  error: string | null;
};

export const initialState: TBurgerConstructorState = {
  burgerIngredients: {
    bun: null,
    ingredients: []
  },
  isLoading: false,
  error: null
};

const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const uniqueId = nanoid();
      const ingredientWithUniqueId = {
        ...action.payload,
        id: uniqueId
      } as TConstructorIngredient;
      state.burgerIngredients.ingredients.push(ingredientWithUniqueId);
    },

    addBun: (state, action: PayloadAction<TIngredient>) => {
      state.burgerIngredients.bun = action.payload;
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ first: number; second: number }>
    ) => {
      const rememberedIngredient =
        state.burgerIngredients.ingredients[action.payload.first];
      state.burgerIngredients.ingredients[action.payload.first] =
        state.burgerIngredients.ingredients[action.payload.second];
      state.burgerIngredients.ingredients[action.payload.second] =
        rememberedIngredient;
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burgerIngredients.ingredients =
        state.burgerIngredients.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },

    clearBurgerConstructor: (state) => {
      state.burgerIngredients.bun = null;
      state.burgerIngredients.ingredients = [];
    }
  },
  selectors: {
    selectBurgerIngredients: (state) => state.burgerIngredients,
    selectBurgerConstructorLoading: (state) => state.isLoading,
    selectBurgerConstructorError: (state) => state.error
  }
});

export const {
  selectBurgerIngredients,
  selectBurgerConstructorLoading,
  selectBurgerConstructorError
} = burgerConstructorSlice.selectors;

export const {
  addIngredient,
  addBun,
  moveIngredient,
  removeIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;

export default burgerConstructorSlice.reducer;

import { combineReducers } from '@reduxjs/toolkit';
import burgerConstructorReducer from './slices/burgerConstructor/burgerConstructorSlice';
import ingredientReducer from './slices/ingredients/ingredientsSlice';
import orderReducer from './slices/order/orderSlice';
import userReducer from './slices/user/userSlice';

const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  ingredients: ingredientReducer,
  order: orderReducer,
  user: userReducer
});

export default rootReducer;

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import {
  getFeedsApi,
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi,
  TFeedsResponse
} from '@api';

export type TOrderState = {
  feed: TFeedsResponse;
  ordersTape: TOrder[];
  order: TOrder | null;
  orderNumber: number | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  feed: {
    success: false,
    orders: [],
    total: 0,
    totalToday: 0
  },
  ordersTape: [],
  order: null,
  orderNumber: null,
  isLoading: false,
  error: null
};

export const fetchFeeds = createAsyncThunk('feed/fetchFeeds', async () => {
  const response = await getFeedsApi();
  return response;
});

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchByNumber',
  async (orderNumber: number) => {
    const response = await getOrderByNumberApi(orderNumber);
    return response;
  }
);

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientsId: string[]) => {
    const response = await orderBurgerApi(ingredientsId);
    return response;
  }
);

export const getOrders = createAsyncThunk('order/getOrders', async () => {
  const response = await getOrdersApi();
  return response;
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.orderNumber = null;
      state.isLoading = false;
    },
    clearOrders: (state) => {
      state.feed = {
        success: false,
        orders: [],
        total: 0,
        totalToday: 0
      };
      state.ordersTape = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchFeeds
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.feed = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.error.message as string) || 'Ошибка загрузки ленты заказов';
      })
      // fetchOrderByNumber
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.order = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.orders[0];
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.error.message as string) || 'Ошибка получения заказа';
      })
      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload.order;
        state.orderNumber = action.payload.order.number;
        state.feed.orders = [action.payload.order, ...state.feed.orders];
        state.feed.total += 1;
        state.feed.totalToday += 1;
        state.ordersTape = [action.payload.order, ...state.ordersTape];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.error.message as string) || 'Ошибка создания заказа';
      })
      // getOrders
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ordersTape = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          (action.error.message as string) || 'Ошибка получения заказов';
      });
  },
  selectors: {
    selectOrders: (state) => state.feed.orders,

    selectOrdersLoading: (state) => state.isLoading,

    selectOrder: (state) => state.order,

    selectFeed: (state) => state.feed,

    selectFeedTape: (state) => state.ordersTape
  }
});

export const {
  selectOrders,
  selectOrdersLoading,
  selectOrder,
  selectFeed,
  selectFeedTape
} = orderSlice.selectors;

export const { clearOrder, clearOrders } = orderSlice.actions;

export default orderSlice.reducer;

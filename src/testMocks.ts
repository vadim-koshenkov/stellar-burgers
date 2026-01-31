// Моки для API и других модулей
jest.mock('@api', () => ({
  getIngredientsApi: jest.fn(),
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
  orderBurgerApi: jest.fn(),
  getOrdersApi: jest.fn(),
  registerUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

jest.mock('@utils/cookie', () => ({
  getCookie: jest.fn(),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Очистка моков после каждого теста
afterEach(() => {
  jest.clearAllMocks();
});

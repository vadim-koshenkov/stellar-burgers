describe('rootReducer', () => {
  test('должен экспортироваться по умолчанию', () => {
    // Проверяем, что можем экспортировать rootReducer по умолчанию
    const rootReducer = require('./rootReducer').default;
    expect(typeof rootReducer).toBe('function');

    // Проверяем, что это функция
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState).toBeDefined();
  });
});

export {}

describe('проверяем приложениe', function () {
  // Общая функция для посещения страницы без авторизации
  const visitWithoutAuth = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    cy.visit('http://localhost:4000');
  };

  // Общая функция для посещения страницы с авторизацией
    const visitWithAuth = () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.setCookie('accessToken', 'accessToken');
    cy.window().then((win) => {
      win.localStorage.setItem('refreshToken', JSON.stringify('refreshToken'));
    });
    cy.visit('http://localhost:4000');
    cy.wait('@getIngredients');
    cy.wait('@getUser');
  };

  it('добавление булки в конструктор', () => {
    visitWithoutAuth();
    cy.get('[data-cy="constructor-bun-1"]').should('not.exist');
    cy.get('[data-cy="constructor-bun-2"]').should('not.exist');

    cy.get('[data-cy="ingredients-bun"]').contains('Добавить').click();

    cy.get('[data-cy="constructor-bun-1"]').contains('Краторная булка N-200i').should('exist');
    cy.get('[data-cy="constructor-bun-2"]').contains('Краторная булка N-200i').should('exist');
  })

  it('добавление ингридиента в конструктор', () => {
    visitWithoutAuth();
    cy.get('[data-cy="constructor"]').contains('Биокотлета из марсианской Магнолии').should('not.exist');

    cy.get('[data-cy="ingredients-mains"]').contains('Добавить').click();

    cy.get('[data-cy="constructor"]').contains('Биокотлета из марсианской Магнолии').should('exist');
  })

  it('открытие модалок', () => {
    visitWithoutAuth();
    cy.get('[data-cy="modal"]').should('not.exist')

    cy.get('[data-cy="ingredients-bun"]').contains('Краторная булка N-200i').click();

    cy.get('[data-cy="modal"]').should('exist')
    cy.get('[data-cy="modal"]').contains('Краторная булка N-200i')
    cy.get('[data-cy="button-close"]').click();
    cy.get('[data-cy="modal"]').should('not.exist')
  })

  it('заказ', () => {
    visitWithAuth();
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' })
    cy.get('[data-cy=ingredients-bun]').contains('Добавить').click();
    cy.get('[data-cy=ingredients-mains]').contains('Добавить').click();
    cy.get('[data-cy="order"]').click();

    cy.get('[data-cy="modal"]').should('exist');
    cy.get('[data-cy="button-close"]').click();

    cy.get('[data-cy="modal"]').should('not.exist');
    
    cy.get('[data-cy="constructor"]').contains('Биокотлета из марсианской Магнолии').should('not.exist');
    cy.get('[data-cy="constructor"]').contains('Краторная булка N-200i').should('not.exist');
  })
});
import { expect, test, type Locator, type Page } from '@playwright/test';

const API_PATTERN = '**/api/**';
const BUN_NAME = 'Тестовая космическая булка';
const SAUCE_NAME = 'Тестовый межзвёздный соус';

const mockApiWithHar = async (page: Page): Promise<void> => {
  await page.route(API_PATTERN, (route) => route.abort('blockedbyclient'));
  await page.routeFromHAR('e2e/fixtures/ingredients.har', { notFound: 'fallback' });
  await page.routeFromHAR('e2e/fixtures/user.har', { notFound: 'fallback' });
  await page.routeFromHAR('e2e/fixtures/order.har', { notFound: 'fallback' });
};

const dragIngredient = async (
  page: Page,
  source: Locator,
  target: Locator
): Promise<void> => {
  const dataTransfer = await page.evaluateHandle(() => new DataTransfer());

  await source.dispatchEvent('dragstart', { dataTransfer });
  await target.dispatchEvent('dragenter', { dataTransfer });
  await target.dispatchEvent('dragover', { dataTransfer });
  await target.dispatchEvent('drop', { dataTransfer });
  await source.dispatchEvent('dragend', { dataTransfer });
  await dataTransfer.dispose();
};

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('accessToken', 'Bearer test-access-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });
  await mockApiWithHar(page);
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Соберите бургер' })).toBeVisible();
});

test('creates an order from dragged ingredients', async ({ page }) => {
  const bunCard = page.getByRole('button', { name: new RegExp(BUN_NAME) });
  const sauceCard = page.getByRole('button', { name: new RegExp(SAUCE_NAME) });
  const orderButton = page.getByRole('button', { name: 'Оформить заказ' });
  const burgerConstructor = page.locator('section').filter({ has: orderButton });

  await bunCard.click();

  const ingredientDialog = page.getByRole('dialog');
  await expect(ingredientDialog).toBeVisible();
  await expect(ingredientDialog.getByText('Детали ингредиента')).toBeVisible();
  await expect(ingredientDialog.getByText(BUN_NAME)).toBeVisible();
  await expect(ingredientDialog.getByText('200', { exact: true })).toBeVisible();
  await ingredientDialog.getByRole('button', { name: 'Закрыть' }).click();
  await expect(ingredientDialog).toBeHidden();

  await dragIngredient(page, bunCard, burgerConstructor);
  await dragIngredient(page, sauceCard, burgerConstructor);

  await expect(burgerConstructor.getByText(`${BUN_NAME} (верх)`)).toBeVisible();
  await expect(burgerConstructor.getByText(`${BUN_NAME} (низ)`)).toBeVisible();
  await expect(burgerConstructor.getByText(SAUCE_NAME)).toBeVisible();
  await expect(burgerConstructor.getByText('225', { exact: true })).toBeVisible();
  await expect(orderButton).toBeEnabled();

  const orderRequestPromise = page.waitForRequest(
    (request) => request.method() === 'POST' && request.url().endsWith('/api/orders')
  );
  await orderButton.click();

  const orderRequest = await orderRequestPromise;
  expect(orderRequest.postDataJSON()).toEqual({
    ingredients: ['test-bun-id', 'test-sauce-id', 'test-bun-id'],
  });

  const orderDialog = page.getByRole('dialog');
  await expect(orderDialog).toBeVisible();
  await expect(orderDialog.getByText('424242', { exact: true })).toBeVisible();
  await expect(orderDialog.getByText('идентификатор заказа')).toBeVisible();
  await orderDialog.getByRole('button', { name: 'Закрыть' }).click();
  await expect(orderDialog).toBeHidden();
});

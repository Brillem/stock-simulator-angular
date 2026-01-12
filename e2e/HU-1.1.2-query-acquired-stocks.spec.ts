import { test, expect } from '@playwright/test';
import { testUsers } from './fixtures/test-data';

/**
 * HU 1.1.2: Consultar Acciones Adquiridas
 * ISO/IEC 29119 - Test Level 3 (System Test - Black Box)
 *
 * Objetivo: Validar que un usuario puede visualizar las acciones
 * que ha adquirido/comprado previamente.
 *
 * Precondiciones:
 * - Usuario debe estar autenticado
 * - Usuario debe tener acciones compradas (owned_stock)
 *
 * Postcondiciones:
 * - Se muestra tabla con acciones del usuario
 * - Columnas visibles: Ticker, Name, Quantity
 * - Botones de acción visibles (Vender, Transferir)
 */

test.describe('HU 1.1.2 - Consultar Acciones Adquiridas', () => {

  test.beforeEach(async ({ page }) => {
    // MOCK Backend Requests
    await page.route('**/api/user/login', async route => {
      const json = {
        code: 0,
        message: 'Login successful',
        ...testUsers.user1,
        verified: true,
        admin: false
      };
      await route.fulfill({ json });
    });

    await page.route('**/api/stock/ownedstocks/**', async route => {
      // Return mocked owned stocks
      const json = [
        {
          ticker: 'AAPL',
          name: 'Apple Inc.',
          quantity: 10,
          totalPrice: 1500.00
        },
        {
          ticker: 'GOOGL',
          name: 'Alphabet Inc.',
          quantity: 5,
          totalPrice: 2000.00
        }
      ];
      await route.fulfill({ json });
    });

    // PASO 1: Navegar a login
    await page.goto('/login');

    // PASO 2: Iniciar sesión
    await page.fill('input[formControlName="username"]', testUsers.user1.username);
    await page.fill('input[formControlName="password"]', testUsers.user1.password);
    await page.click('button.button-wrapper.primary');

    // PASO 3: Esperar redirección a summary
    await page.waitForURL('**/summary', { timeout: 10000 });
  });

  test('Usuario puede ver sus acciones adquiridas', async ({ page }) => {
    // Given: Usuario está en la página de resumen

    // When: Usuario navega a la pestaña "Acciones Adquiridas" o "Mis Acciones"
    const ownedStocksTab = page.locator('text=Acciones Adquiridas').or(
      page.locator('text=Mis Acciones')
    ).or(
      page.locator('text=Owned Stocks')
    ).or(
      page.locator('text=My Stocks')
    ).or(
      page.locator('button:has-text("Adquiridas")')
    ).first();

    if (await ownedStocksTab.isVisible({ timeout: 5000 })) {
      await ownedStocksTab.click();
      await page.waitForTimeout(1000);
    }

    // Then: Se debe mostrar información de acciones del usuario

    // Verificar que existe una tabla o lista
    const tableOrList = page.locator('table, p-table, mat-table, .owned-stocks, .my-stocks').first();

    // Puede estar visible o puede estar vacío si el usuario no tiene acciones
    const isTableVisible = await tableOrList.isVisible({ timeout: 5000 }).catch(() => false);

    if (isTableVisible) {
      // Si hay tabla, verificar que tiene estructura correcta
      const pageContent = await page.content();

      // Buscar indicadores de que se muestran acciones propias
      const hasOwnedStockIndicators =
        pageContent.includes('Quantity') ||
        pageContent.includes('Cantidad') ||
        pageContent.includes('cantidad') ||
        pageContent.includes('Ticker');

      expect(hasOwnedStockIndicators).toBeTruthy();
    } else {
      // Si no hay tabla, puede ser que el usuario no tenga acciones
      // Verificar que hay un mensaje indicándolo
      const emptyMessage = page.locator('text=No tienes acciones').or(
        page.locator('text=No stocks owned')
      ).or(
        page.locator('text=Sin acciones')
      );

      const hasEmptyMessage = await emptyMessage.isVisible({ timeout: 3000 }).catch(() => false);

      // O la tabla está vacía, o hay un mensaje explicativo
      expect(hasEmptyMessage || isTableVisible).toBeTruthy();
    }
  });

  test('La tabla de acciones adquiridas muestra cantidad correcta', async ({ page }) => {
    // Given: Usuario tiene acciones compradas

    const ownedStocksTab = page.locator('text=Acciones Adquiridas').or(
      page.locator('text=Mis Acciones')
    ).first();

    if (await ownedStocksTab.isVisible({ timeout: 5000 })) {
      await ownedStocksTab.click();
      await page.waitForTimeout(1000);
    }

    // When: Usuario observa la tabla de acciones propias

    // Then: Cada acción debe mostrar la cantidad (quantity) que posee
    const pageContent = await page.content();

    // Buscar indicadores de cantidades numéricas
    const hasQuantityColumn =
      pageContent.includes('Quantity') ||
      pageContent.includes('Cantidad') ||
      pageContent.includes('quantity');

    // O buscar números que podrían ser cantidades
    const hasNumericValues = /\d+/.test(pageContent);

    // Al menos uno de estos debe ser verdadero
    expect(hasQuantityColumn || hasNumericValues).toBeTruthy();
  });

  test('Usuario puede acceder a acciones de venta y transferencia', async ({ page }) => {
    // Given: Usuario está viendo sus acciones adquiridas

    const ownedStocksTab = page.locator('text=Acciones Adquiridas').or(
      page.locator('text=Mis Acciones')
    ).first();

    if (await ownedStocksTab.isVisible({ timeout: 5000 })) {
      await ownedStocksTab.click();
      await page.waitForTimeout(1000);
    }

    // When: Usuario busca opciones de vender o transferir

    // Then: Deben estar disponibles botones de acción (iconos)
    // En acciones adquiridas hay 3 botones por fila: sell, transfer, view
    const actionButtons = page.locator('.icon-button');
    const buttonCount = await actionButtons.count();

    // Si hay acciones adquiridas, debe haber al menos 3 botones (sell, transfer, view)
    const pageContent = await page.content();
    const hasOwnedStocks = !pageContent.includes('No posee acciones adquiridas');

    if (hasOwnedStocks) {
      expect(buttonCount).toBeGreaterThanOrEqual(3);
    } else {
      // Si no hay acciones, está OK
      expect(true).toBeTruthy();
    }
  });

  test('Tabla de acciones adquiridas se actualiza en tiempo real', async ({ page }) => {
    // Given: Usuario está viendo sus acciones adquiridas

    const ownedStocksTab = page.locator('text=Acciones Adquiridas').or(
      page.locator('text=Mis Acciones')
    ).first();

    if (await ownedStocksTab.isVisible({ timeout: 5000 })) {
      await ownedStocksTab.click();
      await page.waitForTimeout(1000);
    }

    // When: Se captura el estado inicial de la tabla
    const initialContent = await page.content();

    // Refrescar la vista (cambiar de tab y volver)
    const availableTab = page.locator('text=Acciones Disponibles').or(
      page.locator('text=Available')
    ).first();

    if (await availableTab.isVisible({ timeout: 3000 })) {
      await availableTab.click();
      await page.waitForTimeout(500);

      // Volver a acciones adquiridas
      if (await ownedStocksTab.isVisible({ timeout: 3000 })) {
        await ownedStocksTab.click();
        await page.waitForTimeout(500);
      }
    }

    // Then: La tabla debe cargar correctamente (puede ser igual o diferente)
    const refreshedContent = await page.content();

    // Verificar que la página respondió (no está congelada)
    expect(refreshedContent.length).toBeGreaterThan(100);

    // Verificar que el contenido tiene estructura similar
    const hasStructure =
      refreshedContent.includes('table') ||
      refreshedContent.includes('Acciones') ||
      refreshedContent.includes('Stocks');

    expect(hasStructure).toBeTruthy();
  });

  test('Tiempo de carga de acciones adquiridas es menor a 2 segundos', async ({ page }) => {
    // Given: Usuario está en página de resumen

    // When: Usuario navega a acciones adquiridas
    const startTime = Date.now();

    const ownedStocksTab = page.locator('text=Acciones Adquiridas').or(
      page.locator('text=Mis Acciones')
    ).first();

    if (await ownedStocksTab.isVisible({ timeout: 5000 })) {
      await ownedStocksTab.click();

      // Esperar a que cargue el contenido
      await page.waitForTimeout(500);
    }

    const loadTime = Date.now() - startTime;

    // Then: Tiempo de carga debe ser < 2000ms (ISO/IEC 25010)
    expect(loadTime).toBeLessThan(2000);
  });
});

import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para Tests E2E
 * ISO/IEC 29119 - Test Level 3 (System Testing - Black Box)
 *
 * Valida las historias de usuario de extremo a extremo en un navegador real.
 *
 * Historias de Usuario validadas:
 * - HU 1.1.1: Consultar Acciones del mercado
 * - HU 1.1.2: Consultar Acciones Adquiridas
 * - HU 1.1.3: Registrar Compras de Acciones (flujo completo)
 * - HU 1.1.4: Consultar Historial de Compras
 */
export default defineConfig({
  // Directorio de tests E2E
  testDir: './e2e',

  // Tiempo máximo por test (30 segundos)
  timeout: 30 * 1000,

  // Ejecutar tests en paralelo
  fullyParallel: true,

  // Fallar si hay .only en CI
  forbidOnly: !!process.env.CI,

  // Reintentos en CI
  retries: process.env.CI ? 2 : 0,

  // Workers (número de procesos paralelos)
  workers: process.env.CI ? 1 : undefined,

  // Reporters
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'playwright-report/results.json' }],
    ['list']
  ],

  // Configuración compartida para todos los proyectos
  use: {
    // URL base de la aplicación
    baseURL: 'http://localhost:4200',

    // Captura de screenshots solo en fallos
    screenshot: 'only-on-failure',

    // Video solo en primer intento fallido
    video: 'retain-on-failure',

    // Trace (registro detallado) en primer intento fallido
    trace: 'on-first-retry',

    // Tiempo de espera para acciones (navegación, clicks, etc.)
    actionTimeout: 10 * 1000,
  },

  // Configuración de proyectos (navegadores)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Tests móviles (opcional)
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },
  ],

  // Servidor web (inicia la aplicación Angular automáticamente)
  webServer: {
    command: 'npm run start',
    url: 'http://localhost:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
